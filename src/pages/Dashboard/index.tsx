import React, { useEffect, useState } from "react";
import { Alert, Backdrop, Box, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { LoadingButton } from "@mui/lab";

import { getPanics } from "../../core/panics.service";
import { useAppDispatch, useAppSelector } from "../../hooks/storeHooks";
import PaginatedList from "../../components/Lists/PaginatedList";
import { panicActions } from "../../store/slices/panicSlice";
import type { ApiResponse } from "../../types/api.types";
import RaisePanicForm from "../../components/Forms/RaisePanicForm";

const Dashboard = () => {
  const [panicsMessage, setPanicsMessage] = useState("");
  const [responseStatus, setResponseStatus] = useState<ApiResponse["status"]>("success");
  const [isPending, setIsPending] = useState(false);

  const userToken = useAppSelector((state) => state.user.token_id);
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const onGetPanics = () => {
    setIsPending(true);
    setResponseStatus("success");
    setPanicsMessage("");
    dispatch(panicActions.setPanics([]));

    getPanics()
      .then((response) => {
        if (!response.status || response.status === "error") {
          setResponseStatus("error");
          setPanicsMessage("Could not fetch panics");
        } else {
          dispatch(panicActions.setPanics(response.data.panics));
        }
      })
      .catch((error) => {
        console.log(error);
        setResponseStatus("error");
        setPanicsMessage(error.message);
      })
      .finally(() => {
        setIsPending(false);
      });
  };

  useEffect(() => {
    if (!userToken) navigate("/");
  }, [userToken]);

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt="3em">
      <RaisePanicForm />
      {panicsMessage && <Alert severity={responseStatus}>{panicsMessage}</Alert>}
      <LoadingButton variant="contained" onClick={onGetPanics} loading={isPending} sx={{ my: "2em" }}>
        Get panics
      </LoadingButton>
      <PaginatedList />
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isPending}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};

export default Dashboard;
