import React, { Component } from 'react';
import { constants } from '../../common/Apiurls';
import StarIcon from '@material-ui/icons/Star';
import './Details.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle } from '@fortawesome/free-solid-svg-icons'
import AddIcon from '@material-ui/icons/Add';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Badge from '@material-ui/core/Badge';
import RemoveIcon from '@material-ui/icons/Remove';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';
import Header from '../../common/header/Header';

class Details extends Component {

    constructor(props) {
        super(props);
        this.state = {
            restaurant_picture: null,
            restaurant_name: null,
            restaurant_locality: null,
            restaurant_category: [],
            restaurant_customer_rating: "",
            restaurant_number_customers_rated: null,
            restaurant_average_price: null,
            item_count: 0,
            state_items_list: [],
            found: false,
            open: false,
            message: "",
            total: 0
        }
        this.getData();
    }
    


    render() {
        return (
            <div className="details">
                <Header
                    screen={"Details"}
                    history={this.props.history} />
                <div className="restaurant-details-section">
                    <div className="left-details">
                        <img style={{ height: '90%', width: '80%', align: 'left', padding: '20px' }}
                            src={this.state.restaurant_picture}
                            alt="restaurant_logo" />
                    </div>
                    <div className="right-details">
                        <div>{this.state.restaurant_name}</div>
                        <div>{this.state.restaurant_locality}</div>
                        <div>
                            {this.state.restaurant_category.map(cat => (
                                <span>{cat.category_name + ", "}</span>
                            ))}
                        </div>
                        <br />
                        <div className="restaurant-details">
                            <span><div><StarIcon></StarIcon>&nbsp;&nbsp;{this.state.restaurant_customer_rating}</div>
                                <div>AVERGAE RATING BY {this.state.restaurant_number_customers_rated} CUSTOMERS</div></span>
                            <span><div><b>&#x20b9;</b>{this.state.restaurant_number_customers_rated}</div>
                                <div>AVERAGE COST FOR TWO PEOPLE</div></span></div>
                    </div>
                </div>

                <div className="item-details">
                    <div className="items-left-details">
                        {this.state.restaurant_category != null && this.state.restaurant_category.map(cat => (
                            <div>
                                <div style={{ textTransform: "uppercase" }}><b>{cat.category_name}</b></div>
                                <hr />
                                {cat.item_list.map(item => (
                                    <div className="item-details">
                                        {item.item_type === "NON_VEG" && <span id="non_veg" style={{ float: "left", width: "25%" }}>
                                            <FontAwesomeIcon icon={faCircle} style={{ color: "red" }}></FontAwesomeIcon>
                                        </span>}
                                        {item.item_type === "VEG" && <span id="veg" style={{ float: "left", width: "25%" }}>
                                            <FontAwesomeIcon icon={faCircle} style={{ color: "green" }}></FontAwesomeIcon>
                                        </span>}
                                        <span style={{ float: "left", width: "25%" }}>
                                            {item.item_name}
                                        </span>
                                        <span style={{ float: "left", width: "25%" }}>
                                            {item.price}
                                        </span>
                                        <span style={{ float: "left", width: "25%" }}>
                                            <AddIcon style={{ cursor: "pointer" }} onClick={() => this.onAddClicked(item)}></AddIcon>
                                        </span>
                                    </div>
                                ))}<br /><br />
                            </div>
                        ))}
                    </div>

                    <div className="items-right-details">
                        <Card className="cardStyle">
                            <CardContent>
                                <Badge badgeContent={this.state.item_count} color="primary">
                                    <ShoppingCartIcon></ShoppingCartIcon>
                                </Badge>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>My Cart</b>
                                <div>
                                    {this.state.state_items_list.map(it => (
                                        <div className="item-details" key={it.id}>
                                            <span style={{ align: 'left', width: "11%" }}>{it.item_type === "VEG" ? (<FontAwesomeIcon icon={faCircle} style={{ color: "green" }}></FontAwesomeIcon>) : (<FontAwesomeIcon icon={faCircle} style={{ color: "red" }}></FontAwesomeIcon>)}</span>
                                            <span style={{ align: 'left', width: "22%" }}>{it.name}</span>
                                            <span style={{ align: 'left', width: "11%" }}>
                                                <RemoveIcon style={{ cursor: "pointer" }} onClick={() => this.onItemRemoveClicked(it)}></RemoveIcon>
                                            </span>
                                            <span style={{ align: 'left', width: "11%" }}>{it.count}</span>
                                            <span style={{ align: 'left', width: "11%" }}>
                                                <AddIcon style={{ cursor: "pointer" }} onClick={() => this.onItemAddClicked(it)}></AddIcon>
                                            </span>
                                            <span style={{ align: 'left', width: "33%" }}><span style={{ color: "grey" }}><b>&#x20b9;</b></span>&nbsp;{it.price}</span>
                                        </div>
                                    ))}
                                </div>,
                                <div className="item-details">
                                    <span style={{ align: 'left', width: "50%" }}><b>TOTAL AMOUNT</b></span>
                                    <span style={{ align: 'right', width: "50%" }}><b>&#x20b9;&nbsp;&nbsp;{this.state.total}</b></span>
                                </div>,
                                <div className="item-details">
                                    <Button style={{ width: "100%" }} variant="contained" onClick={() => this.onItemCheckoutClicked()} color="primary">CHECKOUT</Button>
                                </div>

                            </CardContent>
                        </Card>
                    </div>

                </div>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={this.state.open} message={this.state.message}
                    action={[<IconButton
                        key="close"
                        aria-label="close"
                        color="inherit"
                        onClick={() => this.handleClose()}
                    >
                        <CloseIcon />
                    </IconButton>,
                    ]}>

                </Snackbar>

            </div>
        )
    }

    

 

}

export default Details;