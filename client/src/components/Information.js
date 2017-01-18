import React, { Component } from 'react';
import { Grid, Cell, Link, Tooltip } from 'react-mdl';
import Cookie from 'react-cookie';

class Information extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        var user = Cookie.load('user_id');
        if (user) {
            this.setState({ user: user });
        }
    }

    render() {
        if (this.props.track) {
            if (this.props.track.length > 1) {
                var artist = this.props.track[0].artists[0].name;
                var song = this.props.track[0].name;
                var image = <Grid noSpacing>
                    <Cell col={6} tablet={3} phone={2}>
                        <img src={this.props.track[0].album.images[0].url} alt={song + ' album cover'} className="responsive-img" />
                    </Cell>
                    <Cell col={6} tablet={3} phone={2}>
                        <img src={this.props.track[1].album.images[0].url} alt={song + ' album cover'} className="responsive-img" />
                    </Cell>
                    <Cell col={6} tablet={3} phone={2}>
                        <img src={this.props.track[2].album.images[0].url} alt={song + ' album cover'} className="responsive-img" />
                    </Cell>
                    <Cell col={6} tablet={3} phone={2}>
                        <img src={this.props.track[3].album.images[0].url} alt={song + ' album cover'} className="responsive-img" />
                    </Cell>
                </Grid>
                var title = <h3>{'curated from your top tracks'}</h3>;
            } else {
                var artist = this.props.track.artists[0].name;
                var song = this.props.track.name;
                var image = <img src={this.props.track.album.images[0].url} alt={song + ' album cover'} className="responsive-img" />
                var title = <h3>{'curated based on ' + song + ' by ' + artist}</h3>;
            }
        }

        if (this.state.user) {
            var playlistControls = <ul>
                <li><a onClick={() => { this.props.dialogCallback('Save Playlist', 'Save this playlist to Spotify?', 'Save', 'Playlist Name', this.props.saveCallback) } }>save playlist</a></li>
                <li><a onClick={() => { this.props.dialogCallback('Share Playlist', 'Send this playlist to a friend?', 'Share', 'Friend\'s Username', this.props.shareCallback) } }>share</a></li>
            </ul>
        }

        return (
            <div id="information">
                <Grid noSpacing>
                    <Cell col={12} tablet={2} phone={1}>
                        {image}
                    </Cell>
                    <Cell col={12} tablet={6} phone={3}>
                        <div id="data">
                            {title}
                            {playlistControls}
                        </div>
                    </Cell>
                </Grid>
            </div>
        );
    }
}

export default Information;