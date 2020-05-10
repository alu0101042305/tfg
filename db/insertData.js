const Influx = require('influx');
const fs = require('fs')
const XLSX = require('xlsx')
const csv2array = require('./csv2array')
const fixZoneName = require('./fixZoneName')
require('../.env.js')
const influx = new Influx.InfluxDB(`http://admin:${process.env.ADMIN_PASSWORD}@127.0.0.1:8086/contaminantes`);

/**
 * Este programa parsea archivos en formato xls|xlsx e inserta los datos obtenidos en la BD.
 * --max-old-space-size=8192 es necesario usar esta opción para evitar errores de memoria
 */
if(process.argv[2]) {
  parse(process.argv[2])
} else {
  parseDir('./data')
}


function parseDir(dir) {
  fs.readdirSync(dir).forEach(file => {
    if(file[0] != '.')
      parse(`${dir}/${file}`)
  })
}

// Omite la primera línea si no es relevante
function cleanFirstRow(csv) {
  if(!csv[0][0].match(/Fecha/i)) {
    csv.shift()
  }
  if(!csv[0][0].match(/Fecha/i)) {
    throw new Error(`No se encuentra la palabra clave 'Fecha'`)
  }
}

/**
 * 
 * @param {string[][]} rows 
 * @param {string[]} measurements 
 * @param {string} zone 
 */
function parseRows(rows, measurements, zone){
  console.log(`Parsing ${zone}`)
  const points = []
  rows.forEach(row => {
    var [day, month, year] = row.shift().split('/').map(Number)
    const hour = Number(row.shift())
    if(!day) return;
    year += (year < 2000 ? 2000 : 0)
    month -= 1
    const date = new Date(year, month, day, hour)
    measurements.forEach(measurement => {
      const value = row.shift().trim()
      if(value.match(/\d+,\d+/)) {
        throw new Error('Bad number formatting: ' + value)
      }
      if(value === '' || isNaN(value)) return;
      points.push({
        measurement: measurement.replace(',', '.'),
        tags: {zone},
        fields: {value: Number(value)},
        timestamp: date
      })
    })
  })
  return points
}

function parse(file) {
  console.log(`Parsing ${file}`)
  const workbook = XLSX.readFile(file)
  const sheetNames = workbook.SheetNames
  sheetNames.forEach(sheetName => {
    const sheet = workbook.Sheets[sheetName]
    const csv = csv2array(XLSX.utils.sheet_to_csv(sheet))
    try {
      cleanFirstRow(csv)
    } catch(e) {
      console.log('Ignored ' + sheetName)
      return;
    }
    var measurements = csv.shift()
      .slice(2)
      .filter(Boolean)
      .map(s => /[^\s]+/.exec(s)[0].replace(',', '.'))

    var end = measurements.length
    measurements.forEach((e, i) => {
      if(e.match(/Fecha/i)) {
        end = i
      }
    })
    measurements = measurements.slice(0, end)
    
    influx.writePoints(parseRows(csv, measurements, fixZoneName(sheetName.trim())), {
      precision: 'h'
    }).catch(err => {
      const mess = err.message
      console.log(mess ? mess : err)
    })
  })
}
