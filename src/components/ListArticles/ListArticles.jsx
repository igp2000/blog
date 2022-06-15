import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { setMessage } from '../../store/messageSlice';
import { fetchQuery } from '../../store/generalSlice';
import { setCurrentPage } from '../../store/articlesSlice';
import { Article } from '../Article';
import { Paginator } from '../Pagination';

import styles from './ListArticles.module.scss';

const ListArticles = () => {
  const dispatch = useDispatch();
  const { articles, currentPage } = useSelector((state) => state.articlesSlice);
  let { token } = useSelector((state) => state.profileSlice);

  const currentPageChange = (page) => {
    dispatch(setMessage({ message: '', flag: '' }));

    sessionStorage.setItem('blogCurrentPage', page);
    dispatch(setCurrentPage({ page }));

    if (!token && localStorage['blog']) {
      token = JSON.parse(localStorage['blog']).token;
    }
    const options = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    dispatch(fetchQuery({ query: `articles?limit=20&offset=${(page - 1) * 20}`, typeQuery: 'articles', options }));
  };

  useEffect(() => {
    const page = Number(sessionStorage['blogCurrentPage'] ? sessionStorage.getItem('blogCurrentPage') : currentPage);
    currentPageChange(page);
  }, [currentPage]);

  return (
    <div className={styles['list-articles']}>
      {articles.map((article, index) => {
        return <Article key={index} data={article} artIndex={index} />;
      })}
      {articles.length > 0 && <Paginator currentPageChange={currentPageChange} />}
    </div>
  );
};

export default ListArticles;
