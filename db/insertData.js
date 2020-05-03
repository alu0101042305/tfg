const Influx = require('influx');
const fs = require('fs')
require('../.env.js')
const XLSX = require('xlsx')

const influx = new Influx.InfluxDB(`http://admin:${process.env.ADMIN_PASSWORD}@127.0.0.1:8086/contaminantes`);

const dir = './data'

fs.readdirSync(dir).forEach(file => {
  parse(dir + '/' + file)
})

function parse(file) {
  const workbook = XLSX.readFile(file)
  workbook.SheetNames.slice(1).forEach(sheetName => {
    const points = []
    const sheet = workbook.Sheets[sheetName]
    const csv = XLSX.utils.sheet_to_csv(sheet).split('\n').map(row => row.split(','))
    const zone = csv[0][0].trim()
    const measurements = csv[1].slice(2).filter(Boolean).map(s => /[^\s]+/.exec(s)[0])
    csv.slice(2).forEach(row => {
      var [day, month, year] = row.shift().split('/').map(Number)
      if(!day) return;
      year += (year < 2000 ? 2000 : 0)
      month -= 1
      const date = new Date(year, month, day, Number(row.shift()))
      measurements.forEach(measurement => {
        const value = row.shift()
        if(value === '' || isNaN(value)) return;
        points.push({
          measurement,
          tags: {zone},
          fields: {value: Number(value)},
          timestamp: date
        })
      })
    })
    influx.writePoints(points, {
      precision: 'h'
    })
  })
}
