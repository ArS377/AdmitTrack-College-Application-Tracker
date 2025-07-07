import React, { useState, useEffect } from 'react'; // <-- Keep useEffect
import './profile.css';
import { getUser } from '../User.jsx';
import {useNavigate} from 'react-router-dom'

const ReturnButton = () => {
    const navigate = useNavigate()
    const goToMyHome = () => {
      navigate('/home')
    }
    return (
      <button className="button" onClick={goToMyHome}>
      Cancel
      </button>
    )
  }

export function Profile() {
    const [currentUser, setCurrentUser] = useState(getUser());
    useEffect(() => {
        const intervalId = setInterval(() => {
            const latestUser = getUser();
            if (latestUser?.email !== currentUser?.email || latestUser?.name !== currentUser?.name) {
                setCurrentUser(latestUser);
            }
        }, 500); // Check every 500ms

        return () => clearInterval(intervalId); // Cleanup
    }, [currentUser]); // Depend on currentUser to trigger re-check when it changes

    const [firstMajor, setFirstMajor] = useState('');
    const [secondMajor, setSecondMajor] = useState('');
    const [satEnglish, setSatEnglish] = useState('');
    const [satMath, setSatMath] = useState('');
    const [act, setAct] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userToSubmit = getUser();
        const userEmail = userToSubmit?.email
        const userName = userToSubmit?.email

        if (!userEmail) {
            alert("User email not found. Please log in again.");
            console.error("User email is undefined. Cannot submit profile data.");
            return;
        }

        const profileUpdateData = {
            name: userName,
            email: userEmail,
            firstMajor,
            secondMajor,
            satEnglish,
            satMath,
            act,
        };

        try {
            const response = await fetch('http://localhost:3000/api/profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(profileUpdateData),
            });
            console.log(response)
            if (response.ok) {
                const data = await response.json();
                console.log('Profile data updated successfully:', data);
                alert('Your academic profile has been successfully updated!');
                setFirstMajor('');
                setSecondMajor('');
                setSatEnglish('');
                setSatMath('');
                setAct('');
            } else {
                const errorData = await response.json();
                console.error('Failed to update profile:', errorData);
                alert(`Failed to update profile: ${errorData.message || 'Please try again.'}`);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('An error occurred while submitting. Please check your network connection.');
        }
    };

    return (
        <div>
            <h2>Your Profile</h2>
            <div>
                <form onSubmit={handleSubmit} className='update'>

                    <h3 className="label">Enter your primary choice of major.</h3>
                    <div className="custom-field one">
                        <input
                            type='text'
                            value={firstMajor}
                            onChange={(e) => setFirstMajor(e.target.value)}
                            placeholder="e.g., Computer Science"
                        />
                    </div>

                    <h3 className="label">Enter your secondary choice of major.</h3>
                    <div className="custom-field one">
                        <input
                            type='text'
                            value={secondMajor}
                            onChange={(e) => setSecondMajor(e.target.value)}
                            placeholder="e.g., Math"
                        />
                    </div>

                    <h3 className="label">Enter your SAT English Score (If Applicable).</h3>
                    <div className="custom-field one">
                        <input
                            type='text'
                            value={satEnglish}
                            onChange={(e) => setSatEnglish(e.target.value)}
                            placeholder="e.g., 750"
                        />
                    </div>

                    <h3 className="label">Enter your SAT Math Score (If Applicable).</h3>
                    <div className="custom-field one">
                        <input
                            type='text'
                            value={satMath}
                            onChange={(e) => setSatMath(e.target.value)}
                            placeholder="e.g., 800"
                        />
                    </div>

                    <h3 className="label">Enter your ACT Composite Score (If Applicable).</h3>
                    <div className="custom-field one">
                        <input
                            type='text'
                            value={act}
                            onChange={(e) => setAct(e.target.value)}
                            placeholder="e.g., 36"
                        />
                    </div>
                    <input type='submit' className='button' value='Update Profile' />
                    <ReturnButton/>
                </form>
            </div>
        </div>
    );
}