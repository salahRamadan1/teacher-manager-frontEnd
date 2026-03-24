import { createSlice } from "@reduxjs/toolkit";
import { generateStudentWhatsappLink } from "./studentReportAction";

const initialState = {
  loadingGenerateWhatsapp: false,
  errorGenerateWhatsapp: null,
  successGenerateWhatsapp: null,
  whatsappLink: null,
  reportLink: null,
};

const studentReportSlice = createSlice({
  name: "studentReport",
  initialState,
  reducers: {
    clearStudentReportState: (state) => {
      state.loadingGenerateWhatsapp = false;
      state.errorGenerateWhatsapp = null;
      state.successGenerateWhatsapp = null;
      state.whatsappLink = null;
      state.reportLink = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateStudentWhatsappLink.pending, (state) => {
        state.loadingGenerateWhatsapp = true;
        state.errorGenerateWhatsapp = null;
        state.successGenerateWhatsapp = null;
      })
      .addCase(generateStudentWhatsappLink.fulfilled, (state, action) => {
        state.loadingGenerateWhatsapp = false;
        state.successGenerateWhatsapp = action.payload.message;
        state.whatsappLink = action.payload.whatsappLink;
        state.reportLink = action.payload.reportLink;
      })
      .addCase(generateStudentWhatsappLink.rejected, (state, action) => {
        state.loadingGenerateWhatsapp = false;
        state.errorGenerateWhatsapp = action.payload || "Something went wrong";
      });
  },
});

export const { clearStudentReportState } = studentReportSlice.actions;
export default studentReportSlice.reducer;