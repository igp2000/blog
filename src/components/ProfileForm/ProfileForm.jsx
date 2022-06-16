import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { setMessage, setErrorsServer } from '../../store/messageSlice';
import { fetchQuery } from '../../store/generalSlice';

import styles from './ProfileForm.module.scss';

const ProfileForm = ({ type }) => {
  const location = useLocation();
  const dispatch = useDispatch();

  const { loaderShow } = useSelector((state) => state.generalSlice);
  const { token } = useSelector((state) => state.profileSlice);
  const { errorsServer } = useSelector((state) => state.messageSlice);

  const navigate = useNavigate();

  const types = {
    signin: {
      title: 'Sign In',
      pass: 'Password',
      button: 'Login',
      link: (
        <>
          Don&apos;t have an account?{' '}
          <Link to="/sign-up" tabIndex="8" state={{ from: location.pathname }}>
            Sign Up
          </Link>
          .
        </>
      ),
      data: {
        email: '',
        password: '',
      },
    },
    signup: {
      title: 'Create new account',
      pass: 'Password',
      button: 'Create',
      link: (
        <>
          Already have an account?{' '}
          <Link to="/sign-in" tabIndex="8" state={{ from: location.pathname }}>
            Sign In
          </Link>
          .
        </>
      ),
      data: {
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        agree: false,
      },
    },
    profile: {
      title: 'Edit Profile',
      pass: 'New password',
      button: 'Save',
      link: null,
      data: {
        email: '',
        username: '',
        password: '',
        image: '',
      },
    },
  };

  useEffect(() => {
    clearErrors();
    dispatch(setErrorsServer({ errorsServer: {} }));

    if (type === 'profile' && localStorage['blog']) {
      const profile = JSON.parse(localStorage.getItem('blog'));
      Object.keys(profile).forEach((key) => {
        setValue(key, profile[key] || '');
      });
    } else {
      Object.keys(types[type].data).forEach((key) => {
        const value = key === 'agree' ? false : '';
        setValue(key, value);
      });
    }
  }, [location.pathname]);

  //console.log('pathBack = ', location.state?.from);

  useEffect(() => {
    if (token) {
      let pathBack = location.state?.from;
      if (
        (type === 'signin' && (pathBack === '/sign-up' || pathBack === '/sign-in')) ||
        (type === 'signup' && (pathBack === '/sign-in' || pathBack === '/sign-up'))
      ) {
        return navigate('/', { replace: true });
      }
      if (type !== 'profile') {
        return navigate(pathBack || '/', { replace: true });
      }
    }
  }, [token]);

  useEffect(() => {
    Object.keys(errorsServer).forEach((key) => {
      setError(key, {
        type: 'manual',
        message: errorsServer[key],
      });
    });
  }, [errorsServer]);

  const fields = {
    username: yup
      .string()
      .required('Требуется имя')
      .min(3, 'Длина имени должна быть минимум 3 символа')
      .max(20, 'Длина имени должна быть максимум 20 символов'),
    email: yup
      .string()
      .required('Требуется адрес электронной почты')
      .email('Неправильный формат адреса электронной почты'),
    password: yup
      .string()
      .test({
        test: (value) => {
          return !(value !== '' && value.length < 6);
        },
        message: 'Длина пароля должна быть минимум 6 символов',
      })
      .test({
        test: (value) => {
          return !(value !== '' && value.length > 40);
        },
        message: 'Длина пароля должна быть максимум 40 символов',
      }),
    confirmPassword: yup
      .string()
      .required('Требуется подтверждение пароля')
      .min(6, 'Длина пароля должна быть минимум 6 символов')
      .max(40, 'Длина пароля должна быть максимум 40 символов')
      .oneOf([yup.ref('password')], 'Повторное значение пароля не совпадает с первоначальным'),
    image: yup.string().url('Неправильный формат URL'),
    agree: yup.bool().oneOf(
      [true],
      <>
        <br />
        Вы не разрешили обработку персональных данных
      </>
    ),
  };

  if (type !== 'profile') {
    fields.password = fields.password.required('Требуется пароль');
  }

  if (type === 'signin') {
    delete fields.username;
    delete fields.confirmPassword;
    delete fields.image;
    delete fields.agree;
  } else if (type === 'signup') {
    delete fields.image;
  } else {
    delete fields.confirmPassword;
    delete fields.agree;
  }

  const validationForm = yup.object().shape(fields);

  const {
    register,
    formState: { errors },
    setValue,
    getValues,
    handleSubmit,
    setError,
    clearErrors,
  } = useForm({ resolver: yupResolver(validationForm) });

  const onSubmit = (data) => {
    let query = 'users/login';
    let method = 'POST';

    const headers = {
      'Content-Type': 'application/json;charset=utf-8',
    };

    if (type !== 'signin') {
      if (type === 'signup') {
        query = 'users';
      } else {
        query = 'user';
        method = 'PUT';
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    dispatch(setMessage({ message: '', flag: '' }));

    if (type === 'profile') {
      data['token'] = token;
      if (data.password === '') {
        delete data.password;
      }
    }

    dispatch(
      fetchQuery({
        query: query,
        typeQuery: type,
        options: {
          method: method,
          headers: headers,
          body: JSON.stringify({ user: data }),
        },
      })
    );
  };

  return (
    <div className={classNames(styles['page'], { 'display-none': loaderShow })}>
      <h1 className={styles.title}>{types[type].title}</h1>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {type !== 'signin' && (
          <label className={classNames({ [styles['value-error']]: errors.username?.message })}>
            Username
            <input
              id="username"
              type="text"
              placeholder="Username"
              tabIndex="1"
              defaultValue={getValues('username') || ''}
              {...register('username')}
            />
            <span>{errors.username?.message}</span>
          </label>
        )}

        <label className={classNames({ [styles['value-error']]: errors.email?.message })}>
          Email address
          <input
            id="email"
            type="email"
            placeholder="Email address"
            tabIndex="2"
            defaultValue={getValues('email') || ''}
            onChange={() => {}}
            {...register('email')}
          />
          <span>{errors.email?.message}</span>
        </label>

        <label className={classNames({ [styles['value-error']]: errors.password?.message })}>
          {types[type].pass}
          <input
            id="password"
            type="password"
            placeholder="Password"
            tabIndex="3"
            defaultValue={getValues('password') || ''}
            {...register('password')}
          />
          <span>{errors.password?.message}</span>
        </label>
        {type === 'signup' && (
          <label className={classNames({ [styles['value-error']]: errors.confirmPassword?.message })}>
            Repeat password
            <input
              id="confirmPassword"
              type="password"
              placeholder="Repeat password"
              tabIndex="4"
              defaultValue={getValues('confirmPassword') || ''}
              {...register('confirmPassword')}
            />
            <span>{errors.confirmPassword?.message}</span>
          </label>
        )}
        {type === 'profile' && (
          <label className={classNames({ [styles['value-error']]: errors.image?.message })}>
            Avatar image (url)
            <input
              id="image"
              type="url"
              placeholder="Avatar image"
              tabIndex="5"
              defaultValue={getValues('image') || ''}
              {...register('image')}
            />
            <span>{errors.image?.message}</span>
          </label>
        )}
        {type === 'signup' && (
          <>
            <hr />
            <input id="agree" type="checkbox" tabIndex="6" {...register('agree')} />
            <label
              htmlFor="agree"
              className={classNames(styles.checkbox, { [styles['value-error']]: errors.agree?.message })}
            >
              I agree to the processing of my personal information
              <span>{errors.agree?.message}</span>
            </label>
          </>
        )}
        <button
          className="button button-form button-form_bg_blue button-form__send button-form__send_width"
          tabIndex="7"
          onClick={() => {
            dispatch(setErrorsServer({ errorsServer: {} }));
          }}
        >
          {types[type].button}
        </button>
        <div className={styles.signin}>
          <span>{types[type].link}</span>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
