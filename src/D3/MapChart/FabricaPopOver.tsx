import React from 'react'
import MapChart from './MapChart.old';
import { Popover, Box } from '@material-ui/core';
import {Fabrica} from '../../assets/Fabrica'

export default function FabricaPopOver(props: {
  fabrica: Fabrica,
  anchor: Element
}) {

  return (
    <Popover
      open={props.anchor != null}
      anchorEl={props.anchor}
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
        <h4>{props.fabrica.name}</h4>
        <h5>{props.fabrica.mainActivity}</h5>
      </Box>
    </Popover>
  )

}