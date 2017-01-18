import React, { Component } from 'react';
import { Grid, Cell, Snackbar } from 'react-mdl';
import Header, { Search } from './Header';
import { Link, hashHistory } from 'react-router';
import Cookie from 'react-cookie';

// import logo from '../logo.svg';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group' // ES6

import DataController from '../DataController';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = { loading: false, isSnackbarActive: false };

        this.fetchData = this.fetchData.bind(this);
        this.onLogout = this.onLogout.bind(this);
        this.handleTimeoutSnackbar = this.handleTimeoutSnackbar.bind(this);
    }

    componentDidMount() {
        if (Cookie.load('login_error')) {
            this.setState({ user: null, isSnackbarActive: true, snackbarText: 'There was an error when logging you in.' });
        }
        var access_token = Cookie.load('access_token');

        if (access_token) {
            var userOptions = {
                headers: { 'Authorization': 'Bearer ' + access_token }
            }

            fetch('https://api.spotify.com/v1/me', userOptions)
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    Cookie.save('user_id', data.id);
                    DataController.addUser(data.id);
                    this.setState({ user: data });
                });

        } else {
            // Default view before search, when not logged in
        }
    }

    fetchData(query) {
        Cookie.save('content_searched', true);
        hashHistory.push('search/' + query);
    }



    onLogout() {
        Cookie.remove('access_token');
        Cookie.remove('refresh_token');
        Cookie.remove('user_id');
        this.setState({ user: null, isSnackbarActive: true, snackbarText: 'You have been logged out.' });
        hashHistory.push('/');
    }

    handleTimeoutSnackbar() {
        this.setState({ isSnackbarActive: false });
    }

    render() {

        // var content = <Content track={this.state.track} recommendations={this.state.recommendations} storeCallback={this.storeTracks} />;

        var loader = [];
        if (this.state.loading) {
            loader = <div key="loader-container" className="loader-container">
                <div key="loader" className="loader"></div>
            </div>
        }

        var header = <Header searchCallback={this.fetchData} logoutCallback={this.onLogout} />
        if (this.state.user) {
            header = <Header user={this.state.user} searchCallback={this.fetchData} logoutCallback={this.onLogout} />;
        }

        return (
            <div className="App">
                <Snackbar
                    active={this.state.isSnackbarActive}
                    onTimeout={this.handleTimeoutSnackbar}
                    onClick={() => { this.handleTimeoutSnackbar() } }
                    action="Close">
                    {this.state.snackbarText}
                </Snackbar>

                <ReactCSSTransitionGroup
                    transitionName="fade"
                    transitionEnterTimeout={200}
                    transitionLeaveTimeout={200}>
                    {loader}
                </ReactCSSTransitionGroup>

                {header}
                <div className="content">
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default App;
