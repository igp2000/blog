import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import classNames from 'classnames';

import { setProfileState } from '../../store/profile/profileSlice';
import { setCurrentPage } from '../../store/articles/articlesSlice';
import { selToken, selUsername, selImage } from '../../store/profile/selectors';
import foto from '../css/img/foto.png';

import styles from './Header.module.scss';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const token = useSelector(selToken);
  const username = useSelector(selUsername);
  const image = useSelector(selImage);
  const avatar = image ? image : foto;

  const button = token ? (
    <>
      <Link
        className={classNames('button', 'button_color_green', styles['button__create-article'])}
        to="/new-article"
        state={{ from: location.pathname }}
      >
        Create article
      </Link>

      <div className={styles['user-data']} onClick={() => navigate('/profile')}>
        <span className={styles['user-data-name']}>{username}</span>
        <img src={avatar} alt={username} />
      </div>

      <Link
        className={classNames('button', 'button_color_black', styles['button__log-out'])}
        to="#"
        onClick={() => {
          localStorage.removeItem('blog');
          dispatch(setProfileState({}));
        }}
      >
        Log Out
      </Link>
    </>
  ) : (
    <>
      <Link
        className={classNames('button', 'button_border_none', styles['button__signin'])}
        to="/sign-in"
        state={{ from: location.pathname }}
      >
        Sign In
      </Link>
      <Link
        className={classNames('button', 'button_color_green', styles['button__signup'])}
        to="/sign-up"
        state={{ from: location.pathname }}
      >
        Sign Up
      </Link>
    </>
  );

  return (
    <header className={styles.header}>
      <Link
        className={styles['header-title']}
        to="/"
        onClick={() => {
          sessionStorage.setItem('blogCurrentPage', 1);
          dispatch(setCurrentPage({ page: 1 }));
          navigate('/');
        }}
      >
        Realworld Blog
      </Link>
      <div className={styles['header-buttons']}>{button}</div>
    </header>
  );
};

export default Header;
