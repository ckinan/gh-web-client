import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from './AppContext.js';
import { useHistory, useParams } from 'react-router-dom';
import PullRequestBoxRow from './PullRequestBoxRow';

const SearchForm = () => {
  const [user, setUser] = useState('');
  const [searchType, setSearchType] = useState('author');
  const { dispatch } = useContext(AppContext);
  const history = useHistory();
  const { userParam } = useParams();

  const handleChange = (e) => {
    setUser(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    history.push(`/${user}`);
  };

  const fetchPullRequests = async (user) => {
    dispatch({ type: 'START_LOADING' });
    let prComponents = [];

    if (user) {
      let prs = await fetch(
        `/.netlify/functions/gh-fetch-pull-requests?user=${user}&searchType=${searchType}`
      ).then(function (response) {
        return response.json();
      });

      for (const pr of prs) {
        prComponents.push(<PullRequestBoxRow pr={pr} key={pr.id} />);
      }

      dispatch({
        type: 'UPDATE_PRS',
        prs: prs,
      });
    }

    dispatch({
      type: 'UPDATE_PR_COMPONENTS',
      prComponents: prComponents,
    });
    dispatch({ type: 'STOP_LOADING' });
  };

  useEffect(() => {
    document.title = `${userParam ? userParam : ''} PRs`;
    fetchPullRequests(userParam);
    setUser(userParam);
  }, [userParam, searchType]);

  const handleSearchType = (e, searchType) => {
    e.preventDefault();
    setSearchType(searchType);
  };

  return (
    <div className="d-md-inline-block mb-3">
      <div className="d-inline">
        <button
          className={`btn BtnGroup-item btn-outline ${
            searchType === 'author'
              ? 'bg-blue text-white'
              : 'bg-gray-light text-gray-dark'
          } `}
          type="button"
          onClick={(e) => handleSearchType(e, 'author')}
        >
          Created
        </button>
        <button
          className={`btn BtnGroup-item btn-outline ${
            searchType === 'involves'
              ? 'bg-blue text-white'
              : 'bg-gray-light text-gray-dark'
          } `}
          type="button"
          onClick={(e) => handleSearchType(e, 'involves')}
        >
          Involves
        </button>
        <button
          className={`btn BtnGroup-item btn-outline ${
            searchType === 'review-requested'
              ? 'bg-blue text-white'
              : 'bg-gray-light text-gray-dark'
          } `}
          type="button"
          onClick={(e) => handleSearchType(e, 'review-requested')}
        >
          Review requests
        </button>
      </div>

      <form className="d-inline ml-3" onSubmit={(e) => handleSubmit(e)}>
        <input
          className="form-control"
          type="text"
          placeholder="User"
          value={user}
          onChange={(e) => handleChange(e)}
        />
      </form>
    </div>
  );
};

export default SearchForm;
