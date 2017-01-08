import React, { Component } from 'react';
import { Grid, Cell } from 'react-mdl';
import Header from './Header';
import Information from './Information';
import Playlist from './Playlist';
import { Link, hashHistory } from 'react-router';
import Cookie from 'react-cookie';
import _ from 'lodash';

// import logo from '../logo.svg';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group' // ES6

import DataController from '../DataController';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = { loading: false };

        this.fetchData = this.fetchData.bind(this);
        this.storeTracks = this.storeTracks.bind(this);
    }

    componentDidMount() {
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
                    console.log('userdata', data);
                    Cookie.save('user_id', data.id);
                    this.setState({ user: data });
                });

        } else {
            hashHistory.push('/login');
        }

    }

    fetchData(query) {
        hashHistory.push('/search/' + query);
    }

    storeTracks(trackIds) {
        this.setState({ stored: trackIds }, console.log(this.state));
    }

    render() {

        // var content = <Content track={this.state.track} recommendations={this.state.recommendations} storeCallback={this.storeTracks} />;

        var loader = [];
        if (this.state.loading) {
            loader = <div key="loader-container" className="loader-container">
                <div key="loader" className="loader"></div>
            </div>
        }

        var header = <Header searchCallback={this.fetchData} />
        if (this.state.user) {
            header = <Header user={this.state.user} searchCallback={this.fetchData} />;
        }

        return (
            <div className="App">

                <ReactCSSTransitionGroup
                    transitionName="fade"
                    transitionEnterTimeout={200}
                    transitionLeaveTimeout={200}>
                    {loader}
                </ReactCSSTransitionGroup>

                {header}
                <div className="content">
                    {/*login}
                    {content*/}
                    {this.props.children}
                </div>
            </div>
        );
    }
}

class Content extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};


        this.fetchData = this.fetchData.bind(this);
    }

    componentDidMount() {
        // If there is a search query
        if (this.props.params.query) {
            this.fetchData(this.props.params.query);
        } else { // if no query, get the recommendations based on users' top tracks
            var access_token = Cookie.load('access_token');

            var topTrackOptions = {
                headers: { 'Authorization': 'Bearer ' + access_token }
            }

            fetch('https://api.spotify.com/v1/me/top/tracks?time_range=short_term', topTrackOptions)
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    var topTracks = _.slice(_.shuffle(data.items), 0, 5);
                    console.log('topTrack', topTracks);

                    var track = topTracks[0];
                    var seedIds = topTracks.map((track) => {
                        return track.id;
                    }).join(',');

                    DataController.getRecommendations(seedIds)
                        .then((data) => {
                            console.log('topdata', data);
                            this.setState({
                                track: track,
                                recommendations: data.tracks,
                                loading: false
                            });
                        });
                });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.params.query !== this.props.params.query) {
            this.fetchData(nextProps.params.query);
        }
    }

    fetchData(query) {
        this.setState({ error: null, loading: true });
        DataController.search(query)
            .then((data) => {
                if (data.tracks.items.length) {
                    var track = data.tracks.items[0];
                    DataController.getRecommendations(track.id)
                        .then((data) => {
                            if (data.tracks.length) {
                                this.setState({
                                    track: track,
                                    recommendations: data.tracks,
                                    loading: false
                                });
                            } else {
                                this.setState({
                                    error: 'No recommendations found for ' + track.name,
                                    loading: false
                                });
                            }
                        }).catch((err) => console.log(err));
                } else {
                    this.setState({
                        error: 'No results found for ' + query,
                        loading: false
                    });
                }
            }).catch((err) => console.log(err));
    }

    savePlaylist() {
        console.log('user', Cookie.load('user_id'));
        var session_id = DataController.createPlaylist(Cookie.load('user_id'), this.state.track, this.state.recommendations);
        console.log('session', session_id);
    }

    render() {

        var information, playlist;
        if (this.state.track && this.state.recommendations) {
            information = <Information track={this.state.track} saveCallback={() => { this.savePlaylist() } } />;
            playlist = <Playlist tracks={this.state.recommendations} storeCallback={this.props.storeCallback} />;
        }

        var content;
        if (this.state.error) {
            content = <p>{this.state.error}. Please try another search.</p>
        } else {
            content = <Grid>
                <Cell col={4} tablet={12} phone={12}>
                    {information}
                </Cell>
                <Cell col={8} tablet={12} phone={12}>
                    {playlist}
                </Cell>
            </Grid>;
        }

        return (
            <div>
                {content}
            </div>
        );
    }
}

export { Content };
export default App;
