import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { format } from 'date-fns/esm';
import ReactMarkdown from 'react-markdown';

import { setMessage } from '../../store/messageSlice';
import { favoritQuery } from '../../store/generalSlice';
import { MessageBox } from '../MessageBox';

import styles from './Article.module.scss';

const Article = ({ data, artIndex = -1, single = false }) => {
  const dispatch = useDispatch();
  const { flagMessage, flagModal } = useSelector((state) => state.messageSlice);
  const { token, username } = useSelector((state) => state.profileSlice);

  const favorit = () => {
    const query = `articles/${data.slug}/favorite`;
    const method = !data.favorited ? 'POST' : 'DELETE';
    const type = !data.favorited ? 'article-favorit-on' : 'article-favorit-off';

    dispatch(
      favoritQuery({
        query: query,
        typeQuery: type,
        artIndex: artIndex,
        options: {
          method: method,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      })
    );
  };

  const getFullText = () => {
    return (
      <div className={styles['article-full-text']}>
        <ReactMarkdown>{data.body}</ReactMarkdown>
      </div>
    );
  };

  const buttonsChange =
    single && token && data.author.username === username ? (
      <div style={{ position: 'relative' }}>
        <button
          id="btn-delete-article"
          className={classNames('button', 'button_color_red', styles['button__delete'])}
          onClick={() => {
            dispatch(setMessage({ message: 'Are you sure to delete this article?', flag: 'confirm' }));
          }}
        >
          Delete
        </button>
        {!flagModal && flagMessage === 'confirm' && <MessageBox id="mesbox" />}
        <Link
          className={classNames('button', 'button_color_green', styles['button__edit'])}
          to={`/article/${data.slug}/edit`}
          state={{ from: location.pathname }}
        >
          Edit
        </Link>
      </div>
    ) : null;

  return (
    <div className={styles['article']}>
      <div className={styles['article-announcement']}>
        <div>
          <div className={styles['article-header']}>
            {single ? (
              <span className={styles['article-header__title']}>{data.title}</span>
            ) : (
              <Link className={styles['article-header__title']} to={`/article/${data.slug}`}>
                {data.title}
              </Link>
            )}

            {token ? (
              <button
                className={classNames(
                  styles['article-header__favorits'],
                  styles['article-header__favorits_cursor_pointer'],
                  {
                    [styles['article-header__favorits_favorited']]: data.favorited,
                  }
                )}
                onClick={favorit}
              ></button>
            ) : (
              <div className={classNames(styles['article-header__favorits'])}></div>
            )}
            <span className={styles['article-header__count-favorits']}>{data.favoritesCount}</span>
          </div>

          <div className={styles['article-tags']}>
            {data.tagList.map((tag, ind) => {
              if (tag.trim()) {
                return (
                  <div key={ind} className={styles['article-tags__tag']}>
                    {tag}
                  </div>
                );
              }
            })}
          </div>

          <div className={styles['article__text-short']}>
            <span>
              <ReactMarkdown>{data.description}</ReactMarkdown>
            </span>
          </div>
        </div>

        <div className={styles['article-data-buttons']}>
          <div className={styles['article-data']}>
            <div className={styles['article-data-text']}>
              <span className={styles['article-data-text__author']}>{data.author.username}</span>
              <span className={styles['article-data-text__date']}>{format(new Date(data.updatedAt), 'LLL d, y')}</span>
            </div>
            <img src={data.author.image} alt="avatar" />
          </div>
          <div className={styles['article-buttons']}>{buttonsChange}</div>
        </div>
      </div>
      {single && getFullText()}
    </div>
  );
};

export default Article;
