import React, { Component } from 'react';
import { Grid, Cell, Textfield, Button, Snackbar } from 'react-mdl';
import Cookie from 'react-cookie';
import { hashHistory, Link } from 'react-router';
import firebase from 'firebase';

class Login extends React.Component {

    render() {
        var children = this.props.children;
        if (Cookie.load('user')) {
            children = <div>
                <h3>Hello, {Cookie.load('user')}.</h3>
                <p>Consider linking your account with Spotify for added funcationality!</p>
            </div>;
        }
        return (
            <Grid>
                <Cell col={6} className="loginForm">
                    <div className="container">
                        {children}
                    </div>
                </Cell>

                <Cell col={6}>
                    <div className="container">
                        <h3>Link to Spotify</h3>
                        <a href="http://localhost:3001/login">Login</a>
                    </div>
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

class CurateLogin extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            'email': undefined,
            'password': undefined,
            failed: false,
            error: ''
        };

        this.handleChanges = this.handleChanges.bind(this);
        this.validate = this.validate.bind(this);
        this.handleShowSnackbar = this.handleShowSnackbar.bind(this);
        this.handleTimeoutSnackbar = this.handleTimeoutSnackbar.bind(this);
    }

    // Shows the Snackbar alert
    handleShowSnackbar() {
        this.setState({ failed: true });
    }

    // Hides the Snackbar alert after it times out
    handleTimeoutSnackbar() {
        this.setState({ failed: false });
    }

    // Disable the submit button, initially
    componentDidMount() {
        document.querySelector('#submit_button').disabled = true;
    }

    // Unregister our firebase event listener when the component unmounts,
    // so that we aren't trying to setState on nothing
    // pre: an event listener is attached
    componentWillUnmount() {
        if (this.unregister) {
            this.unregister();
        }
    }

    // Updates our component with the input data from the sign in form
    // pre: must have an event from a textfield 
    handleChanges(event) {
        var field = event.target.name;
        var value = event.target.value;

        var changes = {};
        changes[field] = value;

        this.validate();
        this.setState(changes);
    }

    // Validates the form to ensure correct input from the user.
    // If valid, the submit button will become after, otherwise,
    // the user is prompted to adjust the form.
    // pre: something was inputted into the form
    validate() {
        var elems = document.querySelectorAll('.container input');
        var validElems = {};
        elems.forEach(function (elem) {
            if (elem.checkValidity() && elem.value.length > 0) {
                validElems[elem.name] = 1;
            } else {
                validElems[elem.name] = 0;
            }
        });
        validElems = Object.keys(validElems).reduce(function (total, key) {
            return total + validElems[key];
        }, 0);
        if (validElems === elems.length) {
            document.querySelector('#submit_button').disabled = false;
        } else {
            document.querySelector('#submit_button').disabled = true;
        }
    }

    // Sign the user in using the component's saved input data. If invalid,
    // prompt user with an error.
    // pre: user has input some data
    signIn() {
        this.setState({ loading: true });
        this.unregister = firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
            .then((firebaseUser) => {
                Cookie.save('user', firebaseUser.displayName);
                this.setState({ loading: false });
            }).catch((err) => {
                console.log(err);
                document.querySelector('#password_text').value = '';
                this.setState({ failed: true, loading: false, error: err.message });
            });
    }

    // render the sign in form
    render() {

        return (
            <Grid noSpacing>
                <h3>Login</h3>
                <Cell col={11}>
                    <form id="join_form">
                        <Textfield
                            onChange={this.handleChanges}
                            pattern="^\S+@\S+.\S+$"
                            error="Invalid email address!"
                            label="Email..."
                            name="email"
                            floatingLabel
                            />

                        <Textfield
                            onChange={this.handleChanges}
                            pattern="^\S{6,}$"
                            error="Must be at least 6 characters, no spaces!"
                            label="Password..."
                            floatingLabel
                            name="password"
                            type="password"
                            id="password_text"
                            />
                    </form>
                    <Button onClick={(e) => { this.signIn(e) } } id="submit_button" raised colored ripple>Submit</Button>
                    <div>
                        Don't have an account? <Link to="/login/new">Sign up</Link>
                    </div>
                    <Snackbar
                        active={this.state.failed}
                        onClick={this.handleTimeoutSnackbar}
                        onKeyDown={this.handleClickActionSnackbar}
                        onTimeout={this.handleTimeoutSnackbar}
                        timeout={5000}
                        role="button"
                        aria-label="Notification"
                        action="Close">{this.state.error}</Snackbar>
                </Cell>
            </Grid>
        );
    }
}

class CurateJoin extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            pattern: '^$',
            'email': undefined,
            'password': undefined,
            'handle': undefined,
            'avatar': '',
        };

        this.handleChanges = this.handleChanges.bind(this);
        this.validate = this.validate.bind(this);
        this.handleShowSnackbar = this.handleShowSnackbar.bind(this);
        this.handleTimeoutSnackbar = this.handleTimeoutSnackbar.bind(this);
    }

    // Shows the Snackbar alert
    handleShowSnackbar() {
        this.setState({ failed: true });
    }

    // Hides the Snackbar alert after it times out
    handleTimeoutSnackbar() {
        this.setState({ failed: false });
    }

    // Disable the submit button, initially
    componentDidMount() {
        document.querySelector('#submit_button').disabled = true;
    }

    // Unregister our firebase event listener when the component unmounts,
    // so that we aren't trying to setState on nothing
    // pre: an event listener is attached
    componentWillUnmount() {
        if (this.unregister) {
            this.unregister();
        }
    }

    // Creates a new user account with the given email, password and handle.
    // If there is an error, display it to the user. Otherwise, signs in and 
    // redirects the user to the channels page.
    // pre: requires a valid email, password, handle (display name)
    // and avatar
    createNewUser(email, password, handle, avatar) {
        this.setState({ loading: true });
        this.unregister = firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((firebaseUser) => {
                this.setState({ loading: false });
                return firebaseUser.updateProfile({
                    displayName: handle,
                    photoURL: avatar
                });
            }).then(function () {
                // if successful, redirect user to channels pages
                Cookie.save('user', handle);
                hashHistory.push('/login');
            }).catch((err) => {
                this.setState({ failed: true, loading: false, error: err.message });
            });
    }

    // Updates our component with the input data from the sign in form
    // pre: must have an event from a textfield 
    handleChanges(event) {
        var field = event.target.name;
        var value = event.target.value;

        var changes = {};
        changes[field] = value;

        this.validate();
        this.setState(changes);
    }

    // Validates the form to ensure correct input from the user.
    // If valid, the submit button will become after, otherwise,
    // the user is prompted to adjust the form.
    // pre: something was inputted into the form
    validate() {
        var newPattern = '^' + document.querySelector("#password_text").value + '$';
        this.setState({
            pattern: newPattern
        });
        var elems = document.querySelectorAll('.container input');
        var validElems = {};
        elems.forEach(function (elem) {
            if (elem.checkValidity() && elem.value.length > 0) {
                validElems[elem.name] = 1;
            } else {
                validElems[elem.name] = 0;
            }
        });
        validElems = Object.keys(validElems).reduce(function (total, key) {
            return total + validElems[key];
        }, 0);
        if (validElems === elems.length) {
            document.querySelector('#submit_button').disabled = false;
        } else {
            document.querySelector('#submit_button').disabled = true;
        }
    }

    // Sign the user up using the component's saved input data.
    // pre: user has input some data
    signUp(event) {
        event.preventDefault();
        this.createNewUser(this.state.email, this.state.password, this.state.handle);
    }

    // render our sign up form
    render() {
        return (
            <Grid noSpacing>
                <h3>Sign Up</h3>
                <Cell col={11}>
                    <form id="join_form">
                        <Textfield
                            onChange={this.handleChanges}
                            pattern="^\S+@\S+.\S+$"
                            error="Invalid email address!"
                            label="Email..."
                            name="email"
                            aria-label="email address"
                            floatingLabel
                            />

                        <Textfield
                            onChange={this.handleChanges}
                            pattern="^\S+$"
                            error="Display name must not be blank!"
                            label="Display Name..."
                            name="handle"
                            aria-label="display name"
                            floatingLabel
                            />

                        <Textfield
                            onChange={this.handleChanges}
                            pattern="^\S{6,}$"
                            error="Must be at least 6 characters, no spaces!"
                            label="Password..."
                            floatingLabel
                            name="password"
                            type="password"
                            aria-label="password"
                            id="password_text"
                            />

                        <Textfield
                            onChange={this.handleChanges}
                            pattern={this.state.pattern}
                            error="Passwords do not match!"
                            label="Please confirm password..."
                            aria-label="password"
                            floatingLabel
                            type="password"
                            />
                    </form>
                    {/* Colored Raised button */}
                    <Button onClick={(e) => { this.signUp(e) } } id="submit_button" raised colored ripple>Submit</Button>
                    <div>
                        Already have an account? <Link to="/login">Sign in</Link>
                    </div>
                    <Snackbar
                        active={this.state.failed}
                        onClick={this.handleTimeoutSnackbar}
                        onKeyDown={this.handleClickActionSnackbar}
                        onTimeout={this.handleTimeoutSnackbar}
                        timeout={5000}
                        role="button"
                        aria-label="Notification"
                        action="Close">{this.state.error}</Snackbar>

                </Cell>
            </Grid>
        );
    }
}


export { Manager, CurateLogin, CurateJoin };
export default Login;