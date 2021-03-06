
/**
 * Crea (o modifica) los cuadrados que equivalen a cada estación en el MapChart 
 * @param {d3.selection} selection 
 * @param {Contaminante} contaminante 
 * @param {Object} rectBounds dimenciones del cuadro
 */
export function card(selection, contaminante, rectBounds = {w: 30, h: 20}) {
    var rect = selection.select('circle')
    if(rect.empty()){
        rect = selection.append('circle')
    }
    rect
        .attr('r', 10)
        .attr("stroke", "white")
        .style("stroke-width", "1px")
        .attr('fill', d => getColor(d, contaminante))
    
    var text = selection.select('text')
    if(text.empty()){
        text = selection.append('text')
    }
    text
        .attr("fill", "white")
        .text(d => d.value)
    
    //text.nodes().forEach(setTextBounds.bind(null, rectBounds))
}

/**
 * Asigna las pocisiones al elemento text
 * @param {Object} rectBounds 
 * @param {Element} text 
 */
export function setTextBounds(texts, rectBounds = {w: 30, h: 20}) {
    texts.nodes().forEach((text) => {
      const {width} = text.getBBox()
      text.setAttribute('x', -width / 2) 
      text.setAttribute('y', rectBounds.h / 4)
    })
}

/**
 * Retorna un color en función del valor del contaminante y su valor medido
 * @param {Object} data
 * @param {Contaminante} contaminante 
 * @returns {string}
 */
function getColor(data, contaminante) {
    const val = data.value
    switch (true) {
        case (val <= contaminante.range[0]):
            return 'deepskyblue'
        case (val <= contaminante.range[1]):
            return 'mediumseagreen'
        case (val <= contaminante.range[2]):
            return 'coral'
        case (val <= contaminante.range[3]):
            return 'crimson'
        default:
            return 'purple'
    }
}