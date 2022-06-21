import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom';

import { setMessage, setModal } from '../../store/message/messageSlice';
import { selLoaderShow } from '../../store/general/selectors';
import { selFlagModal, selFlagMessage } from '../../store/message/selectors';
import { Header } from '../Header';
import { Loader } from '../Loader';
import { MessageBox } from '../MessageBox';

import styles from './Pattern.module.scss';

const Pattern = () => {
  const flagModal = useSelector(selFlagModal);
  const flagMessage = useSelector(selFlagMessage);
  const loaderShow = useSelector(selLoaderShow);

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
