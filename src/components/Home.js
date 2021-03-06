import React, { Component } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import TablePagination from '@material-ui/core/TablePagination';
import { Link } from 'react-router-dom'

//Putting this here for now
const PLAYER_REPO = 1;

class Home extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            count: 0,
            limit: 10,
            page: 0
        };
   
        this.handleChangePage = this.handleChangePage.bind(this);
        this.handleChangeLimit = this.handleChangeLimit.bind(this);
    }


    async componentDidMount() {

        if (!this.props.freedom) return;

        let count = await this.props.freedom.count(PLAYER_REPO);

        this.setState({
            count: count
        });

        // console.log(`count ${count}`);

        await this._fetchPage(this.state.page, this.state.limit);
        
    }

    async handleChangePage(event, page) {

        // console.log(`handleChangePage: ${page}`);

        this.setState({ 
            page: page
        });

        await this._fetchPage(page, this.state.limit);

    }

    async handleChangeLimit(event) {
        
        const limit = event.target.value;

        this.setState({ 
            limit: limit 
        });

        await this._fetchPage(this.state.page, limit);
    };

    async _fetchPage(page, limit) {

        // console.log("_fetchPage");

        if (this.state.count === 0) return;
        
        const offset = page * limit;

        // console.log(`Limit: ${limit}, Offset: ${offset}, Page: ${page}`);

        let players = await this.props.freedom.readList(PLAYER_REPO, limit, offset);

        this.setState({
            players: players
        });
    }

    _renderPlayers() {
        if (!this.state || !this.state.players) return;

        return this.state.players.map((player) =>
            <ListItem button key={player.id} to={'/player/show/' + player.id} component={Link} >
                <Avatar alt="Remy Sharp" src="/static/images/remy.jpg" />
                <ListItemText primary={player.firstName + ' ' + player.lastName} />
            </ListItem>
        )
    }

    render() {

        //Won't be set the first time it loads.
        // if (!this.props.freedom) { return (<div>Loading...</div>) }

        return (
            <Card>
                <CardHeader
                    title="Player List"
                    action={
                        <Button variant="contained" color="primary" href="/player/create">Create Player</Button>
                    }
                />
                <CardContent>
                    <List>
                        {this._renderPlayers()}
                    </List>
                </CardContent>
                <CardActions>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={this.state.count}
                        rowsPerPage={this.state.limit}
                        page={this.state.page}
                        backIconButtonProps={{
                            'aria-label': 'Previous Page',
                        }}
                        nextIconButtonProps={{
                            'aria-label': 'Next Page',
                        }}
                        onChangePage={this.handleChangePage}
                        onChangeRowsPerPage={this.handleChangeLimit}
                    />
                </CardActions>
            </Card>
        );
    }
}

export default Home;
