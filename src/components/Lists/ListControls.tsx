import { LoadingButton } from "@mui/lab";
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React from "react";
import { HistorySelectType } from "../../pages/Dashboard";

interface ListControlsProps {
  historyType: HistorySelectType;
  setHistoryType: (value: React.SetStateAction<HistorySelectType>) => void;
  onGetPanics: () => void;
  isPending: boolean;
}

const ListControls = ({ historyType, isPending, onGetPanics, setHistoryType }: ListControlsProps) => {
  return (
    <Box display="flex" gap="1em" mt="3.5em">
      <FormControl>
        <InputLabel id="history-type-select-label">History Type</InputLabel>
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

      <LoadingButton variant="contained" onClick={onGetPanics} id="panicHistory" loading={isPending}>
        Refresh history
      </LoadingButton>
    </Box>
  );
};

export default React.memo(ListControls);
