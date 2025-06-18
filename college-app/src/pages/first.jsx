import React from 'react';
import { useNavigate } from 'react-router-dom';

const MenuBar = () => {

    const navigate = useNavigate()
    const goToLogin = () => {
        navigate('/login');
    };
    
    return (
        <div>
            <button className="button" onClick={goToLogin}>
            Sign In
            </button>
        </div>
    );
};

export function First() {
    return (
        <MenuBar />
    )
}
