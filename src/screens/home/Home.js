import React, { Component } from 'react';
import './Home.css';
import { constants } from '../../common/Apiurls';
import Header from '../../common/header/Header';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRupeeSign } from '@fortawesome/free-solid-svg-icons';
import { faStar } from '@fortawesome/free-solid-svg-icons';

class Home extends Component {
    constructor(props) {
        super(props);
        if (sessionStorage.getItem('access-token') == null) {
            props.history.replace('/');
        }

        this.state = {
            allrestaurantsData: [],
            message: null
        }

        this.getAllRestaurantData();
    }

    render() {
        return (
            <div>
                <Header
                    searchHandler={this.getAllRestaurantData}
                    screen={"Home"}
                    history={this.props.history} />
                <div className="card-details">
                    {(this.state.allrestaurantsData !== null) && (this.state.allrestaurantsData !== undefined) ?
                        (this.state.allrestaurantsData.map(restaurant => (

                            <Card key={restaurant.id} style={{ align: 'left', width: "24%", cursor: "pointer", margin: "5px" }} onClick={() => this.restaurantClickHandler(restaurant.id)}>
                                <CardContent>
                                    <div>
                                        <img
                                            style={{ height: '150px', width: '100%', align: 'left' }}
                                            src={restaurant.photo_URL} alt="restaurant_picture"></img>
                                            </div>
                                            <div style={{padding: "5%"}}>
                                        <div style={{ fontSize: "18px", paddingBottom:"6%" }}><b>{restaurant.restaurant_name}</b></div>
                                        <div style={{ paddingBottom:"6%"}}>{restaurant.categories}</div>
                                        <div className="card-details" >
                                            <span style={{ padding: "10px", backgroundColor: "#eaea1f", align: "center", color: "white" }}>
                                                <FontAwesomeIcon icon={faStar}></FontAwesomeIcon>&nbsp;&nbsp;{restaurant.customer_rating}&nbsp;&nbsp;({restaurant.number_customers_rated})
                                        </span>
                                            {/* {{ width: "45%", align: 'right' }} */}
                                            <span style={{ paddingTop: "10px", paddingLeft: "15%" }}>
                                                <FontAwesomeIcon icon={faRupeeSign}></FontAwesomeIcon> {restaurant.average_price} for two
                                        </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))) : null

                    }
                </div>
                <div>{this.state.message}</div>
            </div >
        )
    }


    /* This method is used to navigate to restaurant details page. */
    restaurantClickHandler = (restuaurantId) => {
        this.props.history.push('/restaurant/' + restuaurantId);
    }

    /* This method is used to get all the restaurant details based on the search value. */
    getAllRestaurantData = (value) => {
        if (value == null || value === "") {
            let that = this;
            let url = `${constants.allrestaurantsUrl}`;
            return fetch(url, {
                method: 'GET',
            }).then((response) => {
                return response.json();
            }).then((jsonResponse) => {
                console.log(jsonResponse.restaurants);
                console.log(jsonResponse.restaurants.length);

                if (jsonResponse.restaurants.length === 0) {
                    this.setState({ message: "No restaurant found" })
                }
                if (jsonResponse.restaurants.length !== 0) {
                    this.setState({ message: null })
                }
                that.setState({
                    allrestaurantsData: jsonResponse.restaurants,
                    message: null
                });
            }).catch((error) => {
                console.log('error restaurant data', error);
            });
        }
        else {
            let that = this;
            let url = `${constants.findRestaurant}/${value}`;
            return fetch(url, {
                method: 'GET',
            }).then((response) => {
                return response.json();
            }).then((jsonResponse) => {
                console.log(jsonResponse.restaurants);
                console.log(jsonResponse.restaurants.length);
                if (jsonResponse.restaurants.length === 0) {
                    this.setState({ message: "No restaurant with the given name." })
                }
                if (jsonResponse.restaurants.length !== 0) {
                    this.setState({ message: null })
                }
                that.setState({
                    allrestaurantsData: jsonResponse.restaurants
                });

            }).catch((error) => {
                console.log('error restaurant data', error);
            });
        }
    }

}
export default Home;