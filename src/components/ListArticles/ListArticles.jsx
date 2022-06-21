import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames';

import { setMessage } from '../../store/message/messageSlice';
import { fetchQuery } from '../../store/general/generalSlice';
import { setCurrentPage } from '../../store/articles/articlesSlice';
import { selLoaderShow } from '../../store/general/selectors';
import { selArticles, selCurrentPage } from '../../store/articles/selectors';
import { selToken } from '../../store/profile/selectors';
import { Article } from '../Article';
import { Paginator } from '../Pagination';

import styles from './ListArticles.module.scss';

const ListArticles = () => {
  const dispatch = useDispatch();
  const articles = useSelector(selArticles);
  const currentPage = useSelector(selCurrentPage);
  let token = useSelector(selToken);
  const loaderShow = useSelector(selLoaderShow);

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
    <div className={classNames(styles['list-articles'], { 'display-none': loaderShow })}>
      {articles.map((article, index) => {
        return <Article key={index} data={article} artIndex={index} />;
      })}
      {articles.length > 0 && <Paginator currentPageChange={currentPageChange} />}
    </div>
  );
};

export default ListArticles;
