import React from 'react';

import loader from '../css/img/loader50.gif';

import styles from './Loader.module.scss';

const Loader = () => {
  return (
    <div className={styles.loader}>
      <img src={loader} alt="Загрузка..." />
    </div>
  );
};

export default Loader;
