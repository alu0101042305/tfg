import React from 'react'
import * as d3 from "d3"
import Loading from './../Loading'
import { Grow } from '@material-ui/core';
import card from './Card';

// Localizaciones de las estaciones
const locations = require('./locations.json').points

/**
 * Mapa de Canarias (unicolor) que muestra la última información disponible de la Red de aire de Canarias.
 * El componente utiliza las mismas dimensiones que su padre.
 * Las islas se renderizan sobre un canvas (para mejorar la optimización).
 * Los cuadros con las medidas de los contaminantes se renderizan sobre un svg.
 * @property {Contaminante} contaminante Contaminante a mostrar
 */
class MapChart extends React.Component {

    constructor(props) {
        super(props);
        this.ref = React.createRef()
        this.state = {
            loading_resources: 0
        }

        this.zoom = d3.zoom()
            .scaleExtent([1, 64])
            .on('zoom', () => this.setZoom(d3.event.transform))
        this.projection = d3.geoMercator()
        this.path = d3.geoPath()
        this.canvas = d3.create('canvas')
        this.svg = d3.create('svg')
            .on('click', this.svgClick.bind(this))
            .call(this.zoom)
        this.rects = this.svg.append('g').selectAll('rect')
        this.transform = {k: 1, x: 0, y: 0}
    }

    // añade el canvas y el svg a this.node
    initDOM() {
        // Es importante añadir el SVG después del canvas,
        // porque los eventos de ratón se van a escuchar en el segundo
        this.node.appendChild(this.canvas.node())
        this.node.appendChild(this.svg.node())
    }

    // incrementa el número de recursos cargándose
    incLoading() {
        this.setState((state) => ({
            loading_resources: state.loading_resources + 1
        }))
    }

    // decrementa el número de recursos cargándose
    decLoading() {
        this.setState((state) => ({
            loading_resources: state.loading_resources - 1
        }))
    }

    // carga json de Canarias
    async loadGeo() {
        this.incLoading()
        this.geojson = await d3.json("/json/canary.json")
        this.decLoading()
    }

    // carga los datos del contaminante
    async loadData() {
        this.incLoading()
        const values = await (await fetch('/' + this.props.contaminante.id) ).json()
        this.data = locations.map(e => ({
            point: this.projection([e.longitude, e.latitude]),
            value: values[e.name]
        }) ).filter(e => (e.value && e.value > -1))
        this.decLoading()
    }

    // evento que se dispara al ahcer click
    svgClick() {
        this.svg.transition().duration(750).call(this.zoom.transform, d3.zoomIdentity);
    }

    // redimensiona el canvas
    resizeCanvas() {
        this.canvas
            .attr('height', this.height)
            .attr('width', this.width)

        this.path2D = new Path2D()
        this.path.projection(this.projection).context(this.path2D)
        this.path(this.geojson)
    }

    // redimensiona el svg
    resizeSVG() {
        this.svg
            .attr("width", this.width)
            .attr('height', this.height)
    }

    // redimensiona el compoenente
    resize() {
        this.height = this.node.offsetHeight
        this.width = this.node.offsetWidth
        this.projection.fitSize([this.width, this.height], this.geojson)
        this.resizeCanvas()
        this.resizeSVG()
    }

    // actualiza los datos del mapa
    async setData() {

        await this.loadData()

        this.rects = this.rects
            .data(this.data)
            .join('g')
            .call(card, this.props.contaminante)
    }

    // establece un zoom al mapa
    setZoom(t = {k: 1, x: 0, y: 0}) {
        this.transform = t
        this.repaint()
    }

    // inicia el componente (guarda la referencia del nodo del dom,
    // carga el geojson de las islasy los datos, y actualiza el compoenente...)
    async componentDidMount() {
        this.node = this.ref.current
        this.initDOM()
        await this.loadGeo()
        this.resize()
        await this.setData()
        this.repaint()
    }

    // carga los nuevos datos si la prop "componente" ha cambiado
    async componentDidUpdate(prevProps) {
        if(this.ref.current && this.ref.current !== this.node) {
            this.node = this.ref.current
            this.initDOM()
        }
        if(prevProps.contaminante !== this.props.contaminante) {
            await this.setData()
            this.repaintSVG()
        }
    }

    // "repinta" el svg (realmente utiliza la propiedad this.transform
    // para ajustar la posición de los cuadros)
    repaintSVG() {
        this.rects
            .attr('transform', d => `translate(
                ${d.point[0] * this.transform.k + this.transform.x},
                ${d.point[1] * this.transform.k + this.transform.y})`)
    }

    // repinta el canvas
    repaintCanvas() {
        this.context = this.canvas.node().getContext('2d')
        this.context.clearRect(0, 0, this.width, this.height)
        this.context.resetTransform()
        this.context.translate(this.transform.x, this.transform.y)
        this.context.scale(this.transform.k, this.transform.k)
        this.context.fillStyle = 'steelblue'
        this.context.fill(this.path2D)
    }

    // repinta el compoenente
    repaint(){
        this.repaintCanvas()
        this.repaintSVG()
    }

    render() {
        if(this.state.loading_resources > 0) {
            return <Loading/>
        } else  {
            return (
                <Grow in={true}>
                    <div ref={this.ref} className='map-chart'/>
                </Grow>
            )
        }
    }

}

export default MapChart;