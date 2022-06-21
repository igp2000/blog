import { configureStore } from '@reduxjs/toolkit';

import messageSlice from './message/messageSlice';
import articlesSlice from './articles/articlesSlice';
import generalSlice from './general/generalSlice';
import profileSlice from './profile/profileSlice';

export default configureStore({
  reducer: {
    messageSlice: messageSlice,
    articlesSlice: articlesSlice,
    generalSlice: generalSlice,
    profileSlice: profileSlice,
  },
});
