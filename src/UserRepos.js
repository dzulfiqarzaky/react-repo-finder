import React from 'react';
import { StarFilled } from '@ant-design/icons';
import styled from 'styled-components';
import NotFound from './NotFound';

const UserRepos = ({ reposList }) => {
  return (
    <ScrollableContainer>
      {reposList.map((repo) => {
        return repo.name === 'Not Found' ? (
          <NotFound text="Repositories" key={repo.id} />
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
  );
};

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

const RepoName = styled.h3``;

const StarContainer = styled.div`
  display: flex;
  align-items: center;
  font-weight: bold;
  gap: 3px;
`;

const StarCount = styled.p`
  margin-bottom: 16px;
`;

const ScrollableContainer = styled.div`
  max-height: 400px;
  overflow-y: auto;
`;

export default UserRepos;
