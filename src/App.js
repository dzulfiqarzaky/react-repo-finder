import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import SearchForm from './SearchForm';
import UserList from './UserList';
import UserRepos from './UserRepos';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'

function App() {
  const [githubUsers, setGithubUsers] = useState([]);
  const [loadingGithubUsers, setLoadingGithubUsers] = useState(false);
  const [githubUsersSearchText, setGithubUsersSearchText] = useState('');
  const [showTextSearch, setShowTextSearch] = useState('');
  const [userReposList, setUserReposList] = useState([]);
  const [activeKey, setActiveKey] = useState(null);

  const searchRepos = async (e) => {
    e.preventDefault();
    setShowTextSearch(githubUsersSearchText);
    setUserReposList([]);
    setActiveKey(null);
    try {
      setLoadingGithubUsers(true);
      const response = await axios.get(`https://api.github.com/search/users`, {
        params: {
          q: githubUsersSearchText,
          page: 1,
          per_page: 5,
          sort: 'stars',
          order: 'desc',
        },
      });
      setGithubUsers(response.data.items);
      setLoadingGithubUsers(false);
    } catch (error) {
      setLoadingGithubUsers(false);
      console.log(error);
    }
  };

  const getUserRepos = async (name, id) => {
    const foundId = userReposList?.findIndex((repo) => repo.id === id);
    if (foundId !== -1 && userReposList.length !== 0) {
      const updatedReposList = [...userReposList];
      updatedReposList[foundId].open = !updatedReposList[foundId].open;
      setUserReposList(updatedReposList);
    } else {
      try {
        const res = await axios.get(`https://api.github.com/users/${name}/repos`);
        const data = res.data.length !== 0 ? res.data : [
          {
            name: 'Not Found',
            description: githubUsers[id].description,
            stargazers_count: githubUsers[id].stargazers_count,
          },
        ];
        const updatedReposList = [...userReposList, { data, id, open: true }];
        setUserReposList(updatedReposList);
      } catch (err) {
        const data = [
          {
            name: err.code,
            description: err.message,
            stargazers_count: 'error',
          },
        ];
        const updatedReposList = [...userReposList, { data, id, open: true }];
        setUserReposList(updatedReposList);
      }
    }
  };

  const reposItems = githubUsers.map((repo, idx) => ({
    key: idx,
    label: repo.login,
    children: userReposList[idx]?.data ? (
      <UserRepos reposList={userReposList[idx]?.data} />
    ) : (
      <Skeleton />
    ),
  }));

  const onChange = (key, name) => {
    setActiveKey(key);
    setShowTextSearch(key.length !== 0 ? '' : githubUsersSearchText);
    if (key.length > 0) {
      getUserRepos(name[key[key.length - 1]], +key[key.length - 1]);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <SearchForm
        onSubmit={searchRepos}
        value={githubUsersSearchText}
        onChange={(e) => setGithubUsersSearchText(e.target.value)}
      />
      <ShowingText show={showTextSearch}>
        Showing users for "{showTextSearch}"
      </ShowingText>
      <UserList
        users={githubUsers}
        loading={loadingGithubUsers}
        activeKey={activeKey}
        reposItems={reposItems}
        onChange={(key, id) => onChange(key, reposItems.map(repo => repo.label))}
        showTextSearch={showTextSearch}
      />
    </div>
  );
}

const ShowingText = styled.p`
  opacity: ${(props) => (props.show ? 1 : 0)};
  transition: opacity 0.1s ease-in-out;
`;

export default App;
