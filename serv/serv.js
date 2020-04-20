const express = require('express')
const app = express()
const Influx = require('influx');
const getData = require('./scrapData.js')

const influx = new Influx.InfluxDB({
  host: 'localhost',
  database: 'contaminantes',
  user: 'client',
  password: 'password' // el usuario 'client' solo tiene permisos de lectura
});

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
    res.send('{}')
  }
})

app.post('/consult', function(req, res){
  
})

app.listen(80)