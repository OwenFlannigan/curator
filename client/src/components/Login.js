import React, { Component } from 'react';
import { Grid, Cell } from 'react-mdl';
import Cookie from 'react-cookie';
import { hashHistory } from 'react-router';

class Login extends React.Component {
    render() {
        return (
            <Grid>
                <Cell col={6}>
                    <h3>Login</h3>
                </Cell>

                <Cell col={6}>
                    <h3>Link to Spotify</h3>
                    <a href="http://localhost:3001/login">Login</a>
                </Cell>
            </Grid>
        );
    }
}

class Manager extends React.Component {
    componentDidMount() {
        if (this.props.params.tokens) {
            var accessToken = this.props.params.tokens.split('&')[0].split('=')[1];
            var refreshToken = this.props.params.tokens.split('&')[1].split('=')[1];
            Cookie.save('access_token', accessToken, { maxAge: 3600 });
            Cookie.save('refresh_token', refreshToken);
            Cookie.remove('login_error');
        } else if (this.props.params.error) {
            console.log(this.props.params.error);
            Cookie.save('login_error', this.props.params.error);
        }
        hashHistory.push('/');
    }

    render() {
        return (
            <Grid>
                <Cell col={10}>
                    <h3>Login successful!</h3>
                </Cell>
            </Grid>
        );
    }
}


export { Manager };
export default Login;