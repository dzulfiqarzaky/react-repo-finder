import React from 'react';
import { Input, Button } from 'antd';

const SearchForm = ({ onSubmit, value, onChange }) => {
  return (
    <form onSubmit={onSubmit}>
      <Input
        size="large"
        onChange={onChange}
        value={value}
        placeholder="Enter username"
      />
      <Button type="primary" htmlType="submit" size="large">
        Search
      </Button>
    </form>
  );
};

export default SearchForm;
