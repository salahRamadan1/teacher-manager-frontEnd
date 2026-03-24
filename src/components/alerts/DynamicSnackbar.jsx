import React, { useState } from "react";
import { Snackbar, Alert } from "@mui/material";

/**
 * DynamicSnackbar Component
 * ------------------------
 * Props:
 *  - open: boolean → whether the snackbar is visible
 *  - type: "success" | "error" | "warning" | "info" → type of message
 *  - message: string → the text to display
 *  - duration: number → auto hide duration in ms (default 2000)
 *  - onClose: function → callback when snackbar closes
 */
const DynamicSnackbar = ({ type = "success", message, duration = 2000 }) => {
  return (
    <Snackbar
      open={true}
      autoHideDuration={duration}
      onClose={false ||null}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert
        onClose={false||null}
        severity={type}
        variant="filled"
        sx={(theme) => ({
          minWidth: 250,
          textAlign: "center",
          fontWeight: 600,
          borderRadius: 2,
          boxShadow: 3,
          bgcolor:
            type === "success"
              ? theme.palette.mode === "light"
                ? theme.palette.success.light
                : theme.palette.success.dark
              : type === "error"
              ? theme.palette.mode === "light"
                ? theme.palette.error.light
                : theme.palette.error.dark
              : type === "warning"
              ? theme.palette.mode === "light"
                ? theme.palette.warning.light
                : theme.palette.warning.dark
              : theme.palette.mode === "light"
              ? theme.palette.info.light
              : theme.palette.info.dark,
          color: theme.palette.getContrastText(
            type === "success"
              ? theme.palette.mode === "light"
                ? theme.palette.success.light
                : theme.palette.success.dark
              : type === "error"
              ? theme.palette.mode === "light"
                ? theme.palette.error.light
                : theme.palette.error.dark
              : type === "warning"
              ? theme.palette.mode === "light"
                ? theme.palette.warning.light
                : theme.palette.warning.dark
              : theme.palette.mode === "light"
              ? theme.palette.info.light
              : theme.palette.info.dark
          ),
        })}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default DynamicSnackbar;
