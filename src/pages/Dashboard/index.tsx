import React, { useEffect, useState } from "react";
import { Alert, Backdrop, Box, CircularProgress, Snackbar } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { PanicStatus } from "../../types/app.types";
import { cancelPanic, getPanics, raisePanic, reversePanics } from "../../core/panics.service";
import { useAppDispatch, useAppSelector } from "../../hooks/storeHooks";
import { panicActions } from "../../store/slices/panicSlice";
import type { ApiResponse } from "../../types/api.types";
import type { PanicStatusField } from "../../types/app.types";

import PaginatedList from "../../components/Lists/PaginatedList";
import RaisePanicForm, { initialPanicValues } from "../../components/Forms/RaisePanicForm";
import ListControls from "../../components/Lists/ListControls";
import PanicDetailModal from "../../components/Modals/PanicDetailModal";

export type HistorySelectType = "All" | PanicStatusField["name"];

const Dashboard = () => {
  const [panicsMessage, setPanicsMessage] = useState("");
  const [responseStatus, setResponseStatus] = useState<ApiResponse["status"]>("success");
  const [isPending, setIsPending] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [historyType, setHistoryType] = useState<HistorySelectType>("All");

  const userToken = useAppSelector((state) => state.user.token_id);
  const currentPanic = useAppSelector((state) => state.panics.currentPanic);
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const onGetPanics = () => {
    setIsPending(true);
    setResponseStatus("success");
    dispatch(panicActions.setPanics([]));

    getPanics(historyType === "All" ? undefined : PanicStatus[historyType])
      .then((response) => {
        if (!response.status || response.status === "error") {
          setResponseStatus("error");
          setPanicsMessage("Could not fetch panics");
        } else {
          const revPanics = reversePanics(response.data.panics);
          dispatch(panicActions.setPanics(revPanics));
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

  const onCancelPanic = (panicId: number) => {
    setIsPending(true);
    setResponseStatus("success");
    setPanicsMessage("");

    cancelPanic(panicId)
      .then((response) => {
        if (!response.status || response.status === "error") {
          setResponseStatus("error");
          setPanicsMessage("Could not cancel panic");
        } else {
          setPanicsMessage(response.message);
          setSnackOpen(true);
          onGetPanics();
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

      {responseStatus === "error" && panicsMessage && (
        <Alert severity={responseStatus} sx={{ mt: "1em" }}>
          {panicsMessage}
        </Alert>
      )}

      <ListControls
        historyType={historyType}
        isPending={isPending}
        onGetPanics={onGetPanics}
        setHistoryType={setHistoryType}
      />

      <PaginatedList setShowModal={setShowModal} />

      <Snackbar open={snackOpen} autoHideDuration={6000} onClose={() => setSnackOpen(false)}>
        <Alert onClose={() => setSnackOpen(false)} severity="success" sx={{ width: "100%" }}>
          {panicsMessage}
        </Alert>
      </Snackbar>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isPending}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <PanicDetailModal
        currentPanic={currentPanic}
        setShowModal={setShowModal}
        showModal={showModal}
        onCancelPanic={onCancelPanic}
      />
    </Box>
  );
};

export default Dashboard;
