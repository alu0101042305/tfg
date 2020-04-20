import React from 'react';
import './App.css';
import {CssBaseline, createMuiTheme, MuiThemeProvider, Grid, Drawer} from '@material-ui/core';
import Bar from './Bar';
import contaminantes from './assets/contaminantes'
import Wellcome from './Wellcome';
import LineChart from './D3/LineChart/Component';
import MapChart from './D3/MapChart/MapChartComp';

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
    this.state = {contaminante: contaminantes.default}
  }

  onBarClick(contaminante) {
    this.setState({contaminante: contaminante}) 
  }

  render() {
    return (
      <div className="root">
        <MuiThemeProvider theme = { theme }>
          <CssBaseline/>
          <Wellcome/>
          <Grid container direction="column" className='root'>
            <Grid item>
              <Bar onClick={this.onBarClick.bind(this)}/>
            </Grid>
            <Grid item className='center'>
              <MapChart contaminante={this.state.contaminante}></MapChart>
            </Grid>
          </Grid>
        </MuiThemeProvider>
      </div>
    )
  }

}

export default App;
