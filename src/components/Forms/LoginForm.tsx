import React from "react";
import { Box, Stack, TextField, Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { Formik, Form, Field } from "formik";
import { object, string } from "yup";

const initialValues = {
  email: "",
  password: "",
};

interface LoginFormProps {
  onLogIn: (email: string, password: string) => void;
  isPending: boolean;
}

const LoginForm = ({ onLogIn, isPending }: LoginFormProps) => {
  return (
    <Box maxWidth="300px">
      <Typography textAlign="center" variant="h5" mb=".5em">
        Welcome back
      </Typography>
      <Formik
        initialValues={initialValues}
        onSubmit={async (values, formikHelpers) => {
          formikHelpers.resetForm();
          onLogIn(values.email, values.password);
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
                id="email"
                label="E-mail"
                as={TextField}
                variant="outlined"
                size="small"
                error={errors.email && touched.email}
                helperText={errors.email || ""}
              ></Field>
              <Field
                name="password"
                type="password"
                id="password"
                label="Password"
                as={TextField}
                variant="outlined"
                size="small"
                error={errors.password && touched.password}
                helperText={errors.password || ""}
              ></Field>
              <LoadingButton variant="contained" type="submit" disabled={!dirty || !isValid} loading={isPending}>
                Sign In
              </LoadingButton>
            </Stack>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default LoginForm;
