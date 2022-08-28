import React from "react";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { Formik, Form, Field } from "formik";
import { object, string } from "yup";

const initialValues = {
  email: "",
  password: "",
};

const LoginForm = () => {
  return (
    <Box maxWidth="300px">
      <Typography textAlign="center" variant="h5" mb=".5em">
        Welcome back
      </Typography>
      <Formik
        initialValues={initialValues}
        onSubmit={(values, formikHelpers) => {
          console.log(values);
          formikHelpers.resetForm();
        }}
        validationSchema={object({
          email: string().required("E-mail required").email("Invalid e-mail"),
          password: string().required("Password required"),
        })}
      >
        {({ errors, isValid, dirty, touched }) => (
          <Form>
            <Stack spacing={2}>
              <Field
                name="email"
                type="email"
                as={TextField}
                variant="outlined"
                size="small"
                error={errors.email && touched.email}
                helperText={errors.email || ""}
              ></Field>
              <Field
                name="password"
                type="password"
                as={TextField}
                variant="outlined"
                size="small"
                error={errors.password && touched.password}
                helperText={errors.password || ""}
              ></Field>
              <Button variant="contained" type="submit" disabled={!dirty || !isValid}>
                Sign In
              </Button>
            </Stack>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default LoginForm;
