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


       /* This method is used to get the restaurant details based on UUID. */
       getData = () => {
        let that = this;
        let myUrl = `${constants.restaurantUrl}/${this.props.match.params.id}`;
        return fetch(myUrl, {
            method: 'GET',
        }).then((response) => {
            return response.json();
        }).then((jsonResponse) => {
            that.setState({
                restaurant_id: jsonResponse.id,
                restaurant_picture: jsonResponse.photo_URL,
                restaurant_name: jsonResponse.restaurant_name,
                restaurant_locality: jsonResponse.address.locality,
                restaurant_category: jsonResponse.categories,
                restaurant_customer_rating: jsonResponse.customer_rating,
                restaurant_number_customers_rated: jsonResponse.number_customers_rated,
                restaurant_average_price: jsonResponse.average_price
            });
        }).catch((error) => {
            console.log('error restaurant details data', error);
        });
    }

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

      /* This method is used to navigate to checkout page.*/
      onItemCheckoutClicked = () => {
        this.props.history.push(
            { pathname: '/checkout', state: { items_list_new: this.state.state_items_list, total: this.state.total, restaurant_id: this.state.restaurant_id, restaurant_name: this.state.restaurant_name } }
        )
    }
    
     /* This method is used to increase the count of items. */
     onItemAddClicked = (newItem) => {
        let newItemList = this.state.state_items_list
        let itemIndex = 0;
        newItemList.forEach(function (item, index) {
            if (item.name === newItem.name) {
                itemIndex = index;
            }
        }, this);
        let newItems = newItemList;
        let cost = newItem.price / newItem.count
        newItem.price = newItem.price + cost
        newItem.count = newItem.count + 1
        let newtotal = this.state.total + cost
        newItems.splice(itemIndex, 1, newItem);
        let newitem_count = this.state.item_count + 1
        this.setState({ state_items_list: newItemList });
        this.setState({
            open: true,
            total: newtotal,
            item_count: newitem_count
        })
        this.setState({ message: "Item quantity increased by 1!" })
    }

    /* This method is used to add item to cart.*/
    onAddClicked = (newItem) => {
        let newItemList = this.state.state_items_list
        let itemIndex = 0;
        if (newItemList.length > 0) {
            newItemList.forEach(function (item, index) {
                if (item.name === newItem.item_name) {
                    itemIndex = index;
                }
            }, this);
        }
        let itemNode = newItemList[itemIndex];
        let newItems = newItemList;
        let itemNodeNew = {}
        if (itemNode !== undefined) {
            if (itemNode.name === newItem.item_name) {
                itemNodeNew.price = itemNode.price + newItem.price
                itemNodeNew.count = itemNode.count + 1
                itemNodeNew.name = itemNode.name
                itemNodeNew.id = itemNode.id
                itemNodeNew.item_type = itemNode.item_type
                newItems.splice(itemIndex, 1, itemNodeNew);
                let newitem_count = this.state.item_count + 1
                let newtotal = this.state.total + newItem.price
                this.setState({
                    open: true,
                    item_count: newitem_count,
                    total: newtotal
                })
                this.setState({ message: "Item added to cart!" })
                this.setState({ state_items_list: newItems });
                return
            }
        }
        itemNodeNew.price = newItem.price
        itemNodeNew.name = newItem.item_name
        itemNodeNew.count = 1
        itemNodeNew.id = newItem.id
        itemNodeNew.item_type = newItem.item_type
        let newtotal = this.state.total + newItem.price
        newItems.push(itemNodeNew)
        let newitem_count = this.state.item_count + 1
        this.setState({
            state_items_list: newItems,
            total: newtotal,
            item_count: newitem_count
        });
        this.setState({ open: true })
        this.setState({ message: "Item added to cart!" })
    }

     /* This method is used to close. */
     handleClose = () => {
        this.setState({ open: false })
    };

    /* This method is used to decrease the count of an item. */
    onItemRemoveClicked = (newItem) => {
        let newItemList = this.state.state_items_list
        let itemIndex = 0;
        newItemList.forEach(function (subscriber, index) {
            if (subscriber.name === newItem.name) {
                itemIndex = index;
            }
        }, this);
        let newItems = newItemList;
        let cost = newItem.price / newItem.count
        newItem.price = newItem.price - cost
        newItem.count = newItem.count - 1
        let newtotal = this.state.total - cost
        if (newItem.count !== 0) {
            newItems.splice(itemIndex, 1, newItem);
        }
        else {
            newItems.splice(itemIndex, 1);
        }
        let newitem_count = this.state.item_count - 1
        this.setState({ state_items_list: newItemList });
        this.setState({
            open: true,
            total: newtotal,
            item_count: newitem_count
        })
        if (newItem.count === 0) {
            this.setState({
                message: "Item removed from cart!",
                open: true
            })
        }
        else {
            this.setState({
                message: "",
                open: false
            })
        }
    }

 

}

export default Details;