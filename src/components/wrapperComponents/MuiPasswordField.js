import { Box, IconButton, InputAdornment, OutlinedInput } from '@mui/material';
import { VisibilityOff } from '@mui/icons-material';
import Visibility from '@mui/icons-material/Visibility';
import { ErrorMessage, Field } from 'formik';
import React from 'react'
import MuiLabel from './MuiLabel.js';
import TextError from './TextError.js';

export const MuiPasswordField = (props) => {
    const { name, label, ...rest } = props
    const [showPassword, setShowPassword] = React.useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event => {
        event.preventDefault();
    });

    return (
        <Field name={name} {...rest}>
            {({ field }) => {
                return (
                    <React.Fragment>
                        <MuiLabel {...props} />
                        <OutlinedInput
                            {...field}
                            {...rest}
                            id="outlined-adornment-password"
                            autoComplete="new-password"
                            placeholder={props.placeholder ? props.placeholder : ''}
                            variant="outlined"
                            size="small"
                            fullWidth
                            type={showPassword ? 'text' : 'password'}
                            endAdornment={
                                <InputAdornment position="end" >
                                    <IconButton
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                        {...rest}
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                        <Box className='error-box'>
                            <ErrorMessage name={name} component={TextError} />
                        </Box>
                    </React.Fragment>
                );
            }}

        </Field>

    )

}
