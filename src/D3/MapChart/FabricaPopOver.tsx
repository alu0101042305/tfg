import React from 'react'
import MapChart from './MapChart';
import { Popover, Box } from '@material-ui/core';
import {Fabrica} from '../../assets/Fabrica'

export default function FabricaPopOver(props: {
  map: MapChart
}) {

  const [anchorEl, setanchorEl] = React.useState(null);
  const [factory, setFactory] = React.useState<Fabrica>({
    name: '',
    mainActivity: '',
    location: {latitude:0, longitude:0}
  })

  props.map.onMouseEnterFabric = (fabrica: Fabrica, event: any) => {
    setanchorEl(event.target)
    setFactory(fabrica)
  }

  props.map.onMouseLeaveFabric = () => {
    setanchorEl(null)
  }

  return (
    <Popover
      open={anchorEl != null}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      disableRestoreFocus
      style={{
        pointerEvents: 'none'
      }}
    >
      <Box px={1}>
        <h4>{factory.name}</h4>
        <h5>{factory.mainActivity}</h5>
      </Box>
    </Popover>
  )

}