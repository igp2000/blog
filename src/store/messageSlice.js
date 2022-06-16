import { createSlice } from '@reduxjs/toolkit';

import { fetchQuery } from './generalSlice';

const messageSlice = createSlice({
  name: 'message',
  initialState: {
    message: '',
    flagMessage: '',
    flagModal: false,
    resize: false,
    errorsServer: {},
  },
  reducers: {
    setMessage(state, action) {
      state.message = action.payload.message;
      state.flagMessage = action.payload.flag;
      state.flagModal = action.payload.flag === 'error';
    },
    setModal(state, action) {
      state.flagModal = action.payload.flag;
    },
    setResize(state, action) {
      state.resize = action.payload.flag;
    },
    setErrorsServer(state, action) {
      state.errorsServer = action.payload.errorsServer;
    },
  },
  extraReducers: {
    [fetchQuery.fulfilled]: (state, action) => {
      if (action.payload.typeQuery === 'profile') {
        state.message = 'Профиль сохранен';
        state.flagMessage = 'success';
        state.flagModal = true;
      }
    },
    [fetchQuery.rejected]: (state, action) => {
      try {
        const errors = JSON.parse(action.error.message);
        Object.keys(errors).reduce((str, key) => {
          const words = key.split(' ');
          return words.forEach((k) => {
            state.errorsServer[k] = `${key} ${errors[key]}`;
          });
        }, '');
      } catch (error) {
        state.message = action.error.message;
        state.flagMessage = 'error';
        state.flagModal = true;
      }
    },
  },
});

export const { setMessage, setModal, setResize, setErrorsServer } = messageSlice.actions;
export default messageSlice.reducer;
