import React from "react";
import { Box, Stack, TextField, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Formik, Form, Field } from "formik";
import { number, object, string } from "yup";

const initialValues = {
  panicType: "",
  description: "",
  latitude: 0,
  longitude: 0,
};

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
              <Field
                name="panicType"
                label="Panic type"
                as={TextField}
                variant="outlined"
                size="small"
                error={!!errors.panicType && !!touched.panicType}
                helperText={errors.panicType || ""}
              ></Field>
              <Field
                name="description"
                label="Description"
                as={TextField}
                multiline={true}
                maxRows={2}
                variant="outlined"
                size="small"
                error={!!errors.description && !!touched.description}
                helperText={errors.description || ""}
              ></Field>
              <Field
                name="latitude"
                type="text"
                label="Latitude"
                as={TextField}
                variant="outlined"
                size="small"
                error={!!errors.latitude && !!touched.latitude}
                helperText={errors.latitude || ""}
              ></Field>
              <Field
                name="longitude"
                type="text"
                label="Longitude"
                as={TextField}
                variant="outlined"
                size="small"
                error={!!errors.longitude && !!touched.longitude}
                helperText={errors.longitude || ""}
              ></Field>
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
