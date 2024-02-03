import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export default function CommDash() {
    const [isAdmin, setIsAdmin] = useState(false);
    const [electionData, setElectionData] = useState(null);
    const [isElectionStarted, setIsElectionStarted] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            if (decodedToken.isAdmin) {
                setIsAdmin(true);
            }
        }

        fetchElectionData();
        fetchElectionStatus(); 
    }, []);

    const fetchElectionData = () => {
        axios
            .get('http://localhost:5000/election/data')
            .then((response) => {
                setElectionData(response.data);
            })
            .catch((error) => console.error('Error fetching election data:', error));
    };

    const fetchElectionStatus = async () => {
        try {
            const response = await axios.get('http://localhost:5000/election/get-election-status');
            setIsElectionStarted(response.data.isElectionStarted);
        } catch (error) {
            console.error('Error fetching election status:', error);
        }
    };

    const handleStartStopElection = async () => {
      try {
          const newStatus = !isElectionStarted; 
          const response = await axios.post('http://localhost:5000/election/update-election-status', { newStatus });
          
          if (response.data.success) {
              setIsElectionStarted(newStatus); 
              localStorage.setItem('isElectionStarted', newStatus); 
          }
      } catch (error) {
          console.error('Error updating election status:', error);
      }
  };

    if (!isAdmin) {
        return <h2>Access Denied</h2>;
    }

    return (
        <div>
            <h2>Comm Dashboard</h2>
            <button onClick={handleStartStopElection}>
                {isElectionStarted ? 'Stop Election' : 'Start Election'}
            </button>
            {electionData && (
                <div>
                    {/* Display election data here */}
                </div>
            )}
        </div>
    );
}
