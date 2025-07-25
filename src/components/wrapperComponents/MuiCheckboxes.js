import { Checkbox, FormControlLabel } from '@mui/material';
import { Field } from 'formik';
import React from 'react'
import MuiLabel from './MuiLabel';

function MuiCheckboxes(props) {
        const {name, label, ...rest} = props
        return (
            <Field name={name} {...rest}>
                {({field})=>{
                    const {value} = field;
                    return (
                        <React.Fragment>
                         {/* <MuiLabel {...props}/> */}
                        <FormControlLabel 
                            control={<Checkbox {...rest} {...field} checked={value}/>}
                            label={label}
                        />
                        </React.Fragment>
                      );
                }}
            </Field>
           )
}

export default MuiCheckboxes