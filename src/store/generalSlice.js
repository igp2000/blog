import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

async function fetchData(query, options) {
  const resp = await fetch(`https://kata.academy:8021/api/${query}`, options);

  if (!resp.ok) {
    let errors = `\n${resp.statusText}`;
    if (resp.status === 422) {
      const err = await resp.json();
      throw new Error(JSON.stringify(err.errors));
    }
    throw new Error(`Error ${resp.status}${errors}`);
  }

  if (resp.status != 204) {
    return await resp.json();
  }
  return {};
}

export const fetchQuery = createAsyncThunk(
  'general/fetch',
  async function ({ query, typeQuery, options = {} }, { rejectWithValue }) {
    try {
      return fetchData(query, options).then((data) => {
        data['typeQuery'] = typeQuery;
        return data;
      });
    } catch (error) {
      rejectWithValue(error);
    }
  }
);

export const favoritQuery = createAsyncThunk(
  'favorit/fetch',
  async function ({ query, typeQuery, artIndex, options = {} }, { rejectWithValue }) {
    try {
      return fetchData(query, options).then((data) => {
        data['typeQuery'] = typeQuery;
        data['artIndex'] = artIndex;
        return data;
      });
    } catch (error) {
      rejectWithValue(error);
    }
  }
);

const generalSlice = createSlice({
  name: 'general',
  initialState: {
    loaderShow: false,
  },
  reducers: {},
  extraReducers: {
    [fetchQuery.pending]: (state) => {
      state.loaderShow = true;
    },
    [fetchQuery.fulfilled]: (state) => {
      state.loaderShow = false;
    },
    [fetchQuery.rejected]: (state) => {
      state.loaderShow = false;
    },
  },
});

export default generalSlice.reducer;
