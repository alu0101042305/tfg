const express = require('express')
const app = express()
const getData = require('./scrapData.js')

app.use(express.static('build'))

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/build/index.html');
})

app.get('/*', async function(req, res) {
  const contaminante = req.path.slice(1)
  try {
    const data = JSON.stringify(await getData(contaminante), null, 4)
    res.send(data)
  } catch (error) {
    console.error(error)
  }
})

app.listen(80)