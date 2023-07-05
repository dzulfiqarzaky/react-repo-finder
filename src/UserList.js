import React from 'react';
import { Collapse } from 'antd';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import NotFound from './NotFound';

const UserList = ({
  users,
  loading,
  activeKey,
  reposItems,
  onChange,
  showTextSearch,
}) => {
  return (
    <>
      {loading ? (
        <Skeleton count={showTextSearch.length <= 10 ? 5 : 1} height={50} />
      ) : reposItems.length !== 0 ? (
        <Collapse
          items={reposItems}
          activeKey={activeKey}
          onChange={onChange}
          expandIconPosition="right"
        />
      ) : (
        <NotFound text="Users" />
      )}
    </>
  );
};

export default UserList;
