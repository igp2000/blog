import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';

import { fetchQuery } from '../../store/generalSlice';
import { setArticle, setArticleStored } from '../../store/articlesSlice';

import styles from './ArticleForm.module.scss';

const ArticleForm = ({ type }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [tags, setTags] = useState([]);

  const { loaderShow } = useSelector((state) => state.generalSlice);
  const { token } = useSelector((state) => state.profileSlice);
  const { article, articleStored } = useSelector((state) => state.articlesSlice);

  const [slug, setSlug] = useState(null);

  const types = {
    edit: {
      title: 'Edit article',
    },
    new: {
      title: 'Create new article',
    },
  };

  const fields = {
    title: yup.string().required('Требуется заголовок статьи'),
    description: yup.string().required('Требуется короткое описание'),
    body: yup.string().required('Требуется полный текст статьи'),
  };

  const validationForm = yup.object().shape(fields);

  const {
    register,
    formState: { errors },
    setValue,
    getValues,
    handleSubmit,
    clearErrors,
    reset,
  } = useForm({ resolver: yupResolver(validationForm) });

  useEffect(() => {
    if (type === 'edit') {
      clearErrors();
    } else {
      setTags([]);
      reset();
    }
    dispatch(setArticleStored({ articleStored: false }));
  }, [location.pathname]);

  useEffect(() => {
    if (type === 'new' && !articleStored) {
      dispatch(setArticle({ article: null }));
      dispatch(setArticleStored({ articleStored: false }));
      setTags([]);
      setValue('title', '');
      setValue('description', '');
      setValue('body', '');
    } else if (article) {
      if (articleStored) {
        return navigate(`/article/${article.slug}`);
      }
      setTags(article.tagList);
      setValue('title', article.title);
      setValue('description', article.description);
      setValue('body', article.body);
      setSlug(article.slug);
    }

    return () => {
      dispatch(setArticle({ article: null }));
      dispatch(setArticleStored({ articleStored: false }));
    };
  }, [article]);

  const onSubmit = (data) => {
    let query = 'articles';
    let method = 'POST';

    if (type === 'edit') {
      query = `articles/${slug}`;
      method = 'PUT';
    }

    const arr = tags.filter((tag) => tag);
    setTags(arr);

    if (arr.length) {
      data.tagList = arr;
    } else {
      delete data.tagList;
    }

    dispatch(
      fetchQuery({
        query: query,
        typeQuery: 'article-edit',
        options: {
          method: method,
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ article: data }),
        },
      })
    );
  };

  return (
    <div className={classNames(styles['page'], { 'display-none': loaderShow })}>
      <h1 className={styles.title}>{types[type].title}</h1>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <label className={classNames({ [styles['value-error']]: errors.title?.message })}>
          Title
          <input
            type="text"
            placeholder="Title"
            tabIndex="1"
            defaultValue={getValues('title') || ''}
            {...register('title')}
          />
          <span>{errors.title?.message}</span>
        </label>
        <label className={classNames({ [styles['value-error']]: errors.description?.message })}>
          Short description
          <input
            type="text"
            placeholder="Short description"
            tabIndex="2"
            defaultValue={getValues('description') || ''}
            {...register('description')}
          />
          <span>{errors.description?.message}</span>
        </label>
        <label className={classNames({ [styles['value-error']]: errors.body?.message })}>
          Text
          <textarea
            placeholder="Text"
            tabIndex="3"
            defaultValue={getValues('body') || ''}
            {...register('body')}
          ></textarea>
          <span>{errors.body?.message}</span>
        </label>

        <span className={classNames(styles.tags, { [styles['tags_mb_null']]: !tags.length })}>Tags</span>
        <div className={styles.tags}>
          <label tabIndex="4">
            {tags.map((tag, ind) => {
              setValue(`tagList[${ind}]`, tag);
              return (
                <div className={styles.tag} key={ind} tabIndex={ind}>
                  <input
                    type="text"
                    placeholder={`tag ${ind + 1}`}
                    tabIndex={ind + 1}
                    defaultValue={tag}
                    {...register(`tagList[${ind}]`)}
                    onInput={(event) => {
                      setTags([...tags.slice(0, ind), event.target.value, ...tags.slice(ind + 1)]);
                    }}
                  />
                  <button
                    className="button button_color_red button-form button-form__delete-tag"
                    tabIndex="2"
                    onClick={(event) => {
                      event.preventDefault();
                      setTags([...tags.slice(0, ind), ...tags.slice(ind + 1)]);
                    }}
                  >
                    Delete
                  </button>
                </div>
              );
            })}
          </label>
          <button
            className="button button_color_blue button-form button-form__add-tag"
            tabIndex="5"
            onClick={(event) => {
              event.preventDefault();
              setTags([...tags, '']);
            }}
          >
            Add tag
          </button>
        </div>
        <button className="button button-form button-form_bg_blue button-form__send">Send</button>
      </form>
    </div>
  );
};

export default ArticleForm;
