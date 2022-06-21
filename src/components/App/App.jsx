import React, { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Routes, Route } from 'react-router-dom';
import debounce from 'lodash.debounce';

import { setMessage, setResize } from '../../store/message/messageSlice';
import { setProfileState } from '../../store/profile/profileSlice';
import { Pattern } from '../Pattern';
import { ArticleSingle } from '../ArticleSingle';
import { ListArticles } from '../ListArticles';
import { ProfileForm } from '../ProfileForm';
import { RequireAuth } from '../../hoc/RequireAuth';

const App = () => {
  const dispatch = useDispatch();

  const wResize = useCallback(debounce(winResize, 200));

  useEffect(() => {
    winResize();
    window.addEventListener('resize', wResize);

    if (localStorage['blog']) {
      dispatch(setProfileState(JSON.parse(localStorage.getItem('blog'))));
    }

    return () => {
      window.removeEventListener('resize', wResize);
    };
  }, []);

  function winResize() {
    dispatch(setResize({ flag: document.documentElement.clientWidth < 1260 }));
  }

  return (
    <Routes>
      <Route path="/" element={<Pattern />}>
        <Route index element={<ListArticles />} />
        <Route path="articles" element={<ListArticles />} />
        <Route path="article/:slug" element={<ArticleSingle type={'show'} />} />
        <Route
          path="article/:slug/edit"
          element={
            <RequireAuth>
              <ArticleSingle type={'edit'} />
            </RequireAuth>
          }
        />
        <Route
          path="new-article"
          element={
            <RequireAuth>
              <ArticleSingle type={'new'} />
            </RequireAuth>
          }
        />
        <Route path="sign-in" element={<ProfileForm type={'signin'} />} />
        <Route path="sign-up" element={<ProfileForm type={'signup'} />} />
        <Route
          path="profile"
          element={
            <RequireAuth>
              <ProfileForm type={'profile'} />
            </RequireAuth>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

const NotFound = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setMessage({ message: 'Error 404: Page not found', flag: 'error' }));
  }, []);

  return <></>;
};

export default App;
