const url = "https://www3.gobiernodecanarias.org/medioambiente/calidaddelaire/datosOnLineContaminante.do";
const cheerio = require('cheerio')

const {POST} = require('./post');

/**
 * Retorna los últimos datos proporcionados por la página del gobierno de Canarias
 * @param {Number} contaminante ID del contaminante
 * @return {Object} Objeto con las localizaciones como key y sus respectivos valores
 */
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