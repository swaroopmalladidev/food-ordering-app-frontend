import './Checkout.css';
import { Card, CardContent, CardHeader, withStyles } from '@material-ui/core';
import { faRupeeSign } from "@fortawesome/free-solid-svg-icons";
import { faStopCircle } from '@fortawesome/fontawesome-free-regular';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Redirect } from 'react-router';
import Button from '@material-ui/core/Button';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CloseIcon from '@material-ui/icons/Close';
import Divider from '@material-ui/core/Divider';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormLabel from '@material-ui/core/FormLabel';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Header from '../../common/header/Header';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import React, { Component } from 'react';
import Select from '@material-ui/core/Select';
import Snackbar from '@material-ui/core/Snackbar';
import Step from '@material-ui/core/Step';
import StepContent from '@material-ui/core/StepContent';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';


/**
 * 
 * @param {*} theme
 */
const styles = theme => ({   

    resetContainer: {
        padding: theme.spacing(3)
    },
    /*Action container in stepper */
    actionsContainer: {
        marginBottom: theme.spacing(2)
    },
    
      /*addresses*/
      gridList: {
        flexWrap: 'nowrap',       
        transform: 'translateZ(0)'
    },
    /*Margin and width for input controls*/
    formControl: {
        margin: theme.spacing(1),
        width: 200,
    },
  
   
     /*Coupon text box */
     textField: {
        backgroundColor: '#e8e8e8 !important',
        marginBottom: '20px'        
    },
     /*Border color for selected address */
     coloredBorder: {
        borderRadius: '5px',
        boxShadow: '2px 2px #e0265f',
        border: '2px solid #e0265f',        
        margin: '10px'
    },

    /*Align button icon */
    buttonAlign: {
        float: 'right'
    },
    /*Border when address is not selected */
    noBorder: {
        border: 'none',
        margin: '10px'
    },
    
    /*Set color to green */
    green: {
        color: 'green'
    },
  
    /*Bottom margin for button */
    buttonMargin: {
        marginTop: '20px'
    },
      /*Set color to grey */
      grey: {
        color: 'grey',
    },
    /*Margin for menu item */
    cartMenuItem: {
        marginLeft: '4%',
        width: '40%'
    },   
    /*Apply coupon button */
    applyBtn: {
        marginBottom: '20px'
    },
     
     button: {
        marginTop: theme.spacing(1),
        marginRight: theme.spacing(1),
    }
});

/**
 * 
 * @param {*} props 
 */
const TabContainer = function (props) {
    return (
        <Typography component='div' className="address-tab-container">
            {props.children}
        </Typography>
    );
}


class Checkout extends Component {
    constructor(props) {
        super(props);
        let restaurantName = null;       
        let restaurantID = null;
        let cartItems = null;
        
        if (props.location.state) {
            cartItems = props.location.state.cartItems;
            restaurantID = props.location.state.restaurantID;
            restaurantName = props.location.state.restaurantName;
        } else {
            cartItems = [];
            restaurantID = '';
            restaurantName = '';
        }
        /*All the required fields and values*/
        this.state = {            
            paymentModes: [],            
            customerAddresses: [],
            states: [],
            addressIsSelected: [],
            buildingNoRequired: 'dispNone',
            value: 0,
            steps: ['Delivery', 'Payment'],
            localityRequired: 'dispNone',
            cityRequired: 'dispNone',
            stateRequired: 'dispNone',
            pincodeRequired: 'dispNone',
            invalidPincode: 'dispNone',
            couponName: '',
            couponId: '',
            buildingNo: '',
            selectedPaymentId: '',
            selectedAddressId: '',
            locality: '',           
            city: '',            
            addressState: '',
            snackBarMsg: '',
            pincode: '',
            restaurantID: restaurantID,
            restaurantName: restaurantName,            
            selectedAddress: false,            
            cartItems: cartItems,
            cartTotalAmount: 0,           
            discountPercentage: 0,
            discount: 0,
            subTotal: 0,
            totalAmountWithoutDiscount: 0,
            showSnackbar: false,
            isUserLoggedIn: sessionStorage.getItem('access-token') !== null,
            cols: 3,
            activeStep: 0,            
        }
    }

    
    UNSAFE_componentWillMount() {
        
        if (this.props.location.state === undefined) {
            this.props.history.push({
                pathname: '/'
            })
        }
        /*Get the different payment methods */
        let that = this;
        let xhrData = new XMLHttpRequest();
        let data = null;
        xhrData.addEventListener("readystatechange", function () {            
            if (this.readyState === 4 && this.status === 200) {               
                that.setState({
                    paymentModes: JSON.parse(this.response).paymentMethods
                });
            }
        });
        xhrData.open("GET", this.props.baseUrl + '/payment');
        xhrData.send(data);       
        this.fetchSavedAddressesOfCustomer();
        // Get states details 
        let xhrDataStates = new XMLHttpRequest();
        xhrDataStates.addEventListener("readystatechange", function () {            
            if (this.readyState === 4 && this.status === 200) {
                //List of states.
                that.setState({
                    states: JSON.parse(this.response).states
                })
            }
        });
        xhrDataStates.open("GET", this.props.baseUrl + '/states');
        xhrDataStates.send(data);
    }


   /*Validating all mandatory field checks saves the address */
   saveAddressClickHandler = () => {        
    let cityRequired = 'dispNone';
    let buildingNoRequired = 'dispNone';
    let invalidPincode = 'dispNone';        
    let stateRequired = 'dispNone';
    let localityRequired = 'dispNone';
    let pincodeRequired = 'dispNone';
    let proceedToSaveAddress = true;
    

    // check for empty field validation, 
    if (this.state.buildingNo === '') {
        proceedToSaveAddress = false;
        buildingNoRequired = 'dispBlock';            
    }
    if (this.state.locality === '') {            
        proceedToSaveAddress = false;
        localityRequired = 'dispBlock';
    }
    if (this.state.city === '') {
        proceedToSaveAddress = false;
        cityRequired = 'dispBlock';            
    }
    if (this.state.pincode === '') {           
        proceedToSaveAddress = false;
        pincodeRequired = 'dispBlock';
    }
    if (this.state.addressState === '') {           
        proceedToSaveAddress = false;
        stateRequired = 'dispBlock';
    }

    let pincodePattern = new RegExp('^\\d{6}$');

    // Pincode is 6 digits or not
    if (this.state.pincode !== '' && !pincodePattern.test(this.state.pincode)) {
        //Invalid pincode message
        pincodeRequired = 'dispNone';
        proceedToSaveAddress = false;
        invalidPincode = 'dispBlock';           
    }

    // Validation messages based on the required fields.
    this.setState({
        buildingNoRequired: buildingNoRequired,
        localityRequired: localityRequired,
        cityRequired: cityRequired,
        stateRequired: stateRequired,
        pincodeRequired: pincodeRequired,
        invalidPincode: invalidPincode
    });

    // Submit the address to save in backend
    if (proceedToSaveAddress) {
        let xhr = new XMLHttpRequest();
        let thisComponent = this;
        xhr.addEventListener('readystatechange', function () {
            if (this.readyState === 4 && this.status === 201) {
                thisComponent.setState({ value: 0 });
                thisComponent.fetchSavedAddressesOfCustomer();
            }
        });
        // json request for address
        let addressData = JSON.stringify({
            "city": this.state.city,
            "flat_building_name": this.state.buildingNo,
            "locality": this.state.locality,
            "pincode": this.state.pincode,
            "state_uuid": this.state.addressState
        });
        // Save address endpoint
        xhr.open('POST', this.props.baseUrl + '/address');
        xhr.setRequestHeader('authorization', 'Bearer ' + sessionStorage.getItem('access-token'));
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(addressData);
    }
}



    /*Saved addresses for a customer*/
    fetchSavedAddressesOfCustomer = () => {
        let xhrDataAddress = new XMLHttpRequest();
        let thisComponent = this;
        xhrDataAddress.addEventListener("readystatechange", function () {            
            if (this.readyState === 4 && this.status === 200) {
                let addresses = JSON.parse(this.response).addresses;                
                if (addresses) {                   
                    thisComponent.setState({
                        customerAddresses: addresses
                    });
                }
                let addressIsSelectedInitial = [];
                for (var i = 0; i < thisComponent.state.customerAddresses.length; i++) {
                    addressIsSelectedInitial[i] = false;
                }
                thisComponent.setState({
                    addressIsSelected: addressIsSelectedInitial
                })
            }
        });
        xhrDataAddress.open("GET", this.props.baseUrl + '/address/customer');
        xhrDataAddress.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem('access-token'));
        xhrDataAddress.setRequestHeader("Content-Type", "application/json");
        xhrDataAddress.send();
    }

 
    /*Existing address and adding new address*/
    tabChangeHandler = (event, value) => {
        this.setState({ value });
        if (value === 1) {
            // New Address tab is selected.
            this.setState({
                buildingNo: '',
                locality: '',
                city: '',
                addressState: '',
                pincode: '',
                buildingNoRequired: 'dispNone',
                stateRequired: 'dispNone',
                localityRequired: 'dispNone',
                pincodeRequired: 'dispNone',
                invalidPincode: 'dispNone',
                cityRequired: 'dispNone', 
            })
        }
    }

    /*Checkbox for payment is selected */
    handleChangePayment = event => {
        this.setState({
            selectedPaymentId: event.target.value
        })
    };

    

    /*Stop submission of form*/
    handleSubmit = (event) => {
        event.preventDefault();
    }

 /*When a address is selected */
 addressSelectionHandler = (index) => {
    var addressIsSelectedChange = this.state.addressIsSelected;
    for (var j = 0; j < this.state.addressIsSelected.length; j++) {
        if (j === index) {
            addressIsSelectedChange[j] = true;
        } else {
            addressIsSelectedChange[j] = false;
        }
    }
    this.setState({
        addressIsSelected: addressIsSelectedChange,
        selectedAddress: true,
        selectedAddressId: this.state.customerAddresses[index].id
    })
}


    /*Selected/entered input value*/
    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    }

   

     /*Next tab*/
     handleNext = (index) => {
        var prevActiveStep = this.state.activeStep + 1;      
        if (index === 0) {
            if (this.state.selectedAddress === true) {
                this.setState({ activeStep: prevActiveStep })
            }
        } else if (index === 1) {
            if (this.state.selectedPaymentId !== '') {
                this.setState({ activeStep: prevActiveStep })
            }
        }
    };



    /*Get step content */
    getStepContent(step) {
        const { classes } = this.props;
        switch (step) {
            case 0:
                return <React.Fragment>
                    <Tabs className='address-tabs' value={this.state.value} onChange={this.tabChangeHandler}>
                        <Tab label='EXISTING ADDRESS' />
                        <Tab label='NEW ADDRESS' />
                    </Tabs>
                    {this.state.value === 0 && this.state.customerAddresses.length !== 0 &&
                        <TabContainer>
                            <div>
                                <GridList className={classes.gridList} cols={this.state.cols} spacing={2} cellHeight={"auto"}>
                                    {this.state.customerAddresses.map((address, index) => (
                                        <GridListTile key={address.id} className={(this.state.addressIsSelected[index] === true ? classes.coloredBorder : classes.noBorder)}
                                            onClick={() => this.addressSelectionHandler(index)}>
                                            <div className='grid-address'>
                                                <Typography variant="subtitle1" component="p">{address.flat_building_name}</Typography>
                                                <Typography variant="subtitle1" component="p">{address.locality}</Typography>
                                                <Typography variant="subtitle1" component="p">{address.city}</Typography>
                                                <Typography variant="subtitle1" component="p">{address.state.state_name}</Typography>
                                                <Typography variant="subtitle1" component="p">{address.pincode}</Typography>
                                                <div className={classes.buttonAlign}>
                                                    <IconButton className={this.state.addressIsSelected[index] !== true ? classes.grey : classes.green}
                                                        aria-label="checkCircle" onClick={() => this.addressSelectionHandler(index)}>
                                                        <CheckCircleIcon />
                                                    </IconButton>
                                                </div>
                                            </div>
                                        </GridListTile>
                                    ))}
                                </GridList>
                            </div>
                        </TabContainer>
                    }
                    {this.state.value === 0 && this.state.customerAddresses.length === 0 &&
                        <TabContainer>
                            <Typography variant="body1" className={classes.noAddress}>There are no saved addresses! You can save an address using the &apos;New Address&apos; tab or using your &lsquo;Profile&rsquo; menu option.</Typography>
                        </TabContainer>
                    }
                    {/*Save Address form */}
                    <form onSubmit={this.handleSubmit}>
                        {this.state.value === 1 &&
                            <TabContainer>
                                <FormControl className={classes.formControl} required>
                                    <InputLabel htmlFor='buildingNo'>Flat / Building No.</InputLabel>
                                    <Input id='buildingNo' type='text' onChange={this.handleChange('buildingNo')} value={this.state.buildingNo} fullWidth />
                                    <FormHelperText className={this.state.buildingNoRequired}>
                                        <span className='red'>required</span>
                                    </FormHelperText>
                                </FormControl>
                                <br />
                                <FormControl className={classes.formControl} required>
                                    <InputLabel htmlFor='locality'>Locality</InputLabel>
                                    <Input id='locality' type='text' onChange={this.handleChange('locality')} value={this.state.locality} fullWidth />
                                    <FormHelperText className={this.state.localityRequired}>
                                        <span className='red'>required</span>
                                    </FormHelperText>
                                </FormControl>
                                <br />
                                <FormControl className={classes.formControl} required>
                                    <InputLabel htmlFor='city'>City</InputLabel>
                                    <Input id='city' type='text' onChange={this.handleChange('city')} value={this.state.city} fullWidth />
                                    <FormHelperText className={this.state.cityRequired}>
                                        <span className='red'>required</span>
                                    </FormHelperText>
                                </FormControl>
                                <br />
                                {/*Shows the list of all states*/}
                                <FormControl className={classes.formControl} required>
                                    <InputLabel htmlFor='addressState'>State</InputLabel>
                                    <Select
                                        value={this.state.addressState}
                                        onChange={this.handleChange('addressState')}
                                        inputProps={{
                                            name: 'addressState',
                                            id: 'addressState',
                                        }} fullWidth>
                                        {this.state.states.map(locState =>
                                            <MenuItem key={locState.id} value={locState.id}>{locState.state_name}</MenuItem>
                                        )}
                                    </Select>
                                    <FormHelperText className={this.state.stateRequired}>
                                        <span className='red'>required</span>
                                    </FormHelperText>
                                </FormControl>
                                <br />
                                {/*Pincode is empty/not 6 digits, Error message*/}
                                <FormControl className={classes.formControl} required>
                                    <InputLabel htmlFor='pincode'>Pincode</InputLabel>
                                    <Input id='pincode' type='text' onChange={this.handleChange('pincode')} value={this.state.pincode} fullWidth />
                                    <FormHelperText className={this.state.pincodeRequired}>
                                        <span className='red'>required</span>
                                    </FormHelperText>
                                    <FormHelperText className={this.state.invalidPincode}>
                                        <span className='red'>Pincode must contain only numbers and must be 6 digits long</span>
                                    </FormHelperText>
                                </FormControl>
                                <br />
                                <br />
                                <Button variant="contained" color="secondary" onClick={this.saveAddressClickHandler}>
                                    Save Address
                            </Button>
                            </TabContainer>
                        }
                    </form>
                </React.Fragment >;
            case 1:
                return (
                    <FormControl component="fieldset">
                        <FormLabel>Select Mode of Payment</FormLabel>
                        <RadioGroup defaultValue={this.state.paymentModes.payment_name} aria-label="paymentModes" name="paymentModes" id='handleChangePayment' onChange={this.handleChangePayment}>
                            {this.state.paymentModes.map((payment) => (
                                <FormControlLabel key={payment.id} value={payment.id} control={<Radio />} label={payment.payment_name} checked={this.state.selectedPaymentId === payment.id} />))
                            }
                        </RadioGroup>
                    </FormControl>)
            default:
                return 'Unknown step';
        }
    }

   
   /* Click of 'Change' Button */
   handleReset = () => {
    this.setState({ activeStep: 0 });
};


    /* Previous step */
    handleBack = () => {
        var prevActiveStep = this.state.activeStep - 1;
        this.setState({ activeStep: prevActiveStep })
    };

 
    /*All the elements on the page are rendered, it is used to set state for cartItems*/
    componentDidMount() {
        // Update the cart total amount
        if (this.state.cartItems) {
            let cartTotalAmount = 0;
            this.state.cartItems.forEach(cartItem => {
                cartTotalAmount += cartItem.totalItemPrice;
            });
            // Total amount without discount.
            this.setState({
                cartTotalAmount: cartTotalAmount,
                totalAmountWithoutDiscount: cartTotalAmount
            })
        }        
        window.addEventListener('resize', this.updateGridViewCols);
    }

   /* Three addresses in large view and two in small view */
   updateGridViewCols = () => {
    if (window.innerWidth <= 650) {
        this.setState({ cols: 2 });
    } else {
        this.setState({ cols: 3 });
    }
}

    /* When the component is about to unmount */
    componentWillUnmount() {
        window.removeEventListener('resize', this.updateGridViewCols);
    }

 

        /* Show snackbar error message if it is not entered or an invalid coupon */
        applyButtonHandler = () => {        
            if (this.state.couponName === '') {
                this.setState({
                    showSnackbar: true,
                    snackBarMsg: 'Please provide a Coupon Code to apply!'
                });
                return;
            }       
            let that = this;        
            let data = null;
            let xhrCoupon = new XMLHttpRequest();
            xhrCoupon.addEventListener("readystatechange", function () {           
                if (this.readyState === 4 && this.status === 200) {                
                    that.setState({
                        discountPercentage: JSON.parse(this.response).percent
                    });               
                    let discountCal = (that.state.totalAmountWithoutDiscount * that.state.discountPercentage) / 100;
                    let priceAfterDiscount = that.state.totalAmountWithoutDiscount - discountCal;
                    that.setState({
                        subTotal: that.state.totalAmountWithoutDiscount,
                        discount: discountCal,
                        cartTotalAmount: priceAfterDiscount,
                        couponId: JSON.parse(this.response).id,
                        showSnackbar: true,
                        snackBarMsg: 'Coupon applied Successfully!',
                    });
                }
                else if (this.readyState === 4 && this.status !== 200) {                
                    that.setState({
                        showSnackbar: true,
                        snackBarMsg: JSON.parse(this.response).message,
                        netAmount: that.state.totalAmountWithoutDiscount,
                        discountPercentage: 0,
                        discount: 0,
                        couponId: '',
                        cartTotalAmount: that.state.totalAmountWithoutDiscount
                    });
    
                }
            });
            xhrCoupon.open("GET", this.props.baseUrl + '/order/coupon/' + this.state.couponName);
            xhrCoupon.setRequestHeader('authorization', 'Bearer ' + sessionStorage.getItem('access-token'));
            xhrCoupon.setRequestHeader("Content-Type", "application/json");
            xhrCoupon.send(data);
    
        }



    /* When coupon code is changed  */
    couponChangeHandler = (event) => {
        this.setState({ couponName: event.target.value });
    }



 /* Go to home after placing the order successfully */
 delayRedirect = (event) => {
    const { history: { push } } = this.props;
    setTimeout(() => push('/'), 10000);
}


    /* When place order button is clicked */
    checkoutClickHandler = (event) => {        
        if (this.state.selectedAddressId !== '' && this.state.selectedPaymentId !== '') {
            let that = this;
            let xhrCheckOut = new XMLHttpRequest();
            var itemsInCart = [];
            var saveOrderRequest = null;
            for (var k = 0; k < this.state.cartItems.length; k++) {
                var Item = {
                    "item_id": this.state.cartItems[k].id,
                    "price": this.state.cartItems[k].price,
                    "quantity": this.state.cartItems[k].quantity
                }
                itemsInCart[k] = Item;
            }
            /* json request for order Request */
            if (this.state.couponName && this.state.discount !== 0) {
                saveOrderRequest = JSON.stringify({
                    "address_id": this.state.selectedAddressId,
                    "bill": this.state.cartTotalAmount,
                    "coupon_id": this.state.couponId,
                    "discount": this.state.discount,
                    "item_quantities": itemsInCart,
                    "payment_id": this.state.selectedPaymentId,
                    "restaurant_id": this.state.restaurantID
                });
            } else {
                saveOrderRequest = JSON.stringify({
                    "address_id": this.state.selectedAddressId,
                    "bill": this.state.cartTotalAmount,
                    "item_quantities": itemsInCart,
                    "payment_id": this.state.selectedPaymentId,
                    "restaurant_id": this.state.restaurantID,
                });
            }
            xhrCheckOut.addEventListener("readystatechange", function () {                
                if (this.readyState === 4 && this.status === 201) {                    
                    that.setState({
                        showSnackbar: true,
                        snackBarMsg: 'Order placed successfully! Your order ID is ' + JSON.parse(this.response).id + '.'
                    });                    
                    that.delayRedirect(event);
                }
                else if (this.readyState === 4 && this.status !== 201) {
                    that.setState({
                        showSnackbar: true,
                        snackBarMsg: 'Unable to place your order! Please try again!'
                    });
                }
            });
            xhrCheckOut.open("POST", this.props.baseUrl + '/order');
            xhrCheckOut.setRequestHeader('authorization', 'Bearer ' + sessionStorage.getItem('access-token'));
            xhrCheckOut.setRequestHeader("Content-Type", "application/json");
            xhrCheckOut.send(saveOrderRequest);
        }  
        else {
            this.setState({
                showSnackbar: true,
                snackBarMsg: 'Please select Delivery and Payment Option before Placing an Order !'
            });
        }
    }

   

  /* When logout is clicked in header and successful logout */
  updateLoginStatus = () => {
    this.setState({ isUserLoggedIn: false });
}

    /* Snackbar */
    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        } 
        this.setState({ showSnackbar: false, snackBarMsg: '' });
    }

  

    render() {
        const { classes } = this.props;
        return (
            <div>
                {/* Home page on logout */}
                {!this.state.isUserLoggedIn && <Redirect to='/' />}                
                <Header pageId='checkout' baseUrl={this.props.baseUrl} updateLoginStatus={this.updateLoginStatus} />
                <div className='checkout-container'>
                    <div className="stepper-section">
                        <Stepper activeStep={this.state.activeStep} orientation="vertical">
                            {this.state.steps.map((label, index) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                    <StepContent>
                                        {this.getStepContent(index)}
                                        <div className={classes.actionsContainer}>
                                            <div className={classes.buttonMargin}>
                                                <Button
                                                    disabled={this.state.activeStep === 0}
                                                    onClick={this.handleBack}
                                                    className={classes.button}
                                                >
                                                    Back
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => this.handleNext(index)}
                                                    className={classes.button}
                                                >
                                                    {this.state.activeStep === this.state.steps.length - 1 ? 'Finish' : 'Next'}
                                                </Button>
                                            </div>
                                        </div>
                                    </StepContent>
                                </Step>
                            ))}
                        </Stepper>
                        {this.state.activeStep === this.state.steps.length && this.state.selectedPaymentId !== '' && (
                            <Paper square elevation={0} className={classes.resetContainer}>
                                <Typography variant="subtitle1" component="p">View the summary and place your order now!</Typography>
                                <Button onClick={this.handleReset} className={classes.button}>
                                    Change
                        </Button>
                            </Paper>
                        )}
                    </div>
                    <div className='checkout-cart-container'>
                        <Card variant='outlined' className='checkout-cart-card'>
                            {/* Card header with Summary text */}
                            <CardHeader
                                title='Summary'
                                titleTypographyProps={{
                                    variant: 'h5'
                                }}>
                            </CardHeader>
                            <CardContent>
                                <Typography variant='h6' component='h6' gutterBottom className='checkout-restaurant-name'>
                                    {this.state.restaurantName}
                                </Typography>
                                {this.state.cartItems.map(cartItem =>
                                    <div className='checkout-menu-item-section' key={'checkout' + cartItem.id}>
                                        {/*Stop circle O based color red(non veg)/green(veg)
                                         */}
                                        {'VEG' === cartItem.item_type && <FontAwesomeIcon icon={faStopCircle} className='fa-circle-green' />}
                                        {'NON_VEG' === cartItem.item_type && <FontAwesomeIcon icon={faStopCircle} className='fa-circle-red' />}

                                        <Typography className={classes.cartMenuItem}>
                                            <span className='checkout-menu-item color-gray'>{cartItem.item_name}</span>
                                        </Typography>
                                        {/* Show the quantity of the item */}
                                        <section className='checkout-item-quantity-section color-gray'>
                                            <span>{cartItem.quantity}</span>
                                        </section>
                                        {/* Rupee symbol and the price of the item */}
                                        <span className='checkout-item-price wrap-white-space color-gray'>
                                            <FontAwesomeIcon icon={faRupeeSign} className='fa-rupee' />
                                            {cartItem.totalItemPrice.toFixed(2)}
                                        </span>
                                    </div>
                                )}
                                {/* Coupon section for the user to apply any valid coupons */}
                                <div className='coupon-area'>
                                    <div className='coupon-content'>
                                        <TextField id="coupon-code" label="Coupon Code" variant="filled" onChange={this.couponChangeHandler} className={classes.textField} placeholder='Ex: FLAT30' />
                                        <Button variant="contained" onClick={this.applyButtonHandler} className={classes.applyBtn}>
                                            APPLY
                                        </Button>
                                    </div>
                                    {/* When the coupon is valid and applied successfully */}
                                    {this.state.discountPercentage !== 0 &&
                                        <div className="discount-text-container">
                                            <div className="discount-text wrap-white-space">
                                                <Typography className='discount-item-text-checkout'>Sub Total</Typography>
                                                <span className='cart-item-price-checkout wrap-white-space'>
                                                    <FontAwesomeIcon icon={faRupeeSign} className='fa-rupee' />
                                                    {this.state.subTotal.toFixed(2)}
                                                </span>
                                            </div>
                                            <div className="discount-text">
                                                <Typography className='discount-item-text-checkout wrap-white-space'>Discount</Typography>
                                                <span className='cart-item-price-checkout wrap-white-space'>
                                                    <FontAwesomeIcon icon={faRupeeSign} className='fa-rupee' />
                                                    {this.state.discount.toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    }
                                </div>
                                <Divider />
                                {/* Total amount of the cart, price of all items together */}
                                <div className='checkout-total-amount'>
                                    <Typography>
                                        <span className='bold'>Net Amount</span>
                                    </Typography>
                                    <span className='bold wrap-white-space'>
                                        <FontAwesomeIcon icon={faRupeeSign} className='fa-rupee' />
                                        {this.state.cartTotalAmount.toFixed(2)}
                                    </span>
                                </div>
                                <Button variant='contained' color='primary' onClick={this.checkoutClickHandler} fullWidth>Place Order</Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>               
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={this.state.showSnackbar}
                    autoHideDuration={20000}
                    onClose={this.handleClose}
                    TransitionComponent={this.state.transition}
                    message={this.state.snackBarMsg}
                    action={                       
                        <React.Fragment>
                            <IconButton size="small" aria-label="close" color="inherit" onClick={this.handleClose}>
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </React.Fragment>
                    } />
            </div>
        );
    }
}

export default withStyles(styles)(Checkout);