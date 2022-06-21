import React from 'react';
import { useSelector } from 'react-redux';
import { Pagination } from 'antd';

import { selCurrentPage, selArticlesCount } from '../../store/articles/selectors';

import 'antd/lib/pagination/style/index.css';
import './Pagination.scss';

const Paginator = ({ currentPageChange }) => {
  const currentPage = useSelector(selCurrentPage);
  const articlesCount = useSelector(selArticlesCount);

  return (
    <div className="pagination">
      <Pagination
        onChange={currentPageChange}
        size="small"
        total={articlesCount}
        defaultCurrent={currentPage}
        current={currentPage}
        pageSize={20}
        showSizeChanger={false}
      />
    </div>
  );
};

export default Paginator;
