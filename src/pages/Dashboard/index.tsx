import React, { useEffect, useState } from "react";
import { Alert, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { LoadingButton } from "@mui/lab";

import { getPanics } from "../../core/panics.service";
import { useAppSelector } from "../../hooks/storeHooks";
import { ApiResponse } from "../../types/api.types";
import { Panic } from "../../types/app.types";
import PaginatedList from "../../components/Lists/PaginatedList";

const Dashboard = () => {
  const [panicsMessage, setPanicsMessage] = useState("");
  const [responseStatus, setResponseStatus] = useState<ApiResponse["status"]>("success");
  const [isPending, setIsPending] = useState(false);
  const [panicList, setPanicList] = useState<Panic[]>([]);

  const userToken = useAppSelector((state) => state.user.token_id);

  const navigate = useNavigate();

  const onGetPanics = () => {
    setIsPending(true);
    setResponseStatus("success");
    setPanicsMessage("");
    setPanicList([]);

    getPanics()
      .then((response) => {
        if (!response.status || response.status === "error") {
          setResponseStatus("error");
          setPanicsMessage("Could not fetch panics");
        } else {
          setPanicList(response.data.panics);
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
      {panicsMessage && <Alert severity={responseStatus}>{panicsMessage}</Alert>}
      <LoadingButton variant="contained" onClick={onGetPanics} loading={isPending} sx={{ my: "2em" }}>
        Get panics
      </LoadingButton>
      <PaginatedList panicList={panicList} />
    </Box>
  );
};

export default Dashboard;
