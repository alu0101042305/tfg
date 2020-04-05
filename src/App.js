import React from 'react';
import './App.css';
import MapChart from './MapChart/MapChart';
import {CssBaseline, createMuiTheme, MuiThemeProvider } from '@material-ui/core';
import Bar from './Bar';
import contaminantes from './assets/contaminantes'
import Wellcome from './Wellcome';

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
          <Bar onClick={this.onBarClick.bind(this)}/>
          <MapChart contaminante={this.state.contaminante}/>
        </MuiThemeProvider>
      </div>
    )
  }

}

export default App;
