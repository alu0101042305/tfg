import React from 'react'
import {CircularProgress, Grid} from '@material-ui/core'

class Loading extends React.Component {


    render(){
        return(
            <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            className="loading-screen"
            >
                <CircularProgress color="secondary" size={400} thickness={0.5}/>
            </Grid>
        )
    }

}

export default Loading;