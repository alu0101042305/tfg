import React from 'react';
import {AppBar, Button, ButtonGroup, Grid, IconButton} from '@material-ui/core'
import GitHubIcon from '@material-ui/icons/GitHub';
import contaminantes from './assets/contaminantes'

/**
 * Barra con todos los contaminantes
 * @property {Function} onClick se llama cada vez que se pulsa un botó
 */
function Bar(props) {

  const [selected, setSelected] = React.useState(Math.floor(contaminantes.length / 2))

  function onClick(i){
    setSelected(i)
    if(props.onClick)
      props.onClick(contaminantes[i])
  }

  return (
    <AppBar position='static'>
      <Grid
      container
      direction="row"
      justify="space-between"
      alignItems="center"
      >
        <Grid item/>
          
        <Grid item>
        <ButtonGroup variant="text" color="secondary" aria-label="text primary button group">
          {
            contaminantes.map((e, i) => (
              <Button 
              key={i} 
              variant={ (selected === i) ? 'contained' : null }
              onClick={onClick.bind(this, i)}>
                {e.display_name}
              </Button>
            ))
          }
        </ButtonGroup>
        </Grid>
            
        <Grid item>
          <IconButton color='inherit' href='https://github.com/alu0101042305/tfg' target="_blank">
            <GitHubIcon/>
          </IconButton>
        </Grid>
    </Grid>
    </AppBar>
  )
}

export default Bar;