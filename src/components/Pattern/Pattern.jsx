import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom';

import { setMessage, setModal } from '../../store/messageSlice';
import { Header } from '../Header';
import { Loader } from '../Loader';
import { MessageBox } from '../MessageBox';

import styles from './Pattern.module.scss';

const Pattern = () => {
  const flagModal = useSelector((state) => state.messageSlice.flagModal);
  const flagMessage = useSelector((state) => state.messageSlice.flagMessage);
  const loaderShow = useSelector((state) => state.generalSlice.loaderShow);

  const dispatch = useDispatch();

  const modalBgClick = (event) => {
    if (flagModal) {
      return;
    }
    if (flagMessage && event.target.id !== 'mesbox') {
      dispatch(setModal({ flag: false }));
      dispatch(setMessage({ message: '', flag: null }));
    }
  };

  return (
    <div onClick={modalBgClick}>
      {flagModal && (
        <div className="modal-background">
          <MessageBox id="mesbox-modal" />
        </div>
      )}
      <Header />
      <main className={styles.content}>
        {loaderShow && <Loader />}
        <Outlet />
      </main>
    </div>
  );
};

export default Pattern;
