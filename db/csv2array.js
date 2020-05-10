
const literal = `(?<=(^|,)").*?(?="(,|$))`
const value = `(?<=^|,)[^,"]*(?=,|$)`
const regExp = new RegExp(`(${literal})|(${value})`, 'g')

function csv2array(csv) {
  return csv.split('\n').map(row => row.match(regExp))
}

module.exports = csv2array
