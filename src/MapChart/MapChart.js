import React from 'react'
import * as d3 from "d3"
import Loading from './../Loading'

const locations = require('./locations.json').points

class MapChart extends React.Component {

    constructor(props) {
        super(props);
        this.ref = React.createRef()
        this.state = {
            geojson_loading: false,
            data_loading: false
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

    initDOM() {
        // Es importante añadir el SVG después del canvas,
        // porque los eventos de ratón se van a escuchar en el segundo
        this.node.appendChild(this.canvas.node())
        this.node.appendChild(this.svg.node())
    }

    async loadGeo() {
        this.setState((state) => ({
            ...state,
            geojson_loading: true
        }))
        this.geojson = await d3.json("/json/canary.json")
        this.setState((state) => ({
            ...state,
            geojson_loading: false
        }))
    }

    async loadData() {
        this.setState((state) => ({
            ...state,
            data_loading: true
        }))
        const values = await (await fetch('/' + this.props.contaminante.id) ).json()
        this.data = locations.map(e => ({
            point: this.projection([e.longitude, e.latitude]),
            value: values[e.name]
        }) ).filter(e => (e.value && e.value > -1))
        this.setState((state) => ({
            ...state,
            data_loading: false
        }))
    }

    svgClick() {
        this.svg.transition().duration(750).call(this.zoom.transform, d3.zoomIdentity);
    }

    resizeCanvas() {
        this.canvas
            .attr('height', this.height)
            .attr('width', this.width)

        this.path2D = new Path2D()
        this.path.projection(this.projection).context(this.path2D)
        this.path(this.geojson)
    }

    resizeSVG() {
        this.svg
            .attr("width", this.width)
            .attr('height', this.height)
    }

    resize() {
        this.height = this.node.offsetHeight
        this.width = this.node.offsetWidth
        this.projection.fitSize([this.width, this.height], this.geojson)
        this.resizeCanvas()
        this.resizeSVG()
    }

    async setData() {

        await this.loadData()

        this.rects = this.rects
            .data(this.data)
            .join('g')
            .attr("stroke", "white")
            .style("stroke-width", "1px")

        const rectBounds = {w: 30, h: 20}
        
        var rect = this.rects.select('rect')
        if(rect.empty()){
            rect = this.rects.append('rect')
        }
        rect
            .attr('x', -rectBounds.w / 2)
            .attr('y', -rectBounds.h / 2)
            .attr('height', rectBounds.h)
            .attr('width', rectBounds.w)
            .attr('fill', this.getColor.bind(this))
        
        var text = this.rects.select('text')
        if(text.empty()){
            text = this.rects.append('text')
        }
        text
            .attr('x',  -rectBounds.w / 2)
            .attr('y', rectBounds.h / 4)
            .text(d => d.value.toString())
    }

    setZoom(t = {k: 1, x: 0, y: 0}) {
        this.transform = t
        this.repaint()
    }

    async componentDidMount() {
        this.node = this.ref.current
        this.initDOM()
        await this.loadGeo()
        this.resize()
        await this.setData()
        this.repaint()
    }

    async componentDidUpdate(prevProps) {
        if(this.ref.current && this.ref.current != this.node) {
            this.node = this.ref.current
            this.initDOM()
        }
        if(prevProps.contaminante != this.props.contaminante) {
            await this.setData()
            this.repaintSVG()
        }
    }

    getColor(data) {
        const val = data.value
        switch (true) {
            case (val <= this.props.contaminante.range[0]):
                return 'deepskyblue'
            case (val <= this.props.contaminante.range[1]):
                return 'mediumseagreen'
            case (val <= this.props.contaminante.range[2]):
                return 'coral'
            case (val <= this.props.contaminante.range[3]):
                return 'crimson'
            default:
                return 'purple'
        }
    }

    repaintSVG() {
        this.rects
            .attr('transform', d => `translate(
                ${d.point[0] * this.transform.k + this.transform.x},
                ${d.point[1] * this.transform.k + this.transform.y})`)
    }

    repaintCanvas() {
        this.context = this.canvas.node().getContext('2d')
        this.context.clearRect(0, 0, this.width, this.height)
        this.context.resetTransform()
        this.context.translate(this.transform.x, this.transform.y)
        this.context.scale(this.transform.k, this.transform.k)
        this.context.fillStyle = 'steelblue'
        this.context.fill(this.path2D)
    }

    repaint(){
        this.repaintCanvas()
        this.repaintSVG()
    }

    render() {
        if(this.state.data_loading || this.state.geojson_loading) {
            return <Loading/>
        } else  {
            return <div ref={this.ref} className='map-chart'/>
        }
    }

}

export default MapChart;