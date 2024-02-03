import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Navbar extends Component {
    render() {
        return (
            <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
                <Link to="/dashboard" className="navbar-brand">GEVS</Link>
                <div className="collpase navbar-collapse">
                <ul className="navbar-nav mr-auto">

                    <li className="navbar-item">
                    <Link to="/register" className="nav-link">Register</Link>
                    </li>
                    <li className="navbar-item">
                    <Link to="/login" className="nav-link">Login</Link>
                    </li>
                    <li className="navbar-item">
                    <Link to="/API" className="nav-link">API</Link>
                    </li>

                </ul>
                </div>
            </nav>
        );
    }
}