import React from 'react'
import {Grid, Select, MenuItem, InputLabel, TextField, InputAdornment, Button, Chip, Box, Paper, Typography} from '@material-ui/core'
import LineChart from './D3/LineChart/Component'
import LineChartD3 from './D3/LineChart/LineChart'
import {KeyboardDatePicker, MuiPickersUtilsProvider} from '@material-ui/pickers'
import {Contaminante, Contaminantes} from './assets/Contaminante'
import SelectZonesDialog from './SelectZonesDialog'

function LineChartController() {

  const MIN_DATE = new Date(2004, 0, 1)
  const MAX_DATE = new Date(2018, 12, 31)

  const [startDate, setStartDate] = React.useState(new Date(2004, 1, 1))
  const [endDate, setEndDate] = React.useState(new Date(2004, 2, 1))
  const [index, set_index] = React.useState(0)
  const [hour, setHour] = React.useState(8)
  const [zones, setZones] = React.useState<string[]>([])
  const [open, setOpen] = React.useState(false)

  function onStartChange(date: Date) {
    if(date && !isNaN(date.getTime())) {
      setStartDate(date)
    }
  }

  function onEndChange(date: Date) {
    if(date && !isNaN(date.getTime())) {
      setEndDate(date)
    }
  }

  function onSelectChange(event) {
    set_index(event.target.value)
  }

  return (
    <Grid container className='maxH'>
      <Grid item xs={2} className='maxH' >

          <Grid container direction='column' spacing={1}>
            <Grid item>
              <KeyboardDatePicker
                label="Fecha inicial"
                format="dd/MM/yyyy"
                value={startDate}
                onChange={onStartChange}
                minDate={MIN_DATE}
                maxDate={endDate}
                minDateMessage={"Los datos comienzan en el año 2004"}
                maxDateMessage={"La fecha inicial debe ser menor que la final"}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
            </Grid>

            <Grid item>
              <KeyboardDatePicker
                label="Fecha final"
                format="dd/MM/yyyy"
                value={endDate}
                onChange={onEndChange}
                minDate={startDate}
                maxDate={MAX_DATE}
                minDateMessage={"La fecha final debe ser mayor que la inicial"}
                maxDateMessage={"Los datos terminan en el año 2018"}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
            </Grid>

            <Grid item>
              <InputLabel id="select-label">Contaminante</InputLabel>
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

            <Grid item>
              <TextField
              label="Group by"
              type='number'
              InputProps={{
                endAdornment: <InputAdornment position="end">h</InputAdornment>,
              }}
              value={hour}
              onChange={(e) => {
                const num = Number(e.target.value)
                if(num > 0) {
                  setHour(num)
                }
              }}
          />
            </Grid>
            
            <Grid item>
              <Button color='primary' variant='outlined' onClick={setOpen.bind(null, true)}>
                Selecciona las zonas
              </Button>
            </Grid>

            <Grid item>
              {
                zones.length == 0 ? (
                  <Typography color='textSecondary' variant='caption'>
                    Si no seleccionas ninguna zona se mostrarán los datos de todas,
                    aplicando media aritmética cuando coincidan las fechas.
                  </Typography>
                ): ''
              }
            </Grid>

            <Grid item>
              {
                zones.map((zone, i) => (
                  <Box m={0.25} key={i}>
                    <Chip
                    label={zone}
                    onDelete={setZones.bind(null, zones.filter(z => z != zone) )}
                    style={{
                      background: LineChartD3.COLORS[i]
                    }}
                    />
                  </Box>
                ) )
              }
            </Grid>
          </Grid>
      </Grid>

      <SelectZonesDialog setZones={setZones} open={open} handleClose={setOpen.bind(null, false)} 
              contaminante={Contaminantes[index]}/>
      
      <Grid item className='maxH grow'>
        <LineChart start_date={startDate} end_date={endDate} contaminante={Contaminantes[index]} 
        group_by={hour} zones={zones} />
      </Grid>
    </Grid>
  )
}

export default LineChartController;