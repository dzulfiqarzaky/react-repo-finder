import './App.css';
import axios from 'axios';
import { useState } from 'react';

function App() {
  const [githubRepos, setGithubRepos] = useState([]);
  const [githubReposSearch, setGithubReposSearch] = useState('');
  const [showTextSearch, setShowTextSearch] = useState('');
  const [userReposList, setUserReposList] = useState([]);
  
const searchRepos = async (e) => {
  e.preventDefault();
  setShowTextSearch(githubReposSearch);
  setUserReposList([]);
  try {
    const response = await axios.get(`https://api.github.com/search/repositories`, {
      params: {
        q: githubReposSearch,
        page: 1,
        per_page: 10,
        sort: 'stars',
        order: 'desc'
      }
    });
    setGithubRepos(response.data.items);
  } catch (error) {
    console.log(error);
  }
};
  
const getUserRepos = async (e, name, id) => {
  e.preventDefault();
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
        description: "No Repos Found",
        stargazers_count: "no repos"
      }];
      const color = res.data.length !== 0 ? "green" : "yellow";
      const updatedReposList = [...userReposList, { data, id, open: true, color }];
      setUserReposList(updatedReposList);
    } catch (err) {
      const data = [{
        name: err.code,
        description: err.message,
        stargazers_count: "error"
      }];
      const updatedReposList = [...userReposList, { data, id, open: true, color: "red" }];
      setUserReposList(updatedReposList);
    }
  }
};

  return (
    <div className="App">
      <form onSubmit={searchRepos}>
        <input
          type="text" 
          onChange={(e) => setGithubReposSearch(e.target.value)} 
          value={githubReposSearch} 
        />
        <button type="submit">Search</button>
      </form>
      {showTextSearch && <p>showing users for "{showTextSearch}"</p>}
      <div className="App-body">
        {githubRepos.map((repo, idx) => (
          <div key={repo.id}>
            <h3>{repo.name}</h3>
            <button onClick={(e) => {
              getUserRepos(e, repo.name, idx)
            }}>view repos</button>
          {userReposList.length > 0 && userReposList?.filter(repo => repo.id === idx && repo.open)[0]?.data.map(repo => (
              <div key={repo.id} style={{ background: userReposList[idx].color }}>
                <h3>{repo.name}</h3>
                <p>{repo.description}</p>
                <p>stars: {repo.stargazers_count}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;