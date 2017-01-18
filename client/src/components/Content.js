import React, { Component } from 'react';
import { Grid, Cell, Snackbar, Dialog, DialogTitle, DialogContent, DialogActions, Button, Textfield } from 'react-mdl';
import _ from 'lodash';
import { Link, hashHistory } from 'react-router';
import DataController from '../DataController';
import Cookie from 'react-cookie';
import Information from './Information';
import Playlist from './Playlist';
import { Search } from './Header';


class Content extends React.Component {
    constructor(props) {
        super(props);
        this.state = { loading: true, isSnackbarActive: false, stored: [], dialogLabel: '...' };

        this.fetchData = this.fetchData.bind(this);
        this.loadData = this.loadData.bind(this);
        this.handleCloseDialog = this.handleCloseDialog.bind(this);
        this.handleOpenDialog = this.handleOpenDialog.bind(this);
        this.savePlaylist = this.savePlaylist.bind(this);
        this.sharePlaylist = this.sharePlaylist.bind(this);
        this.storeTracks = this.storeTracks.bind(this);
        this.handleTimeoutSnackbar = this.handleTimeoutSnackbar.bind(this);
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
                    this.setState({ user: data });
                });

        } else {
            // Default view before search, when not logged in
        }


        this.loadData();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.params.query !== this.props.params.query) {
            this.fetchData(nextProps.params.query);
        } else if (!this.props.params.query) { // viewing recommendations
            this.loadData();
        }
    }

    loadData() {
        this.setState({ loading: true });
        Cookie.save('content_searched', true);
        // If there is a search query
        if (this.props.params.query) {
            this.fetchData(this.props.params.query);
        } else { // if no query, get the recommendations based on users' top tracks
            var access_token = Cookie.load('access_token');

            if (access_token) {

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
                                if (data.tracks.length) {
                                    this.setState({
                                        track: topTracks,
                                        recommendations: data.tracks,
                                        loading: false
                                    });
                                } else {
                                    this.setState({
                                        error: 'No recommendations found for your top songs.',
                                        loading: false
                                    });
                                }
                            });
                    });
            } else {
                this.setState({ initialState: true, loading: false });
                Cookie.remove('content_searched'); // not a pretty form of persistence...but it works
            }
        }
    }

    fetchData(query) {
        // get stored tracks
        var stored = [];
        if (this.state.recommendations && this.state.stored) {
            stored = this.state.recommendations.filter((track) => {
                return _.includes(this.state.stored, track.id);
            });
        }
        this.setState({ error: null, loading: true, initialState: false });
        DataController.search(query)
            .then((data) => {
                if (data.tracks.items.length) {
                    var track = data.tracks.items[0];
                    DataController.getRecommendations(track.id)
                        .then((data) => {
                            if (data.tracks.length) {
                                this.setState({
                                    track: track,
                                    recommendations: _.concat(stored, data.tracks),
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
        var session_id = DataController.createPlaylist(this.state.user.id, this.state.track.length > 1 ? { name: 'your top tracks' } : this.state.track, this.state.recommendations, this.state.dialogInput);
        this.handleCloseDialog();
        session_id.then((data) => {
            var text = data.snapshot_id ? 'Playlist saved.' : 'Error: ' + data.error_description;
            this.setState({
                isSnackbarActive: true,
                snackbarText: text
            });
        });
    }

    sharePlaylist() {
        if (this.state.dialogInput && this.state.dialogInput.length) {
            DataController.sharePlaylist(this.state.recommendations, this.state.user.id, this.state.dialogInput);
            this.handleCloseDialog();
        } else {
            this.setState({
                isSnackbarActive: true,
                snackbarText: 'Please enter a recipient'
            });
        }
    }

    storeTracks(trackIds) {
        // Without this structure, react-mdl's onSelectionChanged will cause
        // an infinite loop when a parent updates state.
        if (this.state.stored.length !== trackIds.length && trackIds.length !== 0) {
            this.setState({ stored: trackIds });
        }
    }

    contentSearch(query) {
        Cookie.save('content_searched', true);
        hashHistory.push('search/' + query);
    }

    handleOpenDialog(title, text, action, label, callback) {
        this.setState({
            openDialog: true,
            dialogTitle: title,
            dialogText: text,
            dialogAction: action,
            dialogLabel: label,
            dialogActionCallback: callback
        });
    }

    handleCloseDialog() {
        this.setState({
            openDialog: false,
        });
    }

    handleDialogChange(event) {
        this.setState({
            dialogInput: event.target.value
        });
    }

    handleTimeoutSnackbar() {
        this.setState({ isSnackbarActive: false });
    }

    render() {
        var loader = [];
        if (this.state.loading) {
            loader = <div key="loader-container" className="loader-container">
                <div key="loader" className="loader"></div>
            </div>
        }

        var information, playlist;
        if (this.state.track && this.state.recommendations) {
            information = <Information track={this.state.track} dialogCallback={this.handleOpenDialog} saveCallback={this.savePlaylist} shareCallback={this.sharePlaylist} user={this.state.user} />;

            playlist = <Playlist tracks={this.state.recommendations} storeCallback={this.storeTracks} stored={this.state.stored} />;
        }

        var content;
        if (this.state.initialState) {
            content = <Grid className="contentSearch">
                <Cell col={8} phone={10} className="contentSearchCell">
                    <Search searchCallback={(q) => { this.contentSearch(q) } } />
                </Cell>
            </Grid>;
        } else if (this.state.error) {
            content = <p>{this.state.error}. Please try another search.</p>
        } else {
            content = <Grid className="darkBackground">
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
                {loader}
                {content}
                <Dialog open={this.state.openDialog}>
                    <DialogTitle>{this.state.dialogTitle}</DialogTitle>
                    <DialogContent>
                        <Textfield
                            onChange={(e) => { this.handleDialogChange(e) } }
                            label={this.state.dialogLabel}
                            />
                        <p>{this.state.dialogText}</p>
                    </DialogContent>
                    <DialogActions>
                        <Button type='button' onClick={this.state.dialogActionCallback}>{this.state.dialogAction}</Button>
                        <Button type='button' onClick={this.handleCloseDialog}>Close</Button>
                    </DialogActions>
                </Dialog>
                <Snackbar
                    active={this.state.isSnackbarActive}
                    onTimeout={this.handleTimeoutSnackbar}
                    onClick={() => { this.handleTimeoutSnackbar() } }
                    action="Close">
                    {this.state.snackbarText}
                </Snackbar>
            </div>
        );
    }
}

export default Content;