import { createSlice } from '@reduxjs/toolkit';

import { fetchQuery } from '../../store/general/generalSlice';

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
      let message = '';
      let typeQuery = '';
      try {
        const errJson = JSON.parse(action.error.message);
        const errors = errJson.errors;
        typeQuery = errJson.typeQuery;
        Object.keys(errors).reduce((str, key) => {
          message += `\n- ${key} ${errors[key]}`;
          const words = key.split(' ');
          return words.forEach((k) => {
            state.errorsServer[k] = `${key} ${errors[key]}`;
          });
        }, '');
        message = `Error:${message}`;
      } catch {
        message = action.error.message;
      }
      state.message = message;
      if (typeQuery !== 'profile' && typeQuery !== 'signin' && typeQuery !== 'signup') {
        state.message = message;
        state.flagMessage = 'error';
        state.flagModal = true;
      }
    },
  },
});

export const { setMessage, setModal, setResize, setErrorsServer } = messageSlice.actions;
export default messageSlice.reducer;
