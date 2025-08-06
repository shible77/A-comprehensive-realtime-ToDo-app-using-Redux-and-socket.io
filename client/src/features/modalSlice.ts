import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface ModalState {
  isOpen: boolean;
  title: string;
  message: string;
  type: "info" | "warning" | "error";
  confirmAction?: (() => void) | null;
}

const initialState: ModalState = {
  isOpen: false,
  title: "",
  message: "",
  type: "info",
  confirmAction: null,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    showModal: (
      state,
      action: PayloadAction<{
        title: string;
        message: string;
        type?: "info" | "warning" | "error";
        confirmAction?: () => void;
      }>
    ) => {
      state.isOpen = true;
      state.title = action.payload.title;
      state.message = action.payload.message;
      state.type = action.payload.type || "info";
      state.confirmAction = action.payload.confirmAction || null;
    },
    hideModal: (state) => {
      state.isOpen = false;
      state.title = "";
      state.message = "";
      state.confirmAction = null;
    },
  },
});

export const { showModal, hideModal } = modalSlice.actions;
export default modalSlice.reducer;
