import './Home.css';
import { faRupeeSign, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { withStyles } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import GridList from '@material-ui/core/GridList';
import Header from '../../common/header/Header';
import React, { Component } from "react";
import 'typeface-roboto';
import Typography from '@material-ui/core/Typography';


/** 
 * @param {*} theme
 */
const styles = theme => ({
    /**rupees displayed in card */
    rupees: {
        fontSize: 'small',
        marginRight: '6px',
        whiteSpace: 'nowrap'
    },
    /**Grid*/
    root: {
        flexGrow: 1,
    },
    /**categories displayed on a card */
    categories: {
        marginTop: '16%',
        fontSize: 'initial'
    },
    /**card text */
    cardText: {
        minHeight: '145px',
        padding: '2%',
        '@media(max-width:599px)': {
            minHeight: 'auto'
        }
    },
    /** card bottom section with margin and display flex */
    ratingAndPrice: {
        whiteSpace: 'nowrap',
        margin: '10px',
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'space-between'
    },
    /**margin for the star icon */
    faStarIcon: {
        marginBottom: '1px'
    },
    /**rating box displayed in the card */
    ratingBox: {
        display: 'flex',
        color: 'white',
        fontSize: 'small',
        whiteSpace: 'nowrap',
        width: '100px',
        padding: '10px 15px',
        justifyContent: 'center',
        backgroundColor: 'rgb(234, 204, 94)'
    }
})

class Home extends Component {
    constructor() {
        super();
        this.state = {
            search: '',
            dispMessage: 'dispNone',
            restaurants: []
        }
    }

    /*Redirect to details page based on the restaurant which is clicked*/
    cardClickHandler = (restaurantId) => {
        this.props.history.push("/restaurant/" + restaurantId);
    }

    /**Search the restaurant according to restaurant name typed where 'searchValue' */
    searchBoxChangeHandler = (searchValue) => {
        this.setState({ search: searchValue })        
        if (searchValue !== '' && searchValue !== null) {
            let that = this;
            let xhrData = new XMLHttpRequest();
            let restaurants = null;
            xhrData.addEventListener("readystatechange", function () {                
                if (this.readyState === 4 && this.status === 200) {                    
                    that.setState({
                        restaurants: JSON.parse(this.response).restaurants
                    });                    
                    if (that.state.restaurants !== null && that.state.restaurants.length === 0) {
                        that.setState({ dispMessage: 'dispBlock' });
                    } else {
                        that.setState({ dispMessage: 'dispNone' });
                    }
                }
            });            
            xhrData.open("GET", this.props.baseUrl + '/restaurant/name/' + searchValue);
            xhrData.send(restaurants);
        } else {            
            this.componentWillMount();
        }
    }

    render() {
        const { classes } = this.props;
        let restaurantsData = this.state.restaurants;
        return (
            <div>
                <Header pageId='home' baseUrl={this.props.baseUrl} searchBoxChangeHandler={this.searchBoxChangeHandler} />
                <div className='grid-container'>
                    <GridList cellHeight={"auto"} spacing={20} >
                        {restaurantsData !== [] && restaurantsData !== null && restaurantsData.map(restaurant => (
                            <Grid container item key={restaurant.id} className={classes.root} xs={12}
                                sm={6} md={4} lg={3} >
                                <Card onClick={() => this.cardClickHandler(restaurant.id)}>
                                    <CardActionArea>                                     
                                        <CardMedia
                                            component="img"
                                            alt={restaurant.restaurant_name}
                                            height="175"
                                            image={restaurant.photo_URL}
                                            title={restaurant.restaurant_name}
                                        />
                                        <CardContent>
                                            <div className={classes.cardText} >
                                                <Typography gutterBottom variant="h5" component="h2">
                                                    {restaurant.restaurant_name}
                                                </Typography>
                                                <Typography variant="subtitle2" component="p" className={classes.categories}>
                                                    {restaurant.categories}
                                                </Typography>
                                            </div>
                                        </CardContent>
                                        <CardActions className={classes.ratingAndPrice}>
                                            <span className={classes.ratingBox}>
                                                <FontAwesomeIcon icon={faStar} className='faStarIcon' /> &nbsp;
                                                    <span> {restaurant.customer_rating}</span>&nbsp;({restaurant.number_customers_rated})
                                                </span>
                                            <Typography className={classes.rupees}>
                                                <FontAwesomeIcon icon={faRupeeSign} />
                                                {restaurant.average_price}
                                                &nbsp;for two
                                                </Typography>
                                        </CardActions>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        ))}
                    </GridList>
                    <div className={this.state.dispMessage}>
                        <Typography>No restaurant with the given name.</Typography>
                    </div>
                </div>
            </div>
        )
    }

    componentWillMount() {
        let that = this;
        let xhrData = new XMLHttpRequest();
        let restaurants = null;
        xhrData.addEventListener("readystatechange", function () {           
            if (this.readyState === 4 && this.status === 200) {               
                that.setState({
                    restaurants: JSON.parse(this.response).restaurants
                });
                that.setState({ dispMessage: 'dispNone' })
            }
        });
        xhrData.open("GET", this.props.baseUrl + '/restaurant');
        xhrData.send(restaurants);
    }

}

export default withStyles(styles)(Home);