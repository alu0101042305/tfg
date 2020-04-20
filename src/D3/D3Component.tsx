import React from 'react'
import Loading from '../Loading'
import {Grow} from '@material-ui/core'
import D3Element from './D3Element';

interface Props {
  d3: D3Element,
  load?(): void,
  load_async?(): Promise<any>
}

function D3Component(props: Props) {

  var node;
  const d3 = props.d3;
  var isPainting = false
  var haveToPaint = false
  var haveToResize = false
  const [loading, setLoading] = React.useState([0])
  const [i, set_i] = React.useState(0)
  const ref = React.useRef(null)

  function loadData() {
    var j = i + 1
    set_i(i => i + 1 )
    setLoading((loading) => [...loading, j])
    if(props.load_async) {
      props.load_async().then(() => {
        setLoading((loading) => loading.filter( e => e != j))
      })
    } else if(props.load){
      props.load()
      setLoading((loading) => loading.filter( e => e != j))
    }
  }

  function setParent() {
    if(!ref.current || node == ref.current) {
      return;
    } 
    node = ref.current
    node.innerHTML = ''
    d3.setParent(node)
    resize()
  }

  function resize() {
    haveToResize = true
    repaint()
  }

  function repaint() {
    haveToPaint = true
    if(isPainting || isLoading())
      return;
    isPainting = true
    setParent()
    do {
      haveToPaint = false
      if(haveToResize) {
        haveToResize = false
        d3.resize(node.offsetWidth, node.offsetHeight)
      }
      d3.repaint()
    } while(haveToPaint)
    isPainting = false
  }

  function firstRender() {
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
    }
  }

  function isLoading() {
    return loading.includes(i)
  }

  React.useEffect(firstRender, [])
  React.useEffect(loadData, [props.load, props.load_async])
  React.useEffect(repaint, [loading])

  if(isLoading()) {
    return <Loading/>
  } 
  else {
    return (
      <Grow in={true}>
        <div ref={ref} className='map-chart'/>
      </Grow>
    )
  }

}

export default D3Component;