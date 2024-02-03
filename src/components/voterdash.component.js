import React, { useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';

export default function VoterDash() {
    const [userData, setUserData] = useState(null);
    const [isElectionStarted, setIsElectionStarted] = useState(false);
    const token = localStorage.getItem('token');
    
    const decodedToken = token ? jwtDecode(token) : null;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:5000/voters/dashboard', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    setUserData(data);
                } else {
                    console.error('Server responded with non-OK status:', response.status);
                }
            } catch (error) {
                console.error('Fetching data failed:', error);
            }
        };

        fetchData();

        axios.get("http://localhost:5000/election/get-election-status")
        .then(response => {
            setIsElectionStarted(response.data.isElectionStarted);
        })
        .catch(error => {
            console.error('Error fetching election status:', error);
        });

    }, []);

    const handleVote = (party) => {
        console.log(`Vote for: ${party}`);
        if (isElectionStarted) {
          } else {
            console.log('Election is not started.');
          }
    };

    const handleSignOut = () => {
        localStorage.removeItem('token');

        window.location.href = '/login';
    };

    return (
        <div>
            {userData ? (
                <>
                    <h3>Welcome, {decodedToken.userId}</h3>
                    {isElectionStarted  ? (
                                            <div>
                                            <button onClick={() => handleVote('Red Party')} className="btn btn-danger">Red Party</button>
                                            <button onClick={() => handleVote('Blue Party')} className="btn btn-primary">Blue Party</button>
                                            <button onClick={() => handleVote('Yellow Party')} className="btn btn-warning">Yellow Party</button>
                                            <button onClick={() => handleVote('Independent')} className="btn btn-secondary">Independent</button>
                                        </div>
                    ) : (
                        <p>Elections have not started yet.</p>
                    )
                    }
                    <button onClick={handleSignOut} className="btn btn-danger">Sign Out</button>
                </>
            ) : (
                <p>Please Log In First</p>
            )}
        </div>
    );
}
