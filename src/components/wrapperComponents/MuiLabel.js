import { InputLabel } from '@mui/material';

function MuiLabel(props) {
    const {label, requiredField} = props
    const requiredColour = () =>{
      return (
        <span style={{color: 'Red', fontWeight: 'bold', fontSize: 15}}> *</span>
      )
    }
  return (
    <InputLabel 
                variant="standard"
                sx={{textAlign: "left", fontWeight: "500" , color: "#000000"}}>
                {label} 
                {requiredField ? requiredColour() : ''}
    </InputLabel>
  )
}

export default MuiLabel