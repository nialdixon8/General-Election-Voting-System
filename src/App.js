import React from "react";
import { BrowserRouter as Router, Route, Routes, Switch } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Navbar from "./components/navbar.component";
import Register from "./components/register.component";

import VoterDash from "./components/voterdash.component";
import CommDash from "./components/commdash.component";
import Login from "./components/login.component";

function App() {
  return (

          <Router>
      <div className="container">
        <Navbar/>
        <br />
        <Routes>
          <Route path="/dashboard" element={<VoterDash/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/commdash" element={<CommDash/>} />
        </Routes>
      </div>

    </Router>


  );
}

export default App;
