import { Box, Button, Modal, Typography } from "@mui/material";
import React from "react";
import type { Panic } from "../../types/app.types";

interface PanicDetailModalProps {
  currentPanic: Panic;
  showModal: boolean;
  setShowModal: (value: React.SetStateAction<boolean>) => void;
  onCancelPanic: (panicId: number) => void;
}

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

const PanicDetailModal = ({ currentPanic, setShowModal, showModal, onCancelPanic }: PanicDetailModalProps) => {
  const handleCancelPanic = () => {
    onCancelPanic(currentPanic.id);
    setShowModal(false);
  };

  return (
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
            <Typography id="panicStatus">Status: {currentPanic.status.name}</Typography>
          </>
        ) : (
          <Typography>Nothing to see</Typography>
        )}

        {currentPanic.status.name === "In Progress" && (
          <Button
            variant="outlined"
            id="cancelPanic"
            color="warning"
            sx={{ display: "block", m: "1em auto 0" }}
            onClick={handleCancelPanic}
          >
            Cancel Panic
          </Button>
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
  );
};

export default PanicDetailModal;
