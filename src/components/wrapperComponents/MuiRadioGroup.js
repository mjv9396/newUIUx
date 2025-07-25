import { Box, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { ErrorMessage, Field } from 'formik';
import React from 'react'
import MuiLabel from './MuiLabel';
import TextError from './TextError';

function MuiRadioGroup(props) {
  const { label, name, options, ...rest } = props;
  const { required, ...restElements } = props;
  return (
    <Field name={name} {...rest}>
      {({ field }) => {
        return (
          <React.Fragment>
            <MuiLabel {...props} />
            <RadioGroup {...field} {...rest} name={name} >
              {options.map(option => (
                <FormControlLabel key={option.value} value={option.value} control={<Radio  {...restElements} />} label={option.key} />
              ))}
            </RadioGroup>
            <Box className='error-box'>
              <ErrorMessage name={name} component={TextError} />
            </Box>
          </React.Fragment>
        );
      }}

    </Field>
  )
}

export default MuiRadioGroup