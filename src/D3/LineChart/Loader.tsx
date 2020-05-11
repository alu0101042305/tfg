import React from 'react'

function Loader(props) {

  var node;
  const [height, setHeight] = React.useState(0)
  const [width, setWidth] = React.useState(0)

  React.useEffect(() => {
    setHeight(node.offsetHeight)
    setWidth(node.offsetWidth)
  })

  return(
    <div ref={n => node = n}>
      {
        React.Children.map(props.Children, node => {
          React.cloneElement(node, {...node.props, height, width})
        })
      }
    </div>
  )
}