import React, { Component } from 'react';
import { Grid, Cell } from 'react-mdl';
import Header from './Header';
import Information from './Information';
import Playlist from './Playlist';
// import logo from '../logo.svg';

import DataController from '../DataController';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = { loading: false };

        this.fetchData = this.fetchData.bind(this);
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

    render() {

        var information, playlist;
        if (this.state.track && this.state.recommendations) {
            information = <Information track={this.state.track} />;
            playlist = <Playlist tracks={this.state.recommendations} />;
        }

        var content = []
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

        var loader = [];
        if (this.state.loading) {
            loader = <div className="loader-container">
                <div className="loader"></div>
            </div>
        }

        return (
            <div className="App">
                {loader}
                <Header searchCallback={this.fetchData} />
                <div className="content">
                    {content}
                </div>
            </div>
        );
    }
}

export default App;
