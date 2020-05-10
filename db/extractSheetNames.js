const fs = require('fs')
const XLSX = require('xlsx')
const fixZoneName = require('./fixZoneName')
/**
 * Extrae los nombres de las hojas
 */

const names = new Set()

fs.readdirSync('./data').forEach(file => {
  if(file[0] != '.'){
    parseFile('./data/' + file)
  }
})

fs.writeFileSync('./sheetNames.txt', Array.from(names).join('\n'), 'utf8')

function parseFile(file) {
  console.log('Parsing ' + file)
  const workbook = XLSX.readFile(file)
  const sheetNames = workbook.SheetNames
  sheetNames.map(e => e.trim()).forEach(e => {
    names.add(fixZoneName(e))
  })
}

