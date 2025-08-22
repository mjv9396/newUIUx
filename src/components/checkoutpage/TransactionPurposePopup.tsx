import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";

interface TransactionPurposePopupProps {
  open: boolean;
  txnId: string;
  onSubmit: (txnPurpose: string) => Promise<void>;
  loading?: boolean;
}

const validationSchema = Yup.object({
  txnPurpose: Yup.string()
    .required("Transaction purpose is required")
    .min(3, "Transaction purpose must be at least 3 characters")
    .max(100, "Transaction purpose must not exceed 100 characters"),
});

const TransactionPurposePopup: React.FC<TransactionPurposePopupProps> = ({
  open,
  txnId,
  onSubmit,
  loading = false,
}) => {
  return (
    <Dialog
      open={open}
      disableEscapeKeyDown
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          style: {
            borderRadius: "12px",
            padding: "8px",
          },
        },
      }}
    >
      <DialogTitle>
        <Typography variant="h6" component="div" fontWeight="bold">
          Transaction Purpose Required
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Please provide the purpose for this transaction before proceeding
        </Typography>
      </DialogTitle>

      <Formik
        initialValues={{ txnPurpose: "" }}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          await onSubmit(values.txnPurpose);
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          isValid,
          dirty,
        }) => (
          <Form>
            <DialogContent>
              <Box sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  name="txnPurpose"
                  label="Transaction Purpose"
                  placeholder="Enter the purpose of this transaction"
                  value={values.txnPurpose}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.txnPurpose && Boolean(errors.txnPurpose)}
                  helperText={touched.txnPurpose && errors.txnPurpose}
                  variant="outlined"
                  multiline
                  rows={3}
                  disabled={loading}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                />
              </Box>
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 1 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={!dirty || !isValid || loading}
                sx={{
                  minWidth: 120,
                  borderRadius: "8px",
                  textTransform: "none",
                  fontWeight: "bold",
                  backgroundColor: "#15b86d",
                  "&:hover": {
                    backgroundColor: "#128a5a",
                  },
                  "&.Mui-disabled": {
                    backgroundColor: "#cccccc",
                  },
                }}
                startIcon={loading ? <CircularProgress size={20} /> : null}
              >
                {loading ? "Submitting..." : "Continue"}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default TransactionPurposePopup;
