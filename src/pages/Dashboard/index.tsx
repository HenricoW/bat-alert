import React, { useCallback, useEffect, useState } from "react";
import { Alert, Backdrop, Box, CircularProgress, Snackbar } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { PanicStatus } from "../../types/app.types";
import { cancelPanic, getPanics, raisePanic } from "../../core/panics.service";
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

  const resetUIcommunication = () => {
    setIsPending(true);
    setResponseStatus("success");
  };

  const onPanic = useCallback(
    async (reqType: "fetch" | "raise" | "cancel", data: any) => {
      let promise: Promise<ApiResponse>;
      switch (reqType) {
        case "raise":
          promise = raisePanic(data);
          break;
        case "cancel":
          promise = cancelPanic(data);
          break;
        default:
          promise = getPanics(historyType === "All" ? undefined : PanicStatus[historyType]);
      }

      promise
        .then((response) => {
          if (!response.status || response.status === "error") {
            setResponseStatus("error");
            setPanicsMessage(`Could not ${reqType} panic(s)`);
          } else {
            if (reqType === "fetch") {
              dispatch(panicActions.setPanics(response.data.panics));
            } else {
              setPanicsMessage(response.message);
              setSnackOpen(true);
              onGetPanics();
            }
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
    },
    // eslint-disable-next-line
    [historyType, dispatch]
  );

  const onGetPanics = useCallback(() => {
    resetUIcommunication();
    dispatch(panicActions.setPanics([]));

    onPanic("fetch", null);
  }, [dispatch, onPanic]);

  const onNewPanic = useCallback(
    (values: typeof initialPanicValues) => {
      resetUIcommunication();
      setPanicsMessage("");

      const panicData = {
        panic_type: values.panicType,
        details: values.details,
        latitude: values.latitude.toString(),
        longitude: values.longitude.toString(),
      };

      onPanic("raise", panicData);
    },
    [onPanic]
  );

  const onCancelPanic = (panicId: number) => {
    resetUIcommunication();
    setPanicsMessage("");

    onPanic("cancel", panicId);
  };

  useEffect(() => {
    if (!userToken) navigate("/");
  }, [userToken, navigate]);

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
