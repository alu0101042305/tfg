import React from 'react';
import {AppBar, Button, ButtonGroup, Grid, IconButton, Tab, Tabs, Tooltip} from '@material-ui/core'
import GitHubIcon from '@material-ui/icons/GitHub';
import MapIcon from '@material-ui/icons/Map';
import TimelineIcon from '@material-ui/icons/Timeline';

const github_url = 'https://github.com/alu0101042305/tfg'

/**
 * Barra con todos los contaminantes
 * @property {Function} onClick se llama cada vez que se pulsa un botó
 */
function Bar(props) {


  const [value, setValue] = React.useState(0)

  function handleChange(event, newValue) {
    props.onClick(newValue)
    setValue(newValue)
  }

  return (
    <AppBar position="static">
      <Grid container justify="space-between" >

        <Grid item/>

        <Grid item>
          <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="off"
            aria-label="scrollable prevent tabs example"
            >
            <Tooltip title="Mapa de Canarias" >
              <Tab icon={<MapIcon />} aria-label="phone" />
            </Tooltip>

            <Tooltip title="Diagrama de líneas">
              <Tab icon={<TimelineIcon />} aria-label="favorite" />
            </Tooltip>
          </Tabs>
        </Grid>

        <Grid item>
          <IconButton color='inherit' href={github_url} target="_blank">
            <GitHubIcon/>
          </IconButton>
        </Grid>

      </Grid>
    </AppBar>
  )

}

export default Bar;