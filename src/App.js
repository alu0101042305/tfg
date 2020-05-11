import React from 'react';
import './App.css';
import {CssBaseline, createMuiTheme, MuiThemeProvider, Grid} from '@material-ui/core';
import Bar from './Bar';
import Wellcome from './Wellcome';
import LineChartController from './LineChartController'
import MapChartController from './MapChartController'
import {Contaminantes} from './assets/Contaminante'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#4682B4'
    },
    secondary: {
      main: '#fff'
    }
  }
})

class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {index: 0}
  }

  onBarClick(index) {
    this.setState({
      index
    }) 
  }

  render() {
    return (
      <MuiThemeProvider theme = { theme }>
        <CssBaseline/>
        <Wellcome/>
        <Grid container direction="column" className='maxH'>
          <Grid item>
            <Bar onClick={this.onBarClick.bind(this)}/>
          </Grid>
          <Grid item className='center' style={{overflow: 'auto'}}>
            <div className='maxH' hidden={this.state.index !== 0}>
              <MapChartController/>
            </div>
            <div className='maxH' hidden={this.state.index !== 1}>
              <LineChartController/>
            </div>
          </Grid>
        </Grid>
      </MuiThemeProvider>
    )
    // <LineChart contaminante={this.state.contaminante} start_date={date1} end_date={date2}></LineChart>
  }

}

export default App;
