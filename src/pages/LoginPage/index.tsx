import React, { useState } from "react";
import { Alert, Box } from "@mui/material";

import LoginForm from "../../components/Forms/LoginForm";
import { loginRequest } from "../../core/api.service";
import { ApiResponse } from "../../types/api.types";

const LoginPage = () => {
  const [loginMessage, setLoginMessage] = useState("");
  const [loginStatus, setLoginStatus] = useState<ApiResponse["status"]>("success");
  const [isPending, setIsPending] = useState(false);

  const onLogIn = (email: string, password: string) => {
    setIsPending(true);
    setLoginMessage("");

    loginRequest(email, password)
      .then(({ status, message }) => {
        setLoginStatus(status);
        setLoginMessage(message);
      })
      .catch((error) => {
        setLoginStatus("error");
        setLoginMessage(error.message);
      })
      .finally(() => setIsPending(false));
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap="2em" mt="4em">
      {loginMessage && <Alert severity={loginStatus}>{loginMessage}</Alert>}
      <LoginForm onLogIn={onLogIn} isPending={isPending} />
    </Box>
  );
};

export default LoginPage;
