import React, {useState, useEffect, useRef} from 'react';
import {FaSearch} from 'react-icons/fa'
import './mycolleges.css'
import {useNavigate} from 'react-router-dom'
import Dropdown from './MyCollegeComponents/Dropdown'

const ProfileButton = () => {
    const navigate = useNavigate()
    const goToMyProfile = () => {
      navigate('/profile')
    }
  
    return (
      <button className="button" onClick={goToMyProfile}>
      My Profile
      </button>
    )
  }

const SearchBar = ({ setResults, setSelectedCollege }) => {
    const [input, setInput] = useState('');
    const fetchData = async (value) => {
        setResults([]);
        if (!value.trim()) {
            setResults([]);
            return;
        }
            const response = await fetch(`http://localhost:3000/api/search?q=${encodeURIComponent(value)}`);
            const json = await response.json();
            setResults(json);
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

  const [collegeList, setCollegeList] = useState([])
  const [results, setResults] = useState([])
  const [selectedCollege, setSelectedCollege] = useState(null)


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
    console.log("Selected college:", college) //college printed in console
    setSelectedCollege(college)
    setResults([]) //clear search results list
  }

  const addCollegeToList = () => {
    if (selectedCollege) {
      const isAlreadyAdded = collegeList.some(
        (college) => college._id === selectedCollege._id
      )

      if (isAlreadyAdded) {
        alert(`${selectedCollege.collegeName} is already in your list.`)
        return
      }
      setCollegeList((prevList) => [...prevList, selectedCollege])
      setSelectedCollege(null); //clears info box

    } 
    else {
      alert("Please select a college from the search results first!");
    }
  }

  const deleteCollegeFromList = (collegeId) => {
    setCollegeList((prevList) => prevList.filter((college) => college._id !== collegeId));
    setSelectedCollege(null);
  }

  return (
    <div>
      <div>
        <h2>Search for Colleges</h2>
        <div className='searchBarContainer'>
            <SearchBar setResults={setResults}/>
            <SearchResultsList
                    results={results}
                    onSelectCollege={onSelectCollege}/>
        </div>
        {selectedCollege && (
            <div className='selected-college-details'>
                <h3>{selectedCollege.collegeName} Information </h3>
                <p>Homepage: {selectedCollege.homepage}</p>
                <p>Acceptance Rate: {selectedCollege.acceptanceRate}</p>
                    <table className='standardized-testing-table'>
                        <thead>
                        <tr>
                            <th>Standardized Test</th>
                            <th>25 Percentile</th>
                            <th>50 Percentile</th>
                            <th>75 Percentile</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>SAT Math</td>
                            <td>{selectedCollege.satScores.reading25}</td>
                            <td>{selectedCollege.satScores.reading50}</td>
                            <td>{selectedCollege.satScores.reading75}</td>
                        </tr>
                        <tr>
                            <td>SAT English</td>
                            <td>{selectedCollege.satScores.math25}</td>
                            <td>{selectedCollege.satScores.math50}</td>
                            <td>{selectedCollege.satScores.math75}</td>
                        </tr>
                        <tr>
                            <td>ACT</td>
                            <td>{selectedCollege.actScores.composite25}</td>
                            <td>{selectedCollege.actScores.composite50}</td>
                            <td>{selectedCollege.actScores.composite75}</td>
                        </tr>
                        </tbody>
                    </table>
                <button className='addButton' onClick={addCollegeToList}>Add College</button>
                <button className='addButton' >What are my chances?</button>
            </div>
        )}
        </div>

        <div>
            <h2>My College List</h2>
            <div>
          {collegeList.length > 0 ? (
            collegeList.map((college) => (
              <div key={college._id}>
                <p>{college.collegeName}</p>
                <button className='delete-button' onClick={() => deleteCollegeFromList(college._id)}>Delete</button>
                
                <div className={`dropdown-menu`}>
                  <Dropdown/>
                </div>

              </div>

            ))) : (
            <p>Search for colleges to add them to your list.</p>
          )}
        </div>
        <div>
          <ProfileButton/>
        </div>
        </div>
      <a href="#" onClick={signOut}>Sign out</a>
    </div>
  )
}