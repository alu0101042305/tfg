
import React from 'react'
import {Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button} from '@material-ui/core'

/**
 * Mensaje de bienvenida que usa cookies para solo salir 1 vez
 */
function Wellcome() {
    
    if(process.env.NODE_ENV == 'development')
        document.cookie = 'new=; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';

    var firstTime = true
    if(document.cookie) {
        firstTime = false
    } else {
        document.cookie='new=false; Expires=Thu, 01 Jan 2030 00:00:01 GMT;'
    }
    
    const [open, setOpen] = React.useState(firstTime)

    function handleClose() {
        setOpen(false)
    }

    return (
        <Dialog
        open={open}
        onClose={handleClose}
        >
            <DialogTitle>Vizualización de la Calidad del aire en Canarias</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Aquí iría un mensaje introductorio a la web,
                    que todavía no he pensado. (ᵔ͜ʖᵔ)
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Ok
                </Button>
            </DialogActions>
        </Dialog>
    )

}

export default Wellcome;