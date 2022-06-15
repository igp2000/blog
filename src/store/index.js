import { configureStore } from '@reduxjs/toolkit';

import messageSlice from './messageSlice';
import articlesSlice from './articlesSlice';
import generalSlice from './generalSlice';
import profileSlice from './profileSlice';

export default configureStore({
  reducer: {
    messageSlice: messageSlice,
    articlesSlice: articlesSlice,
    generalSlice: generalSlice,
    profileSlice: profileSlice,
  },
});
