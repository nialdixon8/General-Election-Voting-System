import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post('http://localhost:5000/login', { email, password })
      .then((res) => {
        if (res.data.token) {
          localStorage.setItem('token', res.data.token); 
          if (res.data.isAdmin) {
            navigate("/commdash");
          }else {
            navigate("/dashboard");
          }
          
        } else {
          setMessage(res.data); 
        }
      })
      .catch((err) => {
        console.log(err);
        setMessage('Login failed. Please check your credentials.');
      });
  };
  

  return (
    <div>
      <h3>Login</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter Email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Enter Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="btn btn-primary">Login</button>
      </form>
      {message && (
        <div className={message.includes('successfully') ? 'alert alert-success' : 'alert alert-warning'}>
          {message}
        </div>
      )}
    </div>
  );
}

export default Login;
