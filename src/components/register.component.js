import React, { Component } from 'react';
import axios from 'axios';


export default class Register extends Component {
    constructor(props) {
        super(props);

        this.onChangeVoterID = this.onChangeVoterID.bind(this);
        this.onChangeFullname = this.onChangeFullname.bind(this);
        this.onChangeDOB = this.onChangeDOB.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangeUVC = this.onChangeUVC.bind(this);
        this.onChangeConstituency = this.onChangeConstituency.bind(this);

        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            voter_id: '',
            full_name: '',
            DOB: '',
            password: '',
            UVC: '',
            constituency_id: '',
            constituencies: []
        }
    }

    componentDidMount() {
        axios.get('http://localhost:5000/constituencies')
            .then(res => {
                this.setState({ constituencies: res.data });
            })
            .catch(error => {
                console.error(error);
            });
    }

    onChangeVoterID(e) {
        this.setState({
            voter_id: e.target.value
        });
    }

    onChangeFullname(e) {
        this.setState({
            full_name: e.target.value
        });
    }
    onChangeDOB(e) {
        this.setState({
            DOB: e.target.value
        });
    }
    onChangePassword(e) {
        this.setState({
            password: e.target.value
        });
    }
    onChangeUVC(e) {
        this.setState({
            UVC: e.target.value
        });
    }
    onChangeConstituency(e) {
        this.setState({
            constituency_id: e.target.value
        });
    }

    onSubmit(e) {
        e.preventDefault();


        const voter = {
            voter_id: this.state.voter_id,
            full_name: this.state.full_name,
            DOB: this.state.DOB,
            password: this.state.password,
            UVC: this.state.UVC,
            constituency_id: parseInt(this.state.constituency_id)
        }

        console.log(voter);

        axios.post('http://localhost:5000/voters/newUser', voter)
        .then(res => {
            console.log(res.data);
        this.setState({ message:res.data });
        })
        .catch(error => {
            console.error(error);
        })

        this.setState({
            voter_id: '',
            full_name: '',
            DOB: '',
            password: '',
            UVC: '',
            constituency_id: ''
        })
    }

    render() {
        return (  
            <div>
                <h3>Register to Vote</h3>
                <form onSubmit={this.onSubmit}>

                <div className="form-group"> 
                        <label>Email: </label>
                        <input  type="email"
                            required
                            className="form-control"
                            value={this.state.voter_id}
                            onChange={this.onChangeVoterID}
                            />
                    </div>

                    <div className="form-group"> 
                        <label>FullName: </label>
                        <input  type="text"
                            required
                            className="form-control"
                            value={this.state.full_name}
                            onChange={this.onChangeFullname}
                            />
                    </div>

                    <div className="form-group"> 
                        <label>DOB: </label>
                        <input  type="date"
                            required
                            className="form-control"
                            value={this.state.DOB}
                            onChange={this.onChangeDOB}
                            />
                    </div>

                    <div className="form-group"> 
                        <label>Password: </label>
                        <input  type="password"
                            required
                            className="form-control"
                            value={this.state.password}
                            onChange={this.onChangePassword}
                            />
                    </div>

                    <div className="form-group"> 
                        <label>UVC: </label>
                        <input  type="text"
                            required
                            className="form-control"
                            value={this.state.UVC}
                            onChange={this.onChangeUVC}
                            />
                    </div>

                    <div className="form-group"> 
                        <label>Constituency: </label>
                        <select
                            required
                            className="form-control"
                            value={this.state.constituency_id}
                            onChange={this.onChangeConstituency}
                        >
                            <option value="">Select Constituency</option>
                            {this.state.constituencies.map((constituency) => (
                                <option key={constituency.constituency_id} value={constituency.constituency_id}>
                                    {constituency.constituency_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <input type="submit" value="Create User" className="btn btn-primary" />
                    </div>
                </form>
                {this.state.message && <div className={this.state.message.includes('successfully') ? 'alert alert-success' : 'alert alert-warning'}>{this.state.message}</div>}

            </div>
        );
    }
}