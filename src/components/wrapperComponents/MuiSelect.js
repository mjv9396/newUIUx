import { Box, MenuItem, Select } from '@mui/material';
import { ErrorMessage, Field } from 'formik';
import React from 'react'
import MuiLabel from './MuiLabel';
import TextError from './TextError';

export const MuiSelect = (props) => {
    const { label, name, options, ...rest } = props;
    return (
        <Field name={name} {...rest}>
            {
                ({ field }) => {
                    return (
                        <React.Fragment>
                            <MuiLabel {...props} />
                            <Select
                                id={name}
                                {...rest}
                                {...field}
                                size="small"
                                fullWidth
                                variant='outlined'
                            >
                                {options.map((option) => (
                                    <MenuItem key={option.key} value={option.value}>{option.key}</MenuItem>
                                ))}
                            </Select>
                            <Box className='error-box'>
                                <ErrorMessage name={name} component={TextError} />
                            </Box>
                        </React.Fragment>
                    )
                }
            }
        </Field>
    )
}
