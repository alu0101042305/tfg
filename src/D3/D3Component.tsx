import React from 'react'
import Loading from './Loading'
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
  const [haveToResize, setHaveToresize] = React.useState(false)
  const [i, set_i] = React.useState(0)
  const [loading, setLoading] = React.useState([0])
  const ref = React.useRef(null)

  function endLoad(n: number) {
    setLoading((loading) => loading.filter(e => e != n))
  }

  function startLoad() {
    const j = i + 1
    set_i(j)
    setLoading((loading) => [...loading, j])
    return j
  }

  function loadData() {
    const n = startLoad()
    if(props.load_async) {
      props.load_async().then(() => {
        endLoad(n)
      })
    } else if(props.load){
      props.load()
      endLoad(n)
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
    setHaveToresize(true)
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
        setHaveToresize(false)
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
  React.useEffect(()=> {
    if(haveToResize)
      repaint()
  }, [haveToResize])
  
  if(isLoading()) {
    return <Loading/>
  } 
  else {
    return <div ref={ref} className='map-chart'/>
  }

}

export default D3Component;