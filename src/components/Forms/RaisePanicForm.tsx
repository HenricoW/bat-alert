import React from "react";
import { Box, Stack, TextField, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Formik, Form, Field } from "formik";
import { number, object, string } from "yup";
import type { FormikErrors, FormikTouched } from "formik";

export const initialPanicValues = {
  panicType: "",
  details: "",
  latitude: -26.099712,
  longitude: 28.0559616,
};

interface RaisePanicFormProps {
  onNewPanic: (values: typeof initialPanicValues) => void;
}

const formField = (fieldName: string, label: string, errors: FormikErrors<any>, touched: FormikTouched<any>) => (
  <Field
    name={fieldName}
    label={label}
    as={TextField}
    multiline={fieldName === "details"}
    variant="outlined"
    size="small"
    error={!!errors[fieldName] && !!touched[fieldName]}
    helperText={errors[fieldName] || ""}
  ></Field>
);

const RaisePanicForm = ({ onNewPanic }: RaisePanicFormProps) => {
  return (
    <Box minWidth="350px" maxWidth="400px" border="1px solid #888" p="1em" borderRadius="10px">
      <Typography textAlign="center" variant="h5" mb=".5em">
        Raise a New Panic
      </Typography>
      <Formik
        initialValues={initialPanicValues}
        onSubmit={async (values, formikHelpers) => {
          formikHelpers.resetForm();
          onNewPanic(values);
        }}
        validationSchema={object({
          panicType: string(), //.required("Panic type required"),
          details: string(),
          latitude: number()
            .required("Latitude required")
            .typeError("Must be a number")
            .min(-90, "Outside valid range")
            .max(90, "Outside valid range"),
          longitude: number()
            .required("Longitude required")
            .typeError("Must be a number")
            .min(-90, "Outside valid range")
            .max(90, "Outside valid range"),
        })}
      >
        {({ errors, isValid, dirty, touched }) => (
          <Form>
            <Stack spacing={2}>
              {formField("panicType", "Panic type", errors, touched)}
              {formField("details", "Details", errors, touched)}
              {formField("latitude", "Latitude", errors, touched)}
              {formField("longitude", "Longitude", errors, touched)}
              <LoadingButton variant="contained" type="submit" disabled={!dirty || !isValid} color="error">
                Raise Panic
              </LoadingButton>
            </Stack>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default RaisePanicForm;
