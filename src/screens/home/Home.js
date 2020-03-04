import React, { Component } from 'react';
import './Home.css';
import { constants } from '../../common/Apiurls';
import Header from '../../common/header/Header';
import StarIcon from '@material-ui/icons/Star';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

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
                                        <div style={{ fontSize: "18px" }}>{restaurant.restaurant_name}</div>
                                        <div>{restaurant.categories}</div>
                                        <div className="card-details">
                                            <span style={{ width: "45%", height: "40px", backgroundColor: "orange", align: 'left', color: "white" }}>
                                                <StarIcon></StarIcon>&nbsp;&nbsp;{restaurant.customer_rating}&nbsp;&nbsp;({restaurant.number_customers_rated})
                                        </span>
                                            <span style={{ width: "45%", align: 'right' }}>
                                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#x20b9; {restaurant.average_price} for two
                                        </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))) : null

                    }
                </div>
                <div>{this.state.message}</div>
            </div>
        )
    }


 

}



export default Home;