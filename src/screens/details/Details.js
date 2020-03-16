import './Details.css';
import { faCircle, faMinus, faPlus, faRupeeSign, faStar } from "@fortawesome/free-solid-svg-icons";
import { Fade, withStyles } from '@material-ui/core';
import { faStopCircle } from '@fortawesome/fontawesome-free-regular';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AddIcon from '@material-ui/icons/Add';
import Badge from '@material-ui/core/Badge';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CloseIcon from '@material-ui/icons/Close';
import Divider from '@material-ui/core/Divider';
import Header from '../../common/header/Header';
import IconButton from '@material-ui/core/IconButton';
import React, { Component } from 'react';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import Snackbar from '@material-ui/core/Snackbar';
import 'typeface-roboto';
import Typography from '@material-ui/core/Typography';

/**
 *
 * @param {*} theme
 */
const styles = theme => ({   
     /*menu item */
     menuItem: {
        marginLeft: '4%'
    }, 
    detail: {
        margin: '2% 0%'
    },
      /*category name */
      category: {
        marginBottom: '1%'
    },
    /* font to bold */
    bold: {
        'font-weight': 600
    },    
    cartMenuItem: {
        marginLeft: '5%',
        width: '40%'
    },
    /* badge on cart to show large badge */
    badge: {
        transform: 'scale(1.2) translate(50%, -50%)'
    },
    /* Style the minus button on cart section */
    minusBtn: {
        color: 'black',
        padding: '5px',       
        margin: '0px 8px',
        fontSize: 'medium'       
    },
    /* Style the plus button on cart section */
    plusBtn: {
        margin: '0px 8px',   
        color: 'black',
        padding: '5px',
        fontSize: 'medium'
    },
     /*add icon  */
     addIcon: {
        marginLeft: '4%'
    }    
});

class Details extends Component {
    constructor() {
        super();        
        this.state = {
            restaurantDetails: {},
            cartTotalAmount: 0,
            cartItems: [],
            snackBarMsg: '',
            transition: Fade,
            noOfItemsInCart: 0,
            showSnackbar: false,       
            isBadgeVisible: true
        };
    }

    
    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        //Snackbar
        this.setState({ showSnackbar: false, snackBarMsg: '' });
    }

    componentWillMount() {
        let restaurantID = this.props.match.params.restaurantID;
        let xhr = new XMLHttpRequest();
        let thisComponent = this;
        xhr.addEventListener('readystatechange', function () {
            if (this.readyState === 4 && this.status === 200) {
                let response = JSON.parse(this.response);
                let categories = response.categories;
                let categoriesText = '';
                // parse the categories separated by ',' to show as single text
                for (let index = 0; index < categories.length; index++) {
                    categoriesText = categoriesText.concat(categories[index].category_name);
                    if (index < categories.length - 1) {
                        categoriesText = categoriesText.concat(',').concat(' ');
                    }
                }
                // set the restaurant details from the api response
                let restaurantDetails = {
                    uuid: response.id,
                    restaurantName: response.restaurant_name,
                    photoURL: response.photo_URL,
                    customerRating: response.customer_rating,
                    averagePrice: response.average_price,
                    noOfCustomersRated: response.number_customers_rated,
                    locality: response.address.locality,
                    categories: response.categories,
                    categoriesText: categoriesText
                }
                // Set the details to state variable
                thisComponent.setState({
                    restaurantDetails: restaurantDetails
                });
            }
        })
        let data = null;
        // Access the get restaurant api of backend to get the details based on restaurantID
        xhr.open('GET', this.props.baseUrl + '/restaurant/' + restaurantID);
        xhr.send(data);
    }

    /*Adds the item to cart, updates the quantity if the item is already in cart */
    addItemClick = (item) => {

        let cartItems = this.state.cartItems;
        let isItemAlreadyInCart = false;
        let noOfItemsInCart = this.state.noOfItemsInCart;        

        cartItems.forEach(cartItem => {
            if (cartItem.id === item.id) {
                cartItem.quantity++;
                cartItem.totalItemPrice = cartItem.price * cartItem.quantity;
                isItemAlreadyInCart = true;
            }
        });        
        if (!isItemAlreadyInCart) {
            let cartItem = {
                id: item.id,
                item_name: item.item_name,
                price: item.price,
                item_type: item.item_type,
                quantity: 1,
                totalItemPrice: item.price
            }
            cartItems.push(cartItem);
        }
        noOfItemsInCart++;
        
        this.setState({
            showSnackbar: true,            
            cartItems: cartItems,
            noOfItemsInCart: noOfItemsInCart,
            snackBarMsg: 'Item added to cart!',
            cartTotalAmount: this.state.cartTotalAmount + item.price
        });
    }

   
    /*Checkout with the items added to cart*/
    checkoutClick = () => {
        let isUserLoggedIn = sessionStorage.getItem('access-token') !== null;
        // items are added to cart
        if (this.state.cartItems !== null && this.state.cartItems.length > 0) {
            // Check the customer is logged or not
            if (!isUserLoggedIn) {
                this.setState({
                    showSnackbar: true,
                    snackBarMsg: 'Please login first!'
                });
            } else {
                // proceed to checkout
                this.props.history.push({
                    pathname: '/checkout',
                    state: {
                        cartItems: this.state.cartItems,
                        restaurantID: this.state.restaurantDetails.uuid,
                        restaurantName: this.state.restaurantDetails.restaurantName
                    }
                });
            }
        }
        else {
            // snackbar message to add items.
            this.setState({
                showSnackbar: true,
                snackBarMsg: 'Please add an item to your cart!'
            });
        }
    }


    /*Removes the item from the cart and update price and total amount*/
    removeItemFromCart = (cartItem) => {
        let snackBarMsg = '';
        cartItem.quantity--;
        // Quantity zero indicates, this items should be removed from cart completely
        if (cartItem.quantity <= 0) {
            let cartItems = this.state.cartItems;
            // remove the item from the cart
            cartItems.splice(cartItems.indexOf(cartItem), 1);
            snackBarMsg = 'Item removed from cart!';
        } else {
            // update the total item price for the updated quantity
            cartItem.totalItemPrice = cartItem.quantity * cartItem.price;
            snackBarMsg = 'Item quantity decreased by 1!';
        }
        // Update the cart total amount, no of items count in cart
        this.setState({
            showSnackbar: true,
            snackBarMsg: snackBarMsg,
            noOfItemsInCart: this.state.noOfItemsInCart - 1,
            cartTotalAmount: this.state.cartTotalAmount - cartItem.price
        });
    }

 /*user is not logged in hide the badge */
 toggleBadgeVisibility = (isBadgeVisible) => {
    this.setState({
        isBadgeVisible: isBadgeVisible
    });
}


    /*Add quantity of the items in cart */
    addItemToCart = (cartItem) => {
        cartItem.quantity++;
        cartItem.totalItemPrice = cartItem.quantity * cartItem.price;
        this.setState({
            showSnackbar: true,
            snackBarMsg: 'Item quantity increased by 1!',
            noOfItemsInCart: this.state.noOfItemsInCart + 1,
            cartTotalAmount: this.state.cartTotalAmount + cartItem.price
        });
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <Header pageId='details' baseUrl={this.props.baseUrl} toggleBadgeVisibility={this.toggleBadgeVisibility} />
                {/*Complete page with details with data of restaurant*/}
                {this.state.restaurantDetails.uuid &&
                    <div>
                        <div className='restaurant-info-container'>
                            <div className='image-section'>
                                {/*The restaurant image*/}
                                <img className='restaurant-img' src={this.state.restaurantDetails.photoURL} alt={this.state.restaurantDetails.restaurantName} />
                            </div>
                            {/*Details of the restaurant*/}
                            <div className='details-section'>
                                <Typography variant='h4' component='h4' className={classes.detail}>
                                    {this.state.restaurantDetails.restaurantName}
                                </Typography>
                                <Typography variant='subtitle2' component='p' className={classes.detail}>
                                    {this.state.restaurantDetails.locality}
                                </Typography>
                                <Typography variant='subtitle2' component='p' className={classes.detail}>
                                    {this.state.restaurantDetails.categoriesText}
                                </Typography>
                                {/*Show the ratings and no of customers for two */}
                                <div className='rating-price-container'>
                                    <div className='rating-section'>
                                        <Typography variant='subtitle1' component='p' className={classes.bold}>
                                            <FontAwesomeIcon icon={faStar} className='fa-star-icon' /> {this.state.restaurantDetails.customerRating}
                                        </Typography>
                                        <Typography variant='caption' component='p' className='caption-text'>
                                            AVERAGE RATING BY <span className='no-of-customers'>{this.state.restaurantDetails.noOfCustomersRated}</span> CUSTOMERS
                                    </Typography>
                                    </div>
                                    <div className='price-section'>
                                        <Typography variant='subtitle1' component='p' className={classes.bold}>
                                            <FontAwesomeIcon icon={faRupeeSign} /> {this.state.restaurantDetails.averagePrice}
                                        </Typography>
                                        <Typography variant='caption' component='p' className='caption-text'>
                                            AVERAGE COST FOR TWO PEOPLE
                                    </Typography>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id='items-checkout-container'>
                            {/*List of menu items available in the restaurant with their price*/}
                            <div className='items-container'>
                                {this.state.restaurantDetails.categories.map(category => (
                                    <div key={category.id}>
                                        {/*category name*/}
                                        <Typography className={classes.category}>
                                            <span className='category-name'>{category.category_name}</span>
                                        </Typography>
                                        <Divider />
                                        {category.item_list.map(item => (
                                            <div className='menu-item-section' key={item.id}>
                                                {/**
                                                 * Show the circle based on item type red(non veg)/green(veg)
                                                 */}
                                                {'VEG' === item.item_type && <FontAwesomeIcon icon={faCircle} className='fa-circle-green' />}
                                                {'NON_VEG' === item.item_type && <FontAwesomeIcon icon={faCircle} className='fa-circle-red' />}

                                                <Typography className={classes.menuItem}>
                                                    <span className='menu-item'>{item.item_name}</span>
                                                </Typography>
                                                {/*rupee symbol and the price of the item with a plus sign icon to add to cart*/}
                                                <span className='item-price wrap-white-space'>
                                                    <FontAwesomeIcon icon={faRupeeSign} className='fa-rupee' />{item.price.toFixed(2)}
                                                </span>
                                                <IconButton className={classes.addIcon} onClick={() => this.addItemClick(item)}><AddIcon /></IconButton>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                            <div className='cart-checkout-container'>
                                <Card variant='outlined' className='cart-checkout-card'>
                                    {/*Cart icon with My Cart Card header */}
                                    <CardHeader
                                        avatar={
                                            <Badge color='primary' badgeContent={this.state.noOfItemsInCart} showZero invisible={!this.state.isBadgeVisible} classes={{ anchorOriginTopRightRectangle: classes.badge }}>
                                                <ShoppingCartIcon fontSize='default' />
                                            </Badge>
                                        }
                                        title='My Cart'
                                        titleTypographyProps={{
                                            variant: 'h6'
                                        }}>
                                    </CardHeader>

                                    <CardContent>
                                        {this.state.cartItems.map(cartItem =>
                                            <div className='cart-menu-item-section' key={'cart' + cartItem.id}>
                                                {/*stop circle O based on item red(non veg)/green(veg)*/}
                                                {'VEG' === cartItem.item_type && <FontAwesomeIcon icon={faStopCircle} className='fa-circle-green' />}
                                                {'NON_VEG' === cartItem.item_type && <FontAwesomeIcon icon={faStopCircle} className='fa-circle-red' />}

                                                <Typography className={classes.cartMenuItem}>
                                                    <span className='cart-menu-item'>{cartItem.item_name}</span>
                                                </Typography>                                              
                                                <section className='item-quantity-section'>
                                                    <IconButton className={classes.minusBtn} onClick={() => this.removeItemFromCart(cartItem)}>
                                                        <FontAwesomeIcon icon={faMinus} className='plus-minus-icon' size='1x' />
                                                    </IconButton>
                                                    <span>{cartItem.quantity}</span>
                                                    <IconButton className={classes.plusBtn} onClick={() => this.addItemToCart(cartItem)}>
                                                        <FontAwesomeIcon icon={faPlus} className='plus-minus-icon' size='1x' />
                                                    </IconButton>
                                                </section>
                                                <span className='cart-item-price wrap-white-space'>
                                                    <FontAwesomeIcon icon={faRupeeSign} className='fa-rupee' />
                                                    {cartItem.totalItemPrice.toFixed(2)}
                                                </span>
                                            </div>
                                        )}

                                        <div className='total-amount'>
                                            <Typography>
                                                <span className='bold'>TOTAL AMOUNT</span>
                                            </Typography>
                                            <span className='bold wrap-white-space'>
                                                <FontAwesomeIcon icon={faRupeeSign} className='fa-rupee' />
                                                {this.state.cartTotalAmount.toFixed(2)}
                                            </span>
                                        </div>
                                    </CardContent>
                                    <Button variant='contained' color='primary' onClick={this.checkoutClick} fullWidth>Checkout</Button>
                                </Card>
                            </div>
                        </div>
                        {/*Snack bar at the bottom left of the page*/}
                        <Snackbar
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            open={this.state.showSnackbar}
                            autoHideDuration={10000}
                            onClose={this.handleClose}
                            TransitionComponent={this.state.transition}
                            message={this.state.snackBarMsg}
                            action={
                                /*close the snackbar*/
                                <React.Fragment>
                                    <IconButton size="small" aria-label="close" color="inherit" onClick={this.handleClose}>
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                </React.Fragment>
                            } />
                    </div>
                }
            </div>
        )
    }
}

export default withStyles(styles)(Details);