import React, { useEffect, useState } from "react";
import { Alert, Backdrop, Box, CircularProgress, Snackbar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { LoadingButton } from "@mui/lab";

import { getPanics, raisePanic } from "../../core/panics.service";
import { useAppDispatch, useAppSelector } from "../../hooks/storeHooks";
import PaginatedList from "../../components/Lists/PaginatedList";
import { panicActions } from "../../store/slices/panicSlice";
import type { ApiResponse } from "../../types/api.types";
import RaisePanicForm, { initialPanicValues } from "../../components/Forms/RaisePanicForm";

const Dashboard = () => {
  const [panicsMessage, setPanicsMessage] = useState("");
  const [responseStatus, setResponseStatus] = useState<ApiResponse["status"]>("success");
  const [isPending, setIsPending] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);

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

  const onNewPanic = (values: typeof initialPanicValues) => {
    setIsPending(true);
    setResponseStatus("success");
    setPanicsMessage("");

    const panicData = {
      panic_type: values.panicType,
      details: values.details,
      latitude: values.latitude.toString(),
      longitude: values.longitude.toString(),
    };

    raisePanic(panicData)
      .then((response) => {
        console.log("raise response:", response);
        if (!response.status || response.status === "error") {
          setResponseStatus("error");
          setPanicsMessage("Could not raise panic");
        } else {
          dispatch(panicActions.addPanic(panicData));
          setSnackOpen(true);
          setPanicsMessage(response.message);
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
      <RaisePanicForm onNewPanic={onNewPanic} />

      {panicsMessage && <Alert severity={responseStatus}>{panicsMessage}</Alert>}
      <LoadingButton variant="contained" onClick={onGetPanics} loading={isPending} sx={{ mt: "4em" }}>
        Refresh panic list
      </LoadingButton>

      <PaginatedList />

      <Snackbar open={snackOpen} autoHideDuration={6000} onClose={() => setSnackOpen(false)}>
        <Alert onClose={() => setSnackOpen(false)} severity="success" sx={{ width: "100%" }}>
          {panicsMessage}
        </Alert>
      </Snackbar>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isPending}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};

export default Dashboard;
