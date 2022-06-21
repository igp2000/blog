import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

import { setMessage } from '../../store/message/messageSlice';
import { fetchQuery } from '../../store/general/generalSlice';
import { selArticle, selArticleDeleted } from '../../store/articles/selectors';
import { selToken } from '../../store/profile/selectors';
import { setArticle, setArticleStored, setArticleDeleted } from '../../store/articles/articlesSlice';
import { Article } from '../Article';
import { ArticleForm } from '../ArticleForm';

const ArticleSingle = ({ type }) => {
  const dispatch = useDispatch();
  const params = useParams();
  const location = useLocation();

  const article = useSelector(selArticle);
  const articleDeleted = useSelector(selArticleDeleted);
  let token = useSelector(selToken);

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(setMessage({ message: '', flag: '' }));
    if (type !== 'new') {
      if (!token && localStorage['blog']) {
        token = JSON.parse(localStorage['blog']).token;
      }
      const options = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      dispatch(fetchQuery({ query: `articles/${params.slug}`, typeQuery: 'article', options }));
    }

    return () => {
      dispatch(setArticle({ article: null }));
      dispatch(setArticleStored({ articleStored: false }));
    };
  }, [location.pathname]);

  useEffect(() => {
    if (articleDeleted) {
      return navigate('/', { replace: true });
    }
    return () => {
      dispatch(setArticleDeleted({ articleDeleted: false }));
    };
  }, [article]);

  return (
    <>
      {type === 'show' && article && <Article data={article} single={true} />}
      {type !== 'show' && <ArticleForm type={type} />}
    </>
  );
};

export default ArticleSingle;
