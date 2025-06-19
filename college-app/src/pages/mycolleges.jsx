import React, {useState} from 'react';
import {FaSearch} from 'react-icons/fa'
import './mycolleges.css'

const SearchBar = ({ setResults, setSelectedCollege }) => { // <--- Note the new prop setSelectedCollege
    const [input, setInput] = useState('');
    const fetchData = async (value) => {
        setResults([]); // Clear search results immediately
        if (!value.trim()) { // If input is empty, clear results and don't fetch
            setResults([]);
            return;
        }
            const response = await fetch(`http://localhost:3000/api/search?q=${encodeURIComponent(value)}`);
            const json = await response.json(); // Parse the JSON response
            setResults(json); // Update searchResults state in MyColleges
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

const SearchResultsList = ({results, onSelectCollege}) => {
    return(
        <div className='results-list'>
            {
                results.map((result) => {
                    return <SearchResult result={result} key={result._id} onSelect={onSelectCollege}/>
                })
            }
        </div>
    )
}

const SearchResult = ({result, onSelect}) => {
    return (
        <div className='search-result' onClick={() => onSelect(result)}>
            {result.collegeName}
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

  const onSelectCollege = (college) => {
    console.log("Selected college:", college) // Good for debugging: see what college object was passed

    setSelectedCollege(college) // Set the state to the college object that was clicked
    setResults([]) // Clear the search results list so it disappears
  }

  const [results, setResults] = useState([])
  const [selectedCollege, setSelectedCollege] = useState(null);

  return (
    <div>
      <div>
        <h2>Your Colleges</h2>
        <div className='searchBarContainer'>
            <SearchBar setResults={setResults}/>
            <SearchResultsList
                    results={results}
                    onSelectCollege={onSelectCollege}/>
        </div>
        {selectedCollege && (
            <div className='selected-college-details'>
                <h2>{selectedCollege.collegeName} Information </h2>
                <p>Homepage: {selectedCollege.homepage}</p>
                <p>Acceptance Rate: {selectedCollege.acceptanceRate}</p>
            </div>
        )}
      </div>
      <a href="#" onClick={signOut}>Sign out</a>
    </div>
  )
}