import React, { Component } from 'react';
import { Grid, Cell, DataTable, TableHeader, Icon, Tooltip } from 'react-mdl';

class Playlist extends React.Component {
    constructor(props) {
        super(props);

        this.state = { audio: new Audio() };
    }

    togglePlayback(track) {
        // Same song
        if (this.state.audio.src == track.preview_url) {
            if (this.state.audio.paused) { // if pauased, play
                this.state.audio.play();
                this.setState({ paused: false });
            } else { // if playing, pause
                this.state.audio.pause();
                this.setState({ paused: true });
            }
        } else { // different song, pause old, play new
            this.state.audio.pause();
            this.setState({
                currentId: track.id,
                audio: new Audio(track.preview_url),
                paused: false
            }, () => {
                this.state.audio.play();
                this.state.audio.onended = () => {
                    this.setState({ paused: true });
                };
            });
        }
    }

    render() {
        var trackRows = this.props.tracks.map((track) => {

            var sample = <Tooltip label={<span>No preview available</span>}>
                <Icon name="error_outline" />
            </Tooltip>;

            if (track.preview_url) {
                var icon = 'play_circle_outline';
                if (track.id == this.state.currentId && !this.state.paused) {
                    icon = 'pause_circle_outline';
                }
                sample = <Icon name={icon} onClick={() => { this.togglePlayback(track) } } />;
            }

            var song = <div>{track.name}<br />
                <span className="artistName">{track.artists.map((artist) => { return artist.name }).join(', ')}</span>
            </div>;

            return {
                sample: sample,
                songInfo: song,
                songName: track.name,
                songArtist: track.artists.map((artist) => { return artist.name }).join(', '),
                songAlbum: track.album.name
            };
        });

        return (
            <Grid noSpacing>

                {/* Phone View */}
                <Cell col={12} hideDesktop>
                    <DataTable
                        selectable
                        rows={trackRows}>

                        <TableHeader name="sample" tooltip="Song album"> </TableHeader>
                        <TableHeader name="songInfo" tooltip="Song name and artist">Song</TableHeader>
                    </DataTable>
                </Cell>

                {/* Tablet/Desktop View */}
                <Cell col={12} hidePhone hideTablet>
                    <DataTable
                        selectable
                        rows={trackRows}>

                        <TableHeader name="sample" tooltip="Song album"> </TableHeader>
                        <TableHeader name="songName" tooltip="Song name">Name</TableHeader>
                        <TableHeader name="songArtist" tooltip="Song artist">Artist</TableHeader>
                        <TableHeader name="songAlbum" tooltip="Song album">Album</TableHeader>
                    </DataTable>
                </Cell>
            </Grid>
        );
    }
}

export default Playlist;