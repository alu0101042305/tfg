const url = "https://www3.gobiernodecanarias.org/medioambiente/calidaddelaire/datosOnLineContaminante.do";
const cheerio = require('cheerio')

const {POST} = require('./post');

async function getData(contaminante) {

    var respond = await POST
        .urlForm({cana: contaminante, zona: -100})
        .to(url)
    
    const html = respond.body

    const data = {}
    const $ = cheerio.load(html)
    $('.tablaDisplayTag').each((i, e) => {
        const head = $('thead th', e)
        const fila1 = $('td', $('tbody tr', e)[0])
        const fila2 = $('td', $('tbody tr', e)[1])

        for(var i = 2; i < head.length; ++i) {
            data[$(head[i]).text()] = Number( $(fila1[i]).text() || $(fila2[i]).text() || -1)
            ++i;
        }
    })
    return data
}

module.exports = getData