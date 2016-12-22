import React, { Component } from 'react';
import { Grid, Cell } from 'react-mdl';

class Information extends React.Component {
    render() {
        if (this.props.track) {
            var artist = this.props.track.artists[0].name;
            var song = this.props.track.name;
            var cover = this.props.track.album.images[0].url;
        }

        return (
            <div id="information">
                <Grid noSpacing>
                    <Cell col={12} tablet={2} phone={1}>
                        <img src={cover} alt={song + ' album cover'} className="responsive-img" />
                    </Cell>
                    <Cell col={12} tablet={6} phone={3}>
                        <div id="data">
                            <h3>{'curated based on ' + song + ' by ' + artist}</h3>
                            <ul>
                                <li><a href="">save playlist</a></li>
                                <li><a href="">share</a></li>
                            </ul>
                        </div>
                    </Cell>
                </Grid>
            </div>
        );
    }
}

export default Information;