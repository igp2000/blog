import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { setProfileState } from '../store/profile/profileSlice';
import { selToken } from '../store/profile/selectors';

export const RequireAuth = ({ children }) => {
  const location = useLocation();
  const dispatch = useDispatch();

  let token = useSelector(selToken);

  if (!token && localStorage['blog']) {
    const blog = JSON.parse(localStorage.getItem('blog'));
    dispatch(setProfileState(blog));
    token = blog.token;
  }

  if (!token) {
    return <Navigate to="/sign-in" state={{ from: location.pathname }} />;
  }

  return children;
};
