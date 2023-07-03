import './App.css';
import axios from 'axios';
import { useState } from 'react';

function Input(props) {
  return (
    <input type="text" onChange={props.onChange} value={props.value} />
  );
}

function App() {
  const [githubRepos, setGithubRepos] = useState([]);
  const [githubReposSearch, setGithubReposSearch] = useState('');
  const [showTextSearch, setShowTextSearch] = useState('');
  const [userReposList, setUserReposList] = useState([]);
  
  const searchRepos = (e) => {
    e.preventDefault();
    setShowTextSearch(githubReposSearch);
    axios.get(`https://api.github.com/search/repositories?q=${githubReposSearch}&page=1&per_page=10&sort=stars&order=desc`)
      .then(res => {
        setGithubRepos(res.data.items);
      })
      .catch(err => {
        console.log(err);
      });
  };
  
  const getUserRepos = (e, name, id) => {
    e.preventDefault();
    axios.get(`https://api.github.com/users/${name}/repos`)
      .then(res => {
        if (userReposList.length === 0) {
          setUserReposList([{ data: res.data, id }]);
        } else {
          const foundId = userReposList.findIndex(repo => repo.id === id);
          if (foundId !== -1) {
            setUserReposList([...userReposList, { data: res.data, id }]);
          }
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
  
  return (
    <div className="App">
      <form onSubmit={searchRepos}>
        <Input 
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
            <button onClick={(e) => getUserRepos(e, repo.name, idx)}>view repos</button>
            {userReposList.length > 0 && userReposList[idx] && userReposList[idx].data.map(repo => (
              <div key={repo.id} style={{ background: 'red' }}>
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