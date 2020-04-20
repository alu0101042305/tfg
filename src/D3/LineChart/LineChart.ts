
import * as d3 from 'd3'
import D3Element from '../D3Element'
import {Data, Point} from './Types'

class LineChart implements D3Element {

  readonly MARGIN = 0.05
  
  width: number
  height: number
  data: Data
  svg = d3.create('svg')
  xScale = d3.scaleUtc()
  yScale = d3.scaleLinear()
  xAxis = this.svg.append('g')
  yAxis = this.svg.append('g')
  line = this.svg.append('path')
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
  lineGenerator = d3.line<Point>()
    .x((d) => this.xScale(d.date))
    .y((d) => this.yScale(d.value))

  repaint() {
    this.line
      .datum(this.data.points)
      .attr('d', this.lineGenerator)

    this.xAxis
        .call(d3.axisBottom(this.xScale).scale(this.xScale))

    this.yAxis
        .call(d3.axisLeft(this.yScale).scale(this.yScale))
  }

  resize(width: number, height: number) {
    const leftMargin = width * this.MARGIN
    const topMargin = height * this.MARGIN
    this.width = width - leftMargin * 2
    this.height = height - topMargin * 2
    this.svg
      .attr("viewBox", `${-leftMargin} ${-topMargin} ${width} ${height}`)
      
    this.xAxis
      .attr("transform", `translate(0, ${this.height})`)
    this.xScale.range([0, this.width])
    this.yScale.range([this.height, 0])
  }

  setParent(node: HTMLElement) {
    node.append(this.svg.node())
  }

  setData(data: Data) {
    this.data = data;
    this.xScale.domain(d3.extent(data.points, e => e.date))
    this.yScale.domain([0, d3.max(data.points.map(e => e.value))])
  }

}

export default LineChart;