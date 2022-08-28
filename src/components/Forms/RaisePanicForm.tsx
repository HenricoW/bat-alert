import React from "react";
import { Box, Stack, TextField, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Formik, Form, Field } from "formik";
import { number, object, string } from "yup";
import type { FormikErrors, FormikTouched } from "formik";

const initialValues = {
  panicType: "",
  description: "",
  latitude: 0,
  longitude: 0,
};

const formField = (fieldName: string, label: string, errors: FormikErrors<any>, touched: FormikTouched<any>) => (
  <Field
    name={fieldName}
    label={label}
    as={TextField}
    multiline={fieldName === "description"}
    variant="outlined"
    size="small"
    error={!!errors[fieldName] && !!touched[fieldName]}
    helperText={errors[fieldName] || ""}
  ></Field>
);

const RaisePanicForm = () => {
  return (
    <Box minWidth="350px" maxWidth="400px" border="1px solid #888" p="1em" borderRadius="10px">
      <Typography textAlign="center" variant="h5" mb=".5em">
        Raise a New Panic
      </Typography>
      <Formik
        initialValues={initialValues}
        onSubmit={async (values, formikHelpers) => {
          formikHelpers.resetForm();
        }}
        validationSchema={object({
          panicType: string().required("Panic type required"),
          description: string(),
          latitude: number()
            .required("Latitude required")
            .min(-90, "Outside valid range")
            .max(90, "Outside valid range")
            .default(-26.099712),
          longitude: number()
            .required("Longitude required")
            .min(-90, "Outside valid range")
            .max(90, "Outside valid range")
            .default(28.0559616),
        })}
      >
        {({ errors, isValid, dirty, touched }) => (
          <Form>
            <Stack spacing={2}>
              {formField("panicType", "Panic type", errors, touched)}
              {formField("description", "Description", errors, touched)}
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
