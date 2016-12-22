import React, { Component } from 'react';
import { Grid, Cell, Icon, Tooltip, Textfield } from 'react-mdl';

class Header extends React.Component {


    render() {
        return (
            <header>
                <Grid>
                    <Cell col={6} phone={12}>
                        <h1>curate(me)</h1>
                        <h2 className="hidePhone">live everyday with something new</h2>
                    </Cell>
                    <Cell col={6} phone={12}>
                        <section className="search">
                            <Search searchCallback={this.props.searchCallback} />
                        </section>
                    </Cell>
                </Grid>
            </header>
        );
    }
}

class Search extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};

        this.handleChange = this.handleChange.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    handleChange(event) {
        var input = event.target.value;
        this.setState({ value: input });
    }

    handleKeyPress(event) {
        if (event.charCode == 13) {
            event.preventDefault();
            event.stopPropagation();

            this.props.searchCallback(this.state.value);
        }
    }

    render() {
        return (
            <form method="get">
                <Tooltip label="Search">
                    <Icon className="searchIcon" name="search" onClick={(e) => {
                        e.charCode = 13;
                        this.handleKeyPress(e);
                    }
                    } />
                </Tooltip>
                <input
                    onChange={(e) => { this.handleChange(e) } }
                    onKeyPress={(e) => { this.handleKeyPress(e) } }
                    type="text"
                    placeholder="curate by song, artist or album..."
                    name="search" />
            </form>
        );
    }
}

export default Header;