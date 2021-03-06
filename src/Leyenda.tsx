import React from 'react'
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core'
import { Colors, Contaminantes } from './assets/Contaminante'

const ICA = ['Muy bueno', 'Bueno', 'Regular', 'Malo', 'Muy malo']

// Botón que abre la leyenda del mapa al ser pulsado
export default function Leyenda() {

  // Define el estado isOpen: true si el dialog está abierto
  // false por defecto
  const [isOpen, setOpen] = React.useState(false)

  // función que cambia el estado isOpen a true
  const open = () => setOpen(true)
  // función que cambia el estado isOpen a false
  const close = () => setOpen(false)

  return (
    <React.Fragment>
      {/** Al pulsar el botón se llama a la función open */}
      <Button variant='outlined' color='primary' onClick={open}>
        Leyenda
      </Button>

      {/** El dialog solo se muestra si isOpen es true */}
      <Dialog open={isOpen} onClose={close}>
        <DialogTitle>Leyenda de colores</DialogTitle>

          <DialogContent>
            <DialogContentText>
              La siguiente tabla indica el Índice Nacional de Calidad del Aire de España
              según la concentración en {'\u00B5/m\u2083'} de cada contaminante. En el mapa se muestran con los colores indicados.
            </DialogContentText>
            <table
              cellSpacing={10}>
                <thead>
                  <tr>
                    <th> </th>
                    {
                      ICA.map((e, i) => <th
                        key={i}
                        style={{
                          backgroundColor: Colors[i],
                        }} >
                        {e}
                      </th>)
                    }
                  </tr>
                </thead>
                <tbody>
                {
                  Contaminantes.map((e, i) => (
                    <tr key={i}>
                      <td>{e.display_name}</td>
                      <td> &gt; 0</td>
                      {
                        e.range.slice(0, -1).map((e, i) => (
                          <td key={i}>&gt; {e + 1}</td>
                        ))
                      }
                    </tr>
                  ))
                }
                </tbody>
              </table>
          </DialogContent>

          <DialogActions>
            <Button onClick={close} color="primary">
                Ok
            </Button>
          </DialogActions>
      </Dialog>

    </React.Fragment>
  )
}