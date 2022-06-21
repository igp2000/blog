import { createSlice } from '@reduxjs/toolkit';

import { fetchQuery, favoritQuery } from '../general/generalSlice';

const articlesSlice = createSlice({
  name: 'articles',
  initialState: {
    articles: [],
    articlesCount: 0,
    article: null,
    articleStored: false,
    articleDeleted: false,

    currentPage: 1,
  },
  reducers: {
    setCurrentPage(state, action) {
      state.currentPage = action.payload.page;
    },
    setArticle(state, action) {
      state.article = action.payload.article;
    },
    setArticleStored(state, action) {
      state.articleStored = action.payload.articleStored;
    },
    setArticleDeleted(state, action) {
      state.articleDeleted = action.payload.articleDeleted;
    },
  },
  extraReducers: {
    [fetchQuery.fulfilled]: (state, action) => {
      if (action.payload.typeQuery === 'articles') {
        state.articles = action.payload.articles;
        state.articlesCount = action.payload.articlesCount;
      } else if (action.payload.typeQuery === 'article' || action.payload.typeQuery === 'article-edit') {
        state.article = action.payload.article;
        state.articleStored = action.payload.typeQuery === 'article-edit';
      } else if (action.payload.typeQuery === 'article-delete') {
        state.article = null;
        state.articleStored = false;
        state.articleDeleted = true;
      }
    },
    [favoritQuery.fulfilled]: (state, action) => {
      if (action.payload.typeQuery === 'article-favorit-on' || action.payload.typeQuery === 'article-favorit-off') {
        if (action.payload.artIndex < 0) {
          state.article = action.payload.article;
        } else {
          state.articles[action.payload.artIndex] = action.payload.article;
        }
      }
    },
  },
});

export const { setCurrentPage, setArticle, setArticleStored, setArticleDeleted } = articlesSlice.actions;
export default articlesSlice.reducer;
