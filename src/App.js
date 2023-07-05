import './App.css';
import axios from 'axios';
import { useState } from 'react';
import { Collapse, Input, Button } from 'antd';
import { StarFilled } from '@ant-design/icons'
import styled from "styled-components";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import NotFound from './component/NotFound';

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
        }
      });
      setGithubUsers(response.data.items);
      setLoadingGithubUsers(false);
    } catch (error) {
      setLoadingGithubUsers(false);
      console.log(error);
    }
  };
    
  const getUserRepos = async ( name, id) => {
    const foundId = userReposList?.findIndex(repo => repo.id === id);
    if (foundId !== -1 && userReposList.length !== 0) {
      const updatedReposList = [...userReposList];
      updatedReposList[foundId].open = !updatedReposList[foundId].open;
      setUserReposList(updatedReposList);
    } else {
      try {
        const res = await axios.get(`https://api.github.com/users/${name}/repos`);
        const data = res.data.length !== 0 ? res.data : [{
          name: "Not Found",
          description: githubUsers[id].description,
          stargazers_count: githubUsers[id].stargazers_count,
        }];
        const updatedReposList = [...userReposList, { data, id, open: true }];
        setUserReposList(updatedReposList);
      } catch (err) {
        const data = [{
          name: err.code,
          description: err.message,
          stargazers_count: "error",
        }];
        const updatedReposList = [...userReposList, { data, id, open: true}];
        setUserReposList(updatedReposList);
      }
    }
  };

  const reposItems = githubUsers.map((repo, idx) => ({
    key: idx,
    label: repo.login,
    children: userReposList[idx]?.data ? (
      <ScrollableContainer key={idx}>
        {userReposList[idx]?.data.map(repo => {
          return repo.name === "Not Found" ? (
            <NotFound text={"Repositories"} />
          ) : (
            <RepoContainer key={repo.id}>
              <RepoHeader>
                <RepoName>{repo.name}</RepoName>
                <StarContainer>
                  <StarCount>{repo.stargazers_count}</StarCount>
                  <StarFilled />
                </StarContainer>
              </RepoHeader>
              <p>{repo.description}</p>
            </RepoContainer>
          );
        })}
      </ScrollableContainer>
    ) : (
      <Skeleton />
    )
  }));
  
  

  const onChange = (key: string | string[], name) => {
    setActiveKey(key);
    setShowTextSearch(key.length !== 0 ? '' : githubUsersSearchText);
    if(key.length > 0){
      getUserRepos(name[key[key.length-1]], +key[key.length-1])
    }
  };

  return (
    <div style={{
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px',
    }}>
      <form onSubmit={searchRepos}>
        <Input
          size="large"
          onChange={(e) => setGithubUsersSearchText(e.target.value)} 
          value={githubUsersSearchText} 
          placeholder="Enter username"
        />
      <SearchButton type="primary" htmlType="submit" size="large">Search</SearchButton>
      </form>
      <ShowingText show={showTextSearch}>Showing users for "{showTextSearch}"</ShowingText>
      {loadingGithubUsers ? <Skeleton count={showTextSearch.length <=10 ? 5: 1} height={50}/> : 
        reposItems.length !== 0? (
          <Collapse 
            items={reposItems} 
            activeKey={activeKey}
            onChange={(key, id) => onChange(key, reposItems.map(repo => repo.label))}
            expandIconPosition="right"
          />
        ): (
          <NotFound text={"Users"}/>
      )}
    </div>
  );
}

const ShowingText = styled.p`
  opacity: ${props => props.show ? 1 : 0};
  transition: opacity 0.1s ease-in-out;
`;

const SearchButton = styled(Button)`
  width: 100%;
  margin-top: 10px;
`;


// children styled component

const ScrollableContainer = styled.div`
  max-height: 400px;
  overflow-y: auto;
`;

const RepoContainer = styled.div`
  background: lightgray;
  padding: 15px;
  margin-left: 25px;
  margin-top: 15px;
  padding-top: 5px;
  height: 120px;
`;

const RepoHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: -20px;
`;

const RepoName = styled.h3`
`;

const StarContainer = styled.div`
  display: flex;
  align-items: center;
  font-weight: bold;
  gap: 3px;
`;

const StarCount = styled.p`
  margin-bottom: 16px;
`;

export default App;