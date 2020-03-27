const http = require('https')
const https = require('http')
const iconv = require('iconv-lite');
http.DEFAULT_PORT = 80
https.DEFAULT_PORT = 443

function parse(data) {
  var result = ''
  Object.keys(data).forEach(e => {
    result += `${e}=${data[e]}&`
  })
  if(result == '') 
    return ''
  return result.slice(0, -1)
}

class Method {



}

const POST = {

  options: {
    method: 'POST',
    headers: {}
  },

  urlForm(data) {
    this.data = data
    this.options.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    return this
  },

  to(url) {
    return request(url, this.data, this.options)
  }

}

function request(url, data, options) {
  var protocol;
  const divided_url = /http(s?):\/\/(.+?)(:\d{1,4})?(\/.*)/.exec(url)

  if(divided_url == null)
    throw new Error('Bad formatted url')

  const [ _, isHttps, hostname, port, path ] = divided_url
  
  if(isHttps)
    protocol = https
  else
    protocol = http

  if(port)
    options.port = Number(port.slice(1))
  else
    options.port = protocol.DEFAULT_PORT
  
  options.hostname = hostname
  options.path = path
  data = parse(data) // ***
  options.headers['Content-Length'] = data.length

  body = []

  return new Promise(function(accept, reject) {
    const req = http.request(options, res => {
    
      res.on('data', d => {
        body.push(d)
      })

      res.on('end', () => {
        body = iconv.decode(Buffer.concat(body), 'ISO-8859-1')
        res.body = body
        if(res.statusCode == 200){
          accept(res)
        }
        else {
          reject(res)
        }
      })

    })
    
    req.on('error', error => {
      reject(error)
    })

    req.write(data)
    req.end()
  })
}

module.exports = {POST}

