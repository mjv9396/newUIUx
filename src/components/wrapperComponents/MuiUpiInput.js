import React from "react";
import { Field, ErrorMessage } from "formik";
import { Box, TextField } from "@mui/material";
import TextError from "./TextError";
import MuiLabel from "./MuiLabel";

function MuiUpiInput(props) {
  const { label, name, ...rest } = props;
  return (
    <Field name={name} {...rest}>
      {({ field }) => {
        return (
          <React.Fragment>
            <MuiLabel {...props} />
            <TextField
              id={name}
              {...rest}
              {...field}
              type="text"
              fullWidth
              size="small"
              autoComplete="off"
            />
            <Box className="error-box">
              <ErrorMessage name={name} component={TextError} />
            </Box>
          </React.Fragment>
        );
      }}
    </Field>
  );
}

export default MuiUpiInput;
