import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames';

import { setMessage, setModal } from '../../store/message/messageSlice';
import { fetchQuery } from '../../store/general/generalSlice';
import { selArticle } from '../../store/articles/selectors';
import { selMessage, selFlagMessage, selFlagModal, selResize } from '../../store/message/selectors';
import { selToken } from '../../store/profile/selectors';

import styles from './MessageBox.module.scss';

const MessageBox = ({ id }) => {
  const dispatch = useDispatch();

  const [styleSide, setStyleSide] = useState(null);
  const [classSide, setClassSide] = useState([]);
  const [styleFlag, setStyleFlag] = useState([]);

  const message = useSelector(selMessage);
  const flagMessage = useSelector(selFlagMessage);
  const flagModal = useSelector(selFlagModal);
  const resize = useSelector(selResize);
  const article = useSelector(selArticle);
  const token = useSelector(selToken);

  const side = flagMessage === 'confirm';

  useEffect(() => {
    setStyleFlag([styles[`message-box__text_${flagMessage}`]]);

    setClassSide([
      classNames({
        [styles['message-box_transition']]: !flagModal,
        [styles['message-box-left']]: flagModal,
        [styles['message-box-right']]: flagModal,
        [styles['message-box-center']]: flagModal,
      }),
    ]);
  }, []);

  useEffect(() => {
    if (!flagModal && side) {
      setClassSide([
        classNames(styles['message-box_transition'], {
          [styles['message-box-left']]: resize,
          [styles['message-box-right']]: !resize,
        }),
      ]);
      resize ? setStyleSide(getLeft()) : setStyleSide(null);
    }
  }, [resize]);

  function getLeft() {
    const btnDelete = document.getElementById('btn-delete-article');
    return btnDelete ? { marginLeft: `-${246 + btnDelete.offsetWidth + 11}px` } : null;
  }

  const articleDelete = () => {
    dispatch(
      fetchQuery({
        query: `articles/${article.slug}`,
        typeQuery: 'article-delete',
        options: {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      })
    );
  };

  return (
    <div
      className={classNames(styles['message-box'], ...classSide)}
      style={styleSide}
      onClick={(event) => {
        event.target.id = id;
      }}
    >
      <div className={classNames(styles['message-box__text'], ...styleFlag)}>{message}</div>
      <div className={styles['message-box-buttons']}>
        <button
          className={classNames('button', 'button_color_gray', 'button-form', styles['message-box__button-no'])}
          onClick={() => {
            dispatch(setModal({ flag: false }));
            dispatch(setMessage({ massage: '', flag: null }));
          }}
        >
          {side ? 'No' : 'Close'}
        </button>
        {side && (
          <button
            className={classNames('button', 'button-form', 'button-form_bg_blue', styles['message-box__button-yes'])}
            onClick={articleDelete}
          >
            Yes
          </button>
        )}
      </div>
    </div>
  );
};
export default MessageBox;
