const express = require('express')
const app = express()
const Influx = require('influx');
const getData = require('./scrapData.js')
const bodyParser = require('body-parser')

const influx = new Influx.InfluxDB('http://client:password@127.0.0.1:8086/contaminantes');

app.use(express.static('build'))
app.use(bodyParser.text())

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/build/index.html');
})

app.get('/*', async function(req, res) {
  const contaminante = req.path.slice(1)
  try {
    const data = JSON.stringify(await getData(contaminante), null, 4)
    res.send(data)
  } catch (error) {
    res.send('{}')
  }
})

app.post('/consult', async function(req, res){
  try {
    const consult = await influx.query(req.body)
    console.log(consult)
    res.send(JSON.stringify({
      data: consult,
      groups: consult.groupRows
    }))
  } catch(error) {
    console.log(error)
    console.log(req.body)
    res.send('{}')
  }
  
})

app.listen(80)