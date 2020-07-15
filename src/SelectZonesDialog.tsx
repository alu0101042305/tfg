import React from 'react'
import {Dialog, DialogContent, DialogActions, Button, FormControlLabel, Checkbox} from '@material-ui/core'
import { Contaminante } from './assets/Contaminante'

export default function SelecZonesDialog(props: {
  open: boolean,
  handleClose(): void,
  setZones(zones: string[]): void,
  contaminante: Contaminante,
  startDate: Date,
  endDate: Date
}) {

  const [zones, setZones] = React.useState<{checked: boolean, name: string}[]>([])

  const query = () => `
    show tag values from "${props.contaminante.db_name}"
    with key in ("zone")
    where time > '${props.startDate.toISOString()}' and time < '${props.endDate.toISOString()}'`

  function getZones() {
    fetch('/consult', {
      method: 'POST',
      body: query()
    }).then(res => res.json().then(json => {
      setZones(json.data.map(e => ({
        checked: false,
        name: e.value
      }) ))
    }) )
  } 

  function ok() {
    props.handleClose()
    props.setZones(zones.filter(e => e.checked).map(e => e.name))
  }

  React.useEffect(getZones, [props.contaminante, props.startDate, props.endDate])

  return (
    <Dialog open={props.open} onClose={props.handleClose}>
      <DialogContent>
        {
          zones.map((zone, i) => (
            <FormControlLabel key={i}
              control={
                <Checkbox
                  checked={zone.checked}
                  onChange={e => {
                    zone.checked = e.target.checked
                    setZones([...zones])
                  }}
                  color="primary"
                />
              }
              label={zone.name}
            />
          ) )
        }
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={ok} color="primary">
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  )
}