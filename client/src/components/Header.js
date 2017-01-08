import React, { Component } from 'react';
import { Grid, Cell, Icon, Tooltip, Textfield } from 'react-mdl';
import Cookie from 'react-cookie';
import { Link, hashHistory } from 'react-router';


class Header extends React.Component {

    logout() {
        Cookie.remove('access_token');
        Cookie.remove('refresh_token');
        Cookie.remove('user_id');
        hashHistory.push('/login');
    }

    render() {

        // maybe consider putting a simple navigation here
        // ie: 'recommendations | preferences | logout | owenflannigan'
        var userControls = <Link onClick={() => { this.logout() } }>Logout</Link>;

        if (this.props.user) {
            var name = (this.props.user.display_name ? this.props.user.display_name : this.props.user.id);
            userControls = <Link onClick={() => { this.logout() } }>Logout, {name}</Link>;
        }

        return (
            <header>
                <Grid>
                    <Cell col={6} phone={12}>
                        <h1>curate(me)</h1>
                        <h2 className="hidePhone">live everyday with something new</h2>
                    </Cell>
                    <Cell col={6} phone={12}>
                        <section className="userControls">
                            {userControls}
                        </section>
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