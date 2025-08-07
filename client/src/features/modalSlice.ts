import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface ModalState {
  isOpen: boolean;
  title: string;
  message: string;
  type: "info" | "warning" | "error";
  actionId?: string;
}

const initialState: ModalState = {
  isOpen: false,
  title: "",
  message: "",
  type: "info",
  actionId: undefined
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
        actionId?: string;
      }>
    ) => {
      state.isOpen = true;
      state.title = action.payload.title;
      state.message = action.payload.message;
      state.type = action.payload.type || "info";
      state.actionId = action.payload.actionId;
    },
    hideModal: (state) => {
      state.isOpen = false;
      state.title = "";
      state.message = "";
      state.actionId = undefined;
    },
  },
});

export const { showModal, hideModal } = modalSlice.actions;
export default modalSlice.reducer;
