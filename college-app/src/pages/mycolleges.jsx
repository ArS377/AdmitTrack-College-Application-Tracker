import React, {useState} from 'react';
import {FaSearch} from 'react-icons/fa'
import './mycolleges.css'

const SearchBar = ({setResults}) => {
    const [input, setInput] = useState('')
    const fetchData = (value) => {
        fetch('https://jsonplaceholder.typicode.com/users')
        .then((response) => response.json())
        .then((json) => {
        const results = json.filter((user) => {
            return value && user && user.name && user.name.toLowerCase().includes(value)
            })
        setResults(results)
        })
    }

    const handleChange = (value) => {
        setInput(value)
        fetchData(value)
    }

    return (
        <div className='input-wrapper'>
            <FaSearch id = 'search-icon'/>
            <input placeholder='Search for colleges'
            value={input}
            onChange={(e) => handleChange(e.target.value)}
            />
        </div>
    )
}

const SearchResultsList = ({results}) => {
    return(
        <div className='results-list'>
            {
                results.map((result, id) => {
                    return <SearchResult result={result} key={id}/>
                })
            }
        </div>
    )
}

const SearchResult = ({result}) => {
    return (
        <div className='search-result' onClick={(e) => alert('Code a place to display college info here')}>
            {result.name}
        </div>
    )
}

export function MyColleges() {
  const signOut = () => {
    if (window.gapi && window.gapi.auth2) {
      var auth2 = window.gapi.auth2.getAuthInstance();
      auth2.signOut().then(function () {
        console.log('User signed out.');
      }).catch(error => {
        console.error("Error signing out:", error);
      })
    } else {
      console.warn("Google API client library (gapi) not loaded or initialized. Cannot sign out.");
    }
  }

  const [results, setResults] = useState([])

  return (
    <div>
      <div>
        <h2>Your Colleges</h2>
        <div className='searchBarContainer'>
            <SearchBar setResults={setResults}/>
            <SearchResultsList results={results}/>
        </div>
      </div>
      <a href="#" onClick={signOut}>Sign out</a>
    </div>
  )
}