import React from 'react'
import {Contaminantes, Contaminante} from './assets/Contaminante'
import { Grid, Select, InputLabel, MenuItem, List, ListItem, ListItemText, ListItemSecondaryAction, Checkbox } from '@material-ui/core'
import {MapChartLoader} from './D3/MapChart/MapChartLoader';
import {Visibility, VisibilityOff, GroupWork} from '@material-ui/icons';
import GroupWorkOutlinedIcon from '@material-ui/icons/GroupWorkOutlined';

export default function MapChartController() {

  const [index, set_index] = React.useState(0)
  const [layers, setLayers] = React.useState([{
    name: 'Fábricas',
    collide: false,
    hidden: false
  }, {
    name: 'Nodos',
    collide: true,
    hidden: false
  }])

  function onSelectChange(event) {
    set_index(event.target.value)
  }

  return(
    <Grid container className="maxH">
      <Grid item xs={2}>
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

        <List dense>
          {
            layers.map((layer, i) => (
              <ListItem key={i}>
                <ListItemText primary={layer.name} />
                <ListItemSecondaryAction>
                  <Checkbox
                    checked={!layer.hidden}
                    onChange={() => {
                      setLayers(prevLayers => {
                        const newLayers = [...prevLayers]
                        newLayers[i].hidden = !newLayers[i].hidden
                        return newLayers
                      })
                    }}
                    icon={<VisibilityOff />}  
                    checkedIcon={<Visibility color='primary' />} />
                  <Checkbox
                    checked={layer.collide}
                    onChange={() => {
                      setLayers(prevLayers => {
                        const newLayers = [...prevLayers]
                        newLayers[i].collide = !newLayers[i].collide
                        return newLayers
                      })
                    }}
                    icon={<GroupWorkOutlinedIcon />}  
                    checkedIcon={<GroupWork color='primary' />} />
                </ListItemSecondaryAction>
              </ListItem>
            ))
          }
        </List>
      </Grid>

      <Grid item className='maxH grow'>
        <MapChartLoader contaminante={Contaminantes[index]} layersProps={layers} />
      </Grid>
    </Grid>
  )
}