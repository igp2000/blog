import { createSlice } from '@reduxjs/toolkit';

import { fetchQuery } from './generalSlice';

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    email: '',
    token: '',
    username: '',
    bio: '',
    image: '',
  },
  reducers: {
    setProfileState(state, action) {
      state.username = action.payload.username || '';
      state.email = action.payload.email || '';
      state.token = action.payload.token || '';
      state.bio = action.payload.bio || '';
      state.image = action.payload.image || '';
    },
  },
  extraReducers: {
    [fetchQuery.fulfilled]: (state, action) => {
      if (
        action.payload.typeQuery === 'signin' ||
        action.payload.typeQuery === 'signup' ||
        action.payload.typeQuery === 'profile'
      ) {
        const obj = {
          username: action.payload.user.username || '',
          email: action.payload.user.email || '',
          token: action.payload.user.token || '',
          bio: action.payload.user.bio || '',
          image: action.payload.user.image || '',
        };
        localStorage.setItem('blog', JSON.stringify(obj));
        state.username = action.payload.user.username || '';
        state.email = action.payload.user.email || '';
        state.token = action.payload.user.token || '';
        state.bio = action.payload.user.bio || '';
        state.image = action.payload.user.image || '';
      }
    },
  },
});

export const { setProfileState } = profileSlice.actions;
export default profileSlice.reducer;
