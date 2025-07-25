import React from 'react'
import { ErrorMessage, Field, useFormikContext } from 'formik'
import { Autocomplete, Box, TextField } from '@mui/material'
import MuiLabel from './MuiLabel'
import TextError from './TextError'

function MuiAutocomplete(props) {
    const { label, name, placeholder, ...rest } = props
    const { setFieldValue } = useFormikContext();
    const handleChange = (event, changedValue, action) => {
        if (changedValue)
            setFieldValue(name, changedValue?.value);
        if (props.onChange){
            if(props.formikValue)
                props.onChange(changedValue, props.formikValue);
            else
               props.onChange(changedValue); 
        }
        if (action === 'clear')
            setFieldValue(name, changedValue?.value);
    }
    if (props.options) {
        props.options.forEach(obj => {
            if (Array.isArray(props.keyfield)) {
                let keydata = '';
                props.keyfield.forEach(key => {
                    keydata = keydata + " " + obj[key];
                })
                obj.label = keydata
            } else {
                obj.label = obj[props.keyfield];
            }
            obj.value = obj[props.valuefield];
        });
    }

    return (
        <Field name={name}>
            {({ field, form }) => {
                return (
                    <React.Fragment>
                        <MuiLabel {...props} />
                        <Autocomplete
                            {...rest}
                            {...field}
                            name={name}
                            size='small'
                            fullWidth
                            value={field.value ? props.options.find((option) => option.value === (field.value)) : null}
                            onChange={handleChange}
                            options={props.options}
                            getOptionLabel={(option) => option.label}
                            renderInput={(params) => (
                                <TextField autoComplete='off' name={name} placeholder={placeholder} {...params} />
                            )}
                        />
                        <Box className='error-box'>
                            <ErrorMessage name={name} component={TextError} />
                        </Box>
                    </React.Fragment>
                )
            }}
        </Field>
    )
}

export default MuiAutocomplete