import React from 'react'
import {CircularProgress, Grid} from '@material-ui/core'

/**
 * Pantalla de carga
 */
function Loading(props) {
  return(
    <Grid
    container
    direction="row"
    justify="center"
    alignItems="center"
    className="loading-screen"
    id={props.id}
    >
        <CircularProgress color="secondary" size={200} thickness={0.5}/>
    </Grid>
)
}

export default Loading;