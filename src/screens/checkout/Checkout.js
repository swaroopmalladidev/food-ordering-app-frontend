import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import './Checkout.css';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { constants } from '../../common/Apiurls';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import PropTypes from 'prop-types';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import IconButton from '@material-ui/core/IconButton';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import Header from '../../common/header/Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStopCircle } from '@fortawesome/free-solid-svg-icons';
import { faRupeeSign } from '@fortawesome/free-solid-svg-icons';
import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';


const useStyles = makeStyles(theme => ({
    root: {
        width: '90%',
    },
    actionsContainer: {
        marginBottom: theme.spacing(2),
    },
    button: {
        marginRight: theme.spacing(1),
        marginTop: theme.spacing(1),
    },
    gridList: {
        transform: 'translateZ(0)',
        flexWrap: 'nowrap',
    },
    resetContainer: {
        padding: theme.spacing(3),
    },
    gridListAddresses: {
        flexWrap: 'wrap',
        display: 'flex',
        overflow: 'hidden',
        justifyContent: 'space-around'

    },
}));

const classes = useStyles;

const TabContainer = function (props) {
    return (
        <Typography component="div" style={{ padding: 0, textAlign: 'left' }}>
            {props.children}
        </Typography>
    )
}

TabContainer.propTypes = {
    children: PropTypes.node.isRequired
}

class Checkout extends Component {

    constructor(props) {
        super(props);

        this.myRef = [];
        this.myRefNew = [];

        if (sessionStorage.getItem('access-token') == null) {
            props.history.replace('/');
        }
        this.state = {
            modalIsOpen: false,
            value: 0,
            flatNoRequired: "dispNone",
            statesListRequired: "dispNone",
            localityRequired: "dispNone",
            cityRequired: "dispNone",
            pincodeRequired: "dispNone",
            stateListRequired: "dispNone",
            couponError: "dispNone",
            pinValid: "dispNone",
            flatNo: "",
            statesList: [],
            state_uuid: "",
            locality: "",
            city: "",
            pincode: "",
            snackMessage: "",
            couponCode: "",
            paymentMethods: [],
            addressList: [],
            message: "",
            address_id: "",
            payment_id: "",
            stepIndex: 0,
            saveAddress: false,
            finished: false,
            snackOpen: false,
            saveOrder: false,
            pinCheck: false,
            percent: 0,
            newTotal: this.props.location.state.total,
            subTotal: 0,
            discount: 0,
            coupon_id: "",
            style: {},
            loggedIn: sessionStorage.getItem("access-token") == null ? false : true,
            index: null
        }
        this.getExistingAddress();
        this.getPaymentMethods();
        this.getStatesList();
    }

    /* This method is used to handle changes between EXISTING ADDRESS and NEW ADDRESS. */
    tabChangeHandler = (event, value) => {
        this.setState({ value });
    }
    /* This method is used to set the state value in the State Select list. */
    statesChangeHandler = event => {
        this.setState({ state_uuid: event.target.value });
    }

    /* This method is used to set the value on change of the Coupon field. */
    inputCouponCodeChangeHandler = (e) => {
        this.setState({ couponCode: e.target.value });
    }
    /* This method is used to set the value on change of the City field. */
    inputCityChangeHandler = (e) => {
        this.setState({ city: e.target.value });
    }

    /* This method is used to set the value of the Pincode field. */
    inputPincodeChangeHandler = (e) => {
        this.setState({ pincode: e.target.value });
    }

    /* This method is used to select an payment method. */
    paymentMethodChangeHandler = (e) => {
        this.setState({ payment_id: e.target.value });
    };

    /* This method is used to set the value on change of the Flat / Building No. */
    inputFlatNoChangeHandler = (e) => {
        this.setState({ flatNo: e.target.value });
    }

    /* This method is used to select an address from the ADDRESS tab. */
    addressClickHandler = (addressId, indexNew) => {

        this.state.addressList.map((element, index) => {
            if (this.myRef[index].current != null) {
                this.myRef[index].current.style.border = "";
                this.myRef[index].current.style.borderColor = "";
                this.myRef[index].current.style.boxShadow = "";
            }
            if (this.myRefNew[index].current != null) {
                this.myRefNew[index].current.style.color = "";
            }
        })
        if (this.myRef[indexNew].current != null) {
            this.myRef[indexNew].current.style.border = "outset";
            this.myRef[indexNew].current.style.borderColor = "red";
            this.myRef[indexNew].current.style.boxShadow = "unset";
        }
        if (this.myRefNew[indexNew].current != null) {
            this.myRefNew[indexNew].current.style.color = "green";
        }
        this.setState({
            address_id: addressId,
            index: indexNew
        });
    }

    /* This method is used to set the value on change of the Locality field. */
    inputLocalityChangeHandler = (e) => {
        this.setState({ locality: e.target.value });
    }

    /* This method is used to move to the previous Step.*/
    handlePrev = () => {
        const { stepIndex } = this.state;
        if (stepIndex > 0) {
            this.setState({ stepIndex: stepIndex - 1 });
        }
    };

    handleNext = () => {
        if (this.state.address_id !== "" && this.state.address_id !== null) {
            let newstepIndex = this.state.stepIndex + 1;
            this.setState({
                finished: this.state.stepIndex >= 1,
                stepIndex: newstepIndex
            });
        }
    };

    /* This method is used to close the popup. */
    handleClose = () => {
        this.setState({
            snackOpen: false,
            snackMessage: ""
        })
    };

    /* This methos is used to reset. */
    handleReset = () => {
        const { stepIndex } = this.state;
        if (stepIndex > 0) {
            this.setState({ stepIndex: 0 });
        }
    };


    /* This method is used to get all the states.. */
    getStatesList = () => {
        let that = this;
        let url = `${constants.statesUrl}`;
        return fetch(url, {
            method: 'GET',
        }).then((response) => {
            return response.json();
        }).then((jsonResponse) => {
            that.setState({
                statesList: jsonResponse.states
            });
        }).catch((error) => {
            console.log('error fetching States List', error);
        });
    }

    /* This method is used to save an address of the logged in user. */
    saveAddressClickHandler = () => {
        this.state.flatNo === "" ? this.setState({ flatNoRequired: "dispBlock" }) : this.setState({ flatNoRequired: "dispNone" });
        this.state.locality === "" ? this.setState({ localityRequired: "dispBlock" }) : this.setState({ localityRequired: "dispNone" });
        this.state.city === "" ? this.setState({ cityRequired: "dispBlock" }) : this.setState({ cityRequired: "dispNone" });
        this.state.state_uuid === "" ? this.setState({ stateListRequired: "dispBlock" }) : this.setState({ stateListRequired: "dispNone" });
        this.state.pincode === "" ? this.setState({ pincodeRequired: "dispBlock" }) : this.setState({ pincodeRequired: "dispNone" });

        if ((this.state.flatNo === "") || (this.state.locality === "") || (this.state.city === "") || (this.state.state_uuid === "") || (this.state.pincode === "")) { return; }

        var pinValidation = /^\d{6}$/;

        if (pinValidation.test(String(this.state.pincode)) === false) {
            this.setState({
                pinValid: "dispBlock",
                pinCheck: false
            })
        }
        else {
            this.setState({
                pinValid: "dispNone",
                pinCheck: true
            })
        }

        if (this.state.pinCheck === true) {
            let saveAddressData = JSON.stringify({
                "city": this.state.city,
                "flat_building_name": this.state.flatNo,
                "locality": this.state.locality,
                "pincode": this.state.pincode,
                "state_uuid": this.state.state_uuid
            });
            let xhrSaveAddress = new XMLHttpRequest();
            let that = this;
            xhrSaveAddress.addEventListener("readystatechange", function () {
                if (this.readyState === 4 && this.status === 201) {
                    that.setState({
                        saveAddress: true,
                        snackOpen: true,
                        snackMessage: "Address saved successfully"
                    });
                    that.getExistingAddress();
                }
                if (this.readyState === 4 && this.status === 400) {
                    that.setState({
                        saveAddressErrordisp: "dispBlock",
                        saveAddressErrormessage: JSON.parse(this.responseText).message,
                        snackOpen: true,
                        snackMessage: "Unable to save address"
                    });
                }
                if (this.readyState === 4 && (this.status !== 400 && this.status !== 201)) {
                    that.setState({
                        saveAddressErrordisp: "dispBlock",
                        saveAddressErrormessage: JSON.parse(this.responseText).error,
                        snackOpen: true,
                        snackMessage: "Unable to save address"
                    });
                }
            });

            let url = `${constants.saveAddressUrl}`;

            xhrSaveAddress.open("POST", url);
            xhrSaveAddress.setRequestHeader("authorization", "Bearer " + sessionStorage.getItem("access-token"));
            xhrSaveAddress.setRequestHeader("Content-Type", "application/json");
            xhrSaveAddress.setRequestHeader("Cache-Control", "no-cache");
            xhrSaveAddress.send(saveAddressData);
        }
    }

    /* This method is used to get all the payment methods from the database. */
    getPaymentMethods = () => {
        let that = this;
        let url = `${constants.paymentMethodUrl}`;
        return fetch(url, {
            method: 'GET',
        }).then((response) => {
            return response.json();
        }).then((jsonResponse) => {
            that.setState({
                paymentMethods: jsonResponse.paymentMethods
            });
        }).catch((error) => {
            console.log('error fetching paymentMethods', error);
        });
    }

    /* This method is used to get all the addresses of the logged in user. */
    getExistingAddress = () => {
        let that = this;
        let url = `${constants.addressUrl}`;
        return fetch(url, {
            method: 'GET',
            headers: {
                'authorization': 'Bearer ' + sessionStorage.getItem("access-token")
            }
        }).then((response) => {
            return response.json();
        }).then((jsonResponse) => {
            if (jsonResponse.addresses === null) {
                this.setState({ message: "There are no saved addresses! You can save an address using the 'New Address' tab or using your 'Profile' menu option." })
            }
            if (jsonResponse.addresses !== null) {
                this.setState({ message: "" })
            }
            that.setState({
                addressList: jsonResponse.addresses
            });
        }).catch((error) => {
            console.log('error fetching addressList', error);
        });
    }


    renderStepActions(step) {
        return (
            <div style={{ margin: '12px 0' }}>
                <Button
                    disabled={this.state.stepIndex === 0}
                    onClick={this.handlePrev}
                    className={classes.button}
                >
                    Back
                  </Button>
                <Button
                    disabled={this.state.value === 1}
                    variant="contained"
                    color="primary"
                    onClick={this.handleNext}
                    className={classes.button}
                >
                    {this.state.stepIndex === 1 ? 'Finish' : 'Next'}
                </Button>
            </div>
        );
    }

    /* This method is used to place an order. */
    onPlaceOrderClickHandler = () => {
        let item_quantities = []
        if (this.props.location.state.items_list_new.length > 0) {
            this.props.location.state.items_list_new.forEach(function (item, index) {
                let itemNew = {}
                itemNew.item_id = item.id;
                itemNew.price = item.price;
                itemNew.quantity = item.count;
                item_quantities.push(itemNew);
            }, this);
        }

        let saveOrderData = JSON.stringify({
            "address_id": this.state.address_id,
            "bill": this.state.newTotal,
            "coupon_id": this.state.coupon_id,
            "discount": this.state.discount,
            "item_quantities": item_quantities,
            "payment_id": this.state.payment_id,
            "restaurant_id": this.props.location.state.restaurant_id
        });
        let xhrSaveOrder = new XMLHttpRequest();
        let that = this;
        xhrSaveOrder.addEventListener("readystatechange", function () {
            if (this.readyState === 4 && this.status === 201) {
                that.setState({
                    saveOrder: true,
                    snackOpen: true,
                    snackMessage: "Order placed successfully! Your order ID is " + JSON.parse(this.responseText).id
                });
            }
            if (this.readyState === 4 && this.status === 400) {
                that.setState({
                    saveAddressErrordisp: "dispBlock",
                    saveAddressErrormessage: JSON.parse(this.responseText).message,
                    snackOpen: true,
                    snackMessage: "Unable to place your order! Please try again!"
                });
            }
            if (this.readyState === 4 && (this.status !== 400 && this.status !== 201)) {
                that.setState({
                    saveAddressErrordisp: "dispBlock",
                    saveAddressErrormessage: JSON.parse(this.responseText).error,
                    snackOpen: true,
                    snackMessage: "Unable to place your order! Please try again!"
                });
            }
        });

        let url = `${constants.orderUrl}`;
        xhrSaveOrder.open("POST", url);
        xhrSaveOrder.setRequestHeader("authorization", "Bearer " + sessionStorage.getItem("access-token"));
        xhrSaveOrder.setRequestHeader("Content-Type", "application/json");
        xhrSaveOrder.setRequestHeader("Cache-Control", "no-cache");
        xhrSaveOrder.send(saveOrderData);
    }

    /* This method is used to apply a coupon when clicked on APPLY button. */
    applyCouponCodeClickHandler = () => {
        let value = this.state.couponCode;
        if (value !== null || value !== "") {
            let url = `${constants.couponUrl}/${value}`;
            return fetch(url, {
                method: 'GET',
                headers: {
                    'authorization': 'Bearer ' + sessionStorage.getItem("access-token")
                }
            }).then((response) => {
                return response.json();
            }).then((jsonResponse) => {
                if (jsonResponse.percent === null || jsonResponse.percent === "") {
                    this.setState({
                        snackOpen: true,
                        snackMessage: "No coupon with the given name",
                        newTotal: this.props.location.state.total,
                        subTotal: this.props.location.state.total,
                        discount: 0
                    })
                    return;
                }
                if (jsonResponse.percent !== null || jsonResponse.percent !== "") {
                    this.setState({
                        snackOpen: false,
                        snackMessage: "",
                        percent: jsonResponse.percent,
                        coupon_id: jsonResponse.id
                    })
                    let newsubTotal = this.props.location.state.total;
                    let newDiscount = (this.state.newTotal * this.state.percent) / 100;
                    let newTotalval = this.state.newTotal - newDiscount;
                    this.setState({
                        subTotal: newsubTotal,
                        discount: newDiscount,
                        newTotal: newTotalval
                    })
                }

            }).catch((error) => {
                console.log('error coupon data', error);
            });
        }
    }

    render() {
        const { finished } = this.state;
        return (
            <div>
                <Header
                    screen={"Checkout"}
                    history={this.props.history} />
                <div className="main-div">
                    <div style={{ width: '60%' }}>
                        <Stepper activeStep={this.state.stepIndex} orientation="vertical">
                            <Step>
                                <StepLabel>Delivery</StepLabel>
                                <StepContent>
                                    <Typography>
                                        <Tabs className="tabs" value={this.state.value} onChange={this.tabChangeHandler}>
                                            <Tab label="EXISTING ADDRESS" />
                                            <Tab label="NEW ADDRESS" />
                                        </Tabs>
                                        {this.state.message}
                                    </Typography>
                                    {this.state.value === 0 &&
                                        <TabContainer>
                                            <br />
                                            <div className={classes.gridListAddresses}>
                                                <GridList cols={3} className={classes.gridList}>
                                                    {this.state.addressList != null && this.state.addressList.map((address, index) => (
                                                        this.myRef[index] = React.createRef(),
                                                        this.myRefNew[index] = React.createRef(),
                                                        <GridListTile
                                                            style={this.state.style}
                                                            key={address.id} ref={this.myRef[index]}>
                                                            <div>{address.flat_building_name}</div>
                                                            <div>{address.locality}</div>
                                                            <div>{address.city}</div>
                                                            <div>{address.state.state_name}</div>
                                                            <div>{address.pincode}</div>
                                                            <IconButton style={this.state.styleIcon} ref={this.myRefNew[index]}>
                                                                <CheckCircleIcon className="tickIcon" onClick={() => this.addressClickHandler(address.id, index)} />
                                                            </IconButton>
                                                        </GridListTile>

                                                    ))}
                                                </GridList>
                                            </div>
                                            {/* <div>{this.state.message}</div> */}
                                        </TabContainer>
                                    }

                                    {this.state.value === 1 &&
                                        <TabContainer>
                                            <br />
                                            <FormControl style={{ marginBottom: '20px' }} required>
                                                <InputLabel htmlFor="Flat / Building No.">Flat / Building No.</InputLabel>
                                                <Input id="flatNo" type="text" flatNo={this.state.flatNo} onChange={this.inputFlatNoChangeHandler} />
                                                <FormHelperText className={this.state.flatNoRequired}>
                                                    <span className="red">required</span>
                                                </FormHelperText>
                                            </FormControl>
                                            <br />
                                            <FormControl style={{ marginBottom: '20px' }} required>
                                                <InputLabel htmlFor="Locality">Locality</InputLabel>
                                                <Input id="locality" type="text" locality={this.state.locality} onChange={this.inputLocalityChangeHandler} />
                                                <FormHelperText className={this.state.localityRequired}>
                                                    <span className="red">required</span>
                                                </FormHelperText>
                                            </FormControl>
                                            <br />
                                            <FormControl style={{ marginBottom: '20px' }} required>
                                                <InputLabel htmlFor="City">City</InputLabel>
                                                <Input id="city" type="text" city={this.state.city} onChange={this.inputCityChangeHandler} />
                                                <FormHelperText className={this.state.cityRequired}>
                                                    <span className="red">required</span>
                                                </FormHelperText>
                                            </FormControl>
                                            <br />
                                            <FormControl style={{ marginBottom: '20px' }} required>
                                                <InputLabel htmlFor="stateList">State</InputLabel>
                                                <Select
                                                    value={this.state.state_uuid}
                                                    onChange={this.statesChangeHandler}
                                                    style={{ width: '200px' }}
                                                >
                                                    {this.state.statesList.map(st => (
                                                        <MenuItem key={"state" + st.id} value={st.id}>
                                                            {st.state_name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                                <FormHelperText className={this.state.stateListRequired}>
                                                    <span className="red">required</span>
                                                </FormHelperText>
                                            </FormControl>

                                            <br />
                                            <FormControl style={{ marginBottom: '20px' }} required>
                                                <InputLabel htmlFor="Pincode">Pincode</InputLabel>
                                                <Input id="pincode" type="text" pincode={this.state.pincode} onChange={this.inputPincodeChangeHandler} />
                                                <FormHelperText className={this.state.pincodeRequired}>
                                                    <span className="red">required</span>
                                                </FormHelperText>

                                                <FormHelperText className={this.state.pinValid}>
                                                    <span className="red">Pincode must contain<br /> only numbers and must<br /> be 6 digits long</span>
                                                </FormHelperText>
                                            </FormControl>
                                            <br />
                                            <br />
                                            <Button variant="contained" color="secondary" onClick={this.saveAddressClickHandler}>SAVE ADDRESS</Button>
                                        </TabContainer>
                                    }
                                    {this.renderStepActions(0)}
                                </StepContent>

                            </Step>
                            <Step>
                                <StepLabel>Payment</StepLabel>
                                <StepContent>
                                    <FormControl>
                                        <FormLabel>Select Mode of Payment</FormLabel>
                                        <RadioGroup aria-label="payment" name="payment1" value={this.state.payment_id} onChange={this.paymentMethodChangeHandler}>
                                            {
                                                this.state.paymentMethods.map(method => (
                                                    <FormControlLabel key={"payment" + method.id} value={method.id} control={<Radio />} label={method.payment_name} />
                                                )
                                                )
                                            }
                                        </RadioGroup>

                                    </FormControl>
                                    {this.renderStepActions(1)}
                                </StepContent>
                            </Step>
                        </Stepper>
                        {finished && (
                            <Paper square elevation={0} className={classes.resetContainer}>
                                <Typography><b> View the summary & place your order now!</b></Typography>
                                <Button onClick={this.handleReset} className={classes.button}>
                                    CHANGE
          </Button>
                            </Paper>

                        )
                        }
                    </div>

                    <div style={{ width: '39%' }}>
                        <Card className="cardStyle">
                            <CardContent>
                                <br />
                                <div style={{ marginBottom: '10px', fontSize: '30px', padding: '2%' }}><b>Summary</b></div><br />
                                <div style={{ marginBottom: '10px', fontSize: '20px', padding: '2%' }}>{this.props.location.state.restaurant_name}</div><br />
                                <div style={{ marginBottom: '20px', padding: '2%', lineHeight: '1.5' }}>
                                    {this.props.location.state.items_list_new.map(it => (
                                        <div className="item-details" key={it.name}>
                                            <span style={{ align: 'left', width: "11%" }}>{it.item_type === "VEG" ? (<FontAwesomeIcon icon={faStopCircle} style={{ color: "green" }}></FontAwesomeIcon>) : (<FontAwesomeIcon icon={faStopCircle} style={{ color: "red" }}></FontAwesomeIcon>)}</span>
                                            <span style={{ align: 'left', width: "33%", color: "grey" }}>{it.name}</span>

                                            <span style={{ align: 'left', width: "11%", color: "grey" }}>{it.count}</span>

                                            <span style={{ align: 'left', width: "33%", color: "grey" }}><FontAwesomeIcon icon={faRupeeSign} ></FontAwesomeIcon>&nbsp;{it.price}</span>
                                        </div>

                                    ))}
                                </div>
                                <div style={{ marginBottom: '20px', padding: '2%' }}>
                                    <span>
                                        <FormControl style={{ backgroundColor: 'rgb(241, 231, 211)'}}>
                                            <InputLabel htmlFor="Coupon" style={{padding:'3%'}}>Coupon Code</InputLabel>
                                            <Input id="couponCode" type="text" couponCode={this.state.couponCode} onChange={this.inputCouponCodeChangeHandler} />
                                            <FormHelperText className={this.state.couponError}>
                                                <span className="red">required</span>
                                            </FormHelperText>
                                        </FormControl>
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    <Button className={classes.button} variant="contained" onClick={() => this.applyCouponCodeClickHandler()}>APPLY</Button><br />
                                        {this.state.percent > 0 && <div><br/>
                                            <div>Sub Total  <FontAwesomeIcon icon={faRupeeSign} ></FontAwesomeIcon>&nbsp;{this.state.subTotal}</div>
                                            <br />
                                            <div>Discount  <FontAwesomeIcon icon={faRupeeSign} ></FontAwesomeIcon>&nbsp;{this.state.discount}</div>


                                        </div>
                                        }
                                    </span>
                                </div>
                                <br />

                                <Divider variant="middle" />
                                <div className="item-details">
                                    <Divider variant="middle" />
                                    <br />
                                    <span style={{ align: 'left', width: "40%" }}><br /><b>Net Amount</b></span>
                                    <br />
                                    <span style={{ align: 'right', width: "40%" }}><br /><FontAwesomeIcon icon={faRupeeSign} ></FontAwesomeIcon>&nbsp;
                                    {this.state.newTotal}</span><br />
                                </div>
                                <div className="item-details" style={{ marginBottom: '20px', padding: '2%' }}>
                                    <Button style={{ width: "100%" }} variant="contained" onClick={() => this.onPlaceOrderClickHandler()} color="primary">PLACE ORDER</Button>
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
                    open={this.state.snackOpen} message={this.state.snackMessage}
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
        );
    };
}

export default Checkout;