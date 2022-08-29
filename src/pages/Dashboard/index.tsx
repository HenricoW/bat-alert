import React, { useEffect, useState } from "react";
import {
  Alert,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Snackbar,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { LoadingButton } from "@mui/lab";

import { getPanics, raisePanic, reversePanics } from "../../core/panics.service";
import { useAppDispatch, useAppSelector } from "../../hooks/storeHooks";
import PaginatedList from "../../components/Lists/PaginatedList";
import { panicActions } from "../../store/slices/panicSlice";
import type { ApiResponse } from "../../types/api.types";
import RaisePanicForm, { initialPanicValues } from "../../components/Forms/RaisePanicForm";
import { PanicStatus, PanicStatusField } from "../../types/app.types";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #ccc",
  borderRadius: "10px",
  p: 4,
};

type HistorySelectType = "All" | PanicStatusField["name"];

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
    setPanicsMessage("");
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

  useEffect(() => {
    if (!userToken) navigate("/");
  }, [userToken]);

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt="3em">
      <RaisePanicForm onNewPanic={onNewPanic} />

      {panicsMessage && <Alert severity={responseStatus}>{panicsMessage}</Alert>}

      <Box display="flex" gap="1em" mt="4em">
        <FormControl>
          <InputLabel id="history-type-select-label">Panic Type</InputLabel>
          <Select
            labelId="history-type-select-label"
            id="history-type-select"
            value={historyType}
            label="Panic Type"
            sx={{ minWidth: "120px" }}
            onChange={(e) => setHistoryType(e.target.value as HistorySelectType)}
          >
            <MenuItem value={"All"}>All</MenuItem>
            <MenuItem value={"In Progress"}>In Progress</MenuItem>
            <MenuItem value={"Canceled"}>Cancelled</MenuItem>
            <MenuItem value={"Resolved"}>Resolved</MenuItem>
          </Select>
        </FormControl>

        <LoadingButton
          variant="contained"
          onClick={onGetPanics}
          id="panicHistory"
          loading={isPending}
          // sx={{ mt: "4em" }}
        >
          Refresh panic list
        </LoadingButton>
      </Box>

      <PaginatedList setShowModal={setShowModal} />

      <Snackbar open={snackOpen} autoHideDuration={6000} onClose={() => setSnackOpen(false)}>
        <Alert onClose={() => setSnackOpen(false)} severity="success" sx={{ width: "100%" }}>
          {panicsMessage}
        </Alert>
      </Snackbar>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isPending}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <Box id="panicDetail" sx={style}>
          {currentPanic.details ? (
            <>
              <Typography variant="h6">Panic Detail</Typography>
              <Typography id="panicTitle" variant="h5" m=".5em 0 1em">
                {currentPanic.details}
              </Typography>
              <Typography>When: {new Date(currentPanic.created_at).toLocaleString("en-GB")}</Typography>
              <Typography>Where: {`${currentPanic.latitude}, ${currentPanic.longitude}`}</Typography>
              <Typography>Type: {currentPanic.panic_type}</Typography>
              <Typography>Status: {currentPanic.status.name}</Typography>
            </>
          ) : (
            <Typography>Nothing to see</Typography>
          )}
          <Button
            variant="outlined"
            id="closeDetail"
            sx={{ display: "block", m: "1em auto 0" }}
            onClick={() => setShowModal(false)}
          >
            Close
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default Dashboard;
