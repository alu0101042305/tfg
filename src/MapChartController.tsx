import React from 'react'
import {Contaminantes, Contaminante} from './assets/Contaminante'
import MapChart from './D3/MapChart/Component'
import { Grid, Select, InputLabel, MenuItem } from '@material-ui/core'

export default function MapChartController() {

  const [index, set_index] = React.useState(0)

  function onSelectChange(event) {
    set_index(event.target.value)
  }

  return(
    <Grid container className="maxH">
      <Grid item>
        <InputLabel id="select-label">Contaminente</InputLabel>
        <Select
          labelId='select-label'
          value={index}
          onChange={onSelectChange}>
          {
            Contaminantes.map((e: Contaminante, i) => (
              <MenuItem value={i} key={i}>{e.display_name}</MenuItem>
            ))
          }
        </Select>
      </Grid>

      <Grid item className='maxH grow'>
        <MapChart contaminante={Contaminantes[index]}/>
      </Grid>
    </Grid>
  )
}