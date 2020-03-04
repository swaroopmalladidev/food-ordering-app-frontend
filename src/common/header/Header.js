import React, { Component } from 'react';
import { constants } from '../Apiurls';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import SearchIcon from '@material-ui/icons/Search';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Modal from 'react-modal';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Snackbar from '@material-ui/core/Snackbar';
import MenuItem from "@material-ui/core/MenuItem";
import Popover from "@material-ui/core/Popover";
import './Header.css';

const customStyles = {
    content: {
        bottom: 'auto',
        top: '50%',
        right: 'auto',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        marginRight: '-50%'
    }
};

const HTabContainer = function (props) {
    return (
        <Typography component="div" style={{ padding: 0, textAlign: 'center' }}>
            {props.children}
        </Typography>
    )
}

class Header extends Component {

    constructor(props) {
        super(props);

        this.state = {
            modalIsOpen: false,
            message: null,
            search: "",
            value: 0,
            usernameRequired: "dispNone",
            loginPasswordRequired: "dispNone",
            firstnameRequired: "dispNone",
            emailRequired: "dispNone",
            registerPasswordRequired: "dispNone",
            contactRequired: "dispNone",
            emailValid: "dispNone",
            passwordValid: "dispNone",
            phoneValid: "dispNone",
            loginErrordisp: "dispNone",
            signupErrordisp: "dispNone",
            username: "",
            loginPassword: "",
            firstname: "",
            lastname: "",
            email: "",
            registerPassword: "",
            contact: "",
            loginErrormessage: "",
            signupErrormessage: "",
            registrationSuccess: false,
            emailCheck: false,
            passwordCheck: false,
            phoneCheck: false,
            snackOpen: false,
            popoverOpen: false,
            anchorEl: null,
            loggedIn: sessionStorage.getItem("access-token") == null ? false : true,
            uuid: sessionStorage.getItem("access-token") == null ? null : sessionStorage.getItem("access-token"),
            loginDisplay: sessionStorage.getItem("first_name") == null ? "LOGIN" : sessionStorage.getItem("first_name"),
            first_name: sessionStorage.getItem("first_name"),
            last_name: sessionStorage.getItem("last_name"),
            email_address: sessionStorage.getItem("email_address"),
            contact_number: sessionStorage.getItem("contact_number"),
            snackMessage: "Registered successfully! Please login now!",
        }

    }

    render() {
        const { screen } = this.props;
        return (
            <div>
                <header className="app-header">
                    <span style={{ width: "33%" }}>
                        <FastfoodIcon style={{ color: "white" }}></FastfoodIcon>
                    </span>
                    {screen === "Home" && (<span style={{ width: "33%" }}>
                        <SearchIcon style={{ color: "white", verticalAlign: "middle" }}>
                        </SearchIcon>
                        <Input id="search" name="search"
                            style={{ width: "220px", color: "white" }} type="text"
                            placeholder="Search by Restaurant Name" onChange={this.searchChangeHandler}>
                        </Input>
                    </span>)}
                    {screen !== "Home" && (<span style={{ width: "33%" }}></span>)}
                    <span style={{ width: "33%", textAlign: "right" }}>
                        {this.state.loggedIn === false && <Button variant="contained" onClick={this.openModalHandler} color="white">
                            <AccountCircleIcon></AccountCircleIcon>
                            {this.state.loginDisplay}
                        </Button>}
                        {this.state.loggedIn === true &&
                            <span style={{ verticalAlign: "middle" }}>
                                <AccountCircleIcon className="account-circle" onClick={this.openModalHandler}>

                                </AccountCircleIcon><span style={{ verticalAlign: "super", color: "white" }}>&nbsp;&nbsp;{this.state.loginDisplay}</span>
                                <Popover
                                    id="popover1"
                                    open={this.state.popoverOpen}
                                    anchorEl={this.state.anchorEl}
                                    onClose={this.handleClose}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'center',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'center',
                                    }}
                                >
                                    <div style={{ padding: "5px" }}>
                                        <div>
                                            <MenuItem onClick={this.handleProfile}>
                                                My Profile
                                    </MenuItem>
                                            <div className="hr" />
                                        </div>
                                        <MenuItem onClick={this.logoutHandler}>Logout</MenuItem>
                                    </div>
                                </Popover>
                            </span>}
                    </span>


                </header>
                <Modal
                    ariaHideApp={false}
                    isOpen={this.state.modalIsOpen}
                    contentLabel="Login"
                    onRequestClose={this.closeModalHandler}
                    style={customStyles}
                >
                    <Tabs className="tabs-header" value={this.state.value} onChange={this.tabChangeHandler}>
                        <Tab label="Login" />
                        <Tab label="Signup" />
                    </Tabs>

                    {this.state.value === 0 &&
                        <HTabContainer>
                            <FormControl required>
                                <InputLabel htmlFor="username">Contact No.</InputLabel>
                                <Input id="username" type="text" username={this.state.username} onChange={this.inputUsernameChangeHandler} />
                                <FormHelperText className={this.state.usernameRequired}>
                                    <span className="red">required</span>
                                </FormHelperText>
                            </FormControl>
                            <br /><br />
                            <FormControl required>
                                <InputLabel htmlFor="loginPassword">Password</InputLabel>
                                <Input id="loginPassword" type="password" loginpassword={this.state.loginPassword} onChange={this.inputLoginPasswordChangeHandler} />
                                <FormHelperText className={this.state.loginPasswordRequired}>
                                    <span className="red">required</span>
                                </FormHelperText>
                                <FormHelperText className={this.state.loginErrorDisp}>
                                    <span className="red">{this.state.loginErrormessage}</span>
                                </FormHelperText>
                            </FormControl>
                            <br /><br />
                            <br /><br />
                            <Button variant="contained" color="primary" onClick={this.loginClickHandler}>LOGIN</Button>
                        </HTabContainer>
                    }
                    {this.state.value === 1 &&
                        <HTabContainer>
                            <FormControl required>
                                <InputLabel htmlFor="firstname">First Name</InputLabel>
                                <Input id="firstname" type="text" firstname={this.state.firstname} onChange={this.inputFirstNameChangeHandler} />
                                <FormHelperText className={this.state.firstnameRequired}>
                                    <span className="red">required</span>
                                </FormHelperText>
                            </FormControl>
                            <br /><br />
                            <FormControl>
                                <InputLabel htmlFor="lastname">Last Name</InputLabel>
                                <Input id="lastname" type="text" lastname={this.state.lastname} onChange={this.inputLastNameChangeHandler} />
                            </FormControl>
                            <br /><br />
                            <FormControl required>
                                <InputLabel htmlFor="email">Email</InputLabel>
                                <Input id="email" type="text" email={this.state.email} onChange={this.inputEmailChangeHandler} />
                                <FormHelperText className={this.state.emailRequired}>
                                    <span className="red">required</span>
                                </FormHelperText>
                                <FormHelperText className={this.state.emailValid}>
                                    <span className="red">Invalid Email</span>
                                </FormHelperText>
                            </FormControl>
                            <br /><br />
                            <FormControl required>
                                <InputLabel htmlFor="registerPassword">Password</InputLabel>
                                <Input id="registerPassword" type="password" registerpassword={this.state.registerPassword} onChange={this.inputRegisterPasswordChangeHandler} />
                                <FormHelperText className={this.state.registerPasswordRequired}>
                                    <span className="red">required</span>
                                </FormHelperText>
                                <FormHelperText className={this.state.passwordValid}>
                                    <span className="red">Password must contain at least<br />  one capital
                                    letter, one<br /> small letter, one number, and<br /> one special character</span>
                                </FormHelperText>
                            </FormControl>
                            <br /><br />
                            <FormControl required>
                                <InputLabel htmlFor="contact">Contact No.</InputLabel>
                                <Input id="contact" type="text" contact={this.state.contact} onChange={this.inputContactChangeHandler} />
                                <FormHelperText className={this.state.contactRequired}>
                                    <span className="red">required</span>
                                </FormHelperText>
                                <FormHelperText className={this.state.phoneValid}>
                                    <span className="red">Contact No. must contain<br /> only numbers and must be<br /> 10 digits long</span>
                                </FormHelperText>
                                <FormHelperText className={this.state.signupErrorDisp}>
                                    <span className="red">{this.state.signupErrormessage}</span>
                                </FormHelperText>
                            </FormControl>
                            <br /><br />
                            <br /><br />
                            <Button variant="contained" color="primary" onClick={this.registerClickHandler}>SIGNUP</Button>
                        </HTabContainer>
                    }
                </Modal>

                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={this.state.snackOpen} message={this.state.snackMessage}
                    autoHideDuration={6000}
                    onClose={this.handleSnackClose}>
                </Snackbar>
            </div>
        )

    }

    /* This method is used to handle the search change. */
    searchChangeHandler = (e) => {
        const state = this.state
        state[e.target.name] = e.target.value
        this.setState(state)
        this.props.searchHandler(this.state.search)
    }

    /* This method is used to register an user on click the SIGNUP button. */
    registerClickHandler = () => {
        this.state.firstname === "" ? this.setState({ firstnameRequired: "dispBlock" }) : this.setState({ firstnameRequired: "dispNone" });
        this.state.email === "" ? this.setState({ emailRequired: "dispBlock" }) : this.setState({ emailRequired: "dispNone" });
        this.state.registerPassword === "" ? this.setState({ registerPasswordRequired: "dispBlock" }) : this.setState({ registerPasswordRequired: "dispNone" });
        this.state.contact === "" ? this.setState({ contactRequired: "dispBlock" }) : this.setState({ contactRequired: "dispNone" });
        if (this.state.firstname !== "" && this.state.email !== "" && this.state.registerPassword !== "" && this.state.contact !== "") {
            var emailValidation = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

            if (emailValidation.test(String(this.state.email).toLowerCase()) === false) {
                this.setState({
                    emailValid: "dispBlock",
                    emailCheck: false
                })
            }
            else {
                this.setState({
                    emailValid: "dispNone",
                    emailCheck: true
                })
            }

            var passwordValidation = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,20}$/;

            if (passwordValidation.test(String(this.state.registerPassword)) === false) {
                this.setState({
                    passwordValid: "dispBlock",
                    passwordCheck: false
                })
            }
            else {
                this.setState({
                    passwordValid: "dispNone",
                    passwordCheck: true
                })
            }

            var phoneValidation = /^\d{10}$/;

            if (phoneValidation.test(String(this.state.contact)) === false) {
                this.setState({
                    phoneValid: "dispBlock",
                    phoneCheck: false
                })
            }
            else {
                this.setState({
                    phoneValid: "dispNone",
                    phoneCheck: true
                })
            }

            if (this.state.emailCheck === true && this.state.passwordCheck === true && this.state.phoneCheck === true) {
                let dataSignup = JSON.stringify({
                    "email_address": this.state.email,
                    "first_name": this.state.firstname,
                    "last_name": this.state.lastname,
                    "contact_number": this.state.contact,
                    "password": this.state.registerPassword
                });

                let xhrSignup = new XMLHttpRequest();
                let that = this;
                xhrSignup.addEventListener("readystatechange", function () {
                    if (this.readyState === 4 && this.status === 201) {
                        that.setState({
                            registrationSuccess: true,
                            value: 0,
                            snackOpen: true
                        });
                    }

                    if (this.readyState === 4 && this.status === 400) {
                        that.setState({
                            signupErrordisp: "dispBlock",
                            signupErrormessage: JSON.parse(this.responseText).message
                        });
                    }
                    if (this.readyState === 4 && (this.status !== 400 && this.status !== 201)) {
                        that.setState({
                            signupErrordisp: "dispBlock",
                            signupErrormessage: JSON.parse(this.responseText).error
                        });
                    }
                });

                let regUrl = `${constants.registerUrl}`;
                xhrSignup.open("POST", regUrl);
                xhrSignup.setRequestHeader("Content-Type", "application/json");
                xhrSignup.setRequestHeader("Cache-Control", "no-cache");
                xhrSignup.send(dataSignup);
            }
        }
    }

    /* This method is used to close the Login and Signup popup. */
    closeModalHandler = () => {
        this.setState({ modalIsOpen: false });
    }


    /* This method is used to set the state when the Password field gets changed. */
    inputLoginPasswordChangeHandler = (e) => {
        this.setState({ loginPassword: e.target.value });
    }

    /* This method is used to set the state when the Contact field gets changed. */
    inputUsernameChangeHandler = (e) => {
        this.setState({ username: e.target.value });
    }


    /* This method is used to set the state when the First Name field gets changed. */
    inputFirstNameChangeHandler = (e) => {
        this.setState({ firstname: e.target.value });
    }

    /* This method is used to set the state when the Last Name field gets changed. */
    inputLastNameChangeHandler = (e) => {
        this.setState({ lastname: e.target.value });
    }

    /* This method is used to set the state when the Email field gets changed.*/
    inputEmailChangeHandler = (e) => {
        this.setState({ email: e.target.value });
    }

    /* This method is used to set the state when the Contact No. field gets changed. */
    inputContactChangeHandler = (e) => {
        this.setState({ contact: e.target.value });
    }

    /* This method is used to set the state when the Password field gets changed. */
    inputRegisterPasswordChangeHandler = (e) => {
        this.setState({ registerPassword: e.target.value });
    }


    /* This method is used to login an user by click the LOGIN button. */
    loginClickHandler = () => {
        this.state.username === "" ? this.setState({ usernameRequired: "dispBlock" }) : this.setState({ usernameRequired: "dispNone" });
        this.state.loginPassword === "" ? this.setState({ loginPasswordRequired: "dispBlock" }) : this.setState({ loginPasswordRequired: "dispNone" });

        if (this.state.username !== "" && this.state.loginPassword !== "") {
            let dataLogin = null;
            let xhrLogin = new XMLHttpRequest();
            let that = this;
            xhrLogin.addEventListener("readystatechange", function () {
                if (this.readyState === 4 && this.status === 200) {
                    sessionStorage.setItem("uuid", JSON.parse(this.responseText).id);
                    sessionStorage.setItem("access-token", xhrLogin.getResponseHeader("access-token"));
                    sessionStorage.setItem("first_name", JSON.parse(this.responseText).first_name);
                    sessionStorage.setItem("last_name", JSON.parse(this.responseText).last_name);
                    sessionStorage.setItem("email_address", JSON.parse(this.responseText).email_address);
                    sessionStorage.setItem("contact_number", JSON.parse(this.responseText).contact_number);

                    that.setState({
                        loggedIn: true,
                        loginDisplay: sessionStorage.getItem("first_name"),
                        first_name: sessionStorage.getItem("first_name"),
                        last_name: sessionStorage.getItem("last_name"),
                        email_address: sessionStorage.getItem("email_address"),
                        contact_number: sessionStorage.getItem("contact_number")
                    });

                    that.closeModalHandler();
                }
                if (this.readyState === 4 && this.status === 401) {
                    that.setState({
                        loginErrordisp: "dispBlock",
                        loginErrormessage: JSON.parse(this.responseText).message
                    });
                }
                if (this.readyState === 4 && (this.status !== 401 && this.status !== 200)) {
                    that.setState({
                        loginErrordisp: "dispBlock",
                        loginErrormessage: JSON.parse(this.responseText).error
                    });
                }
            });

            let loginUrl = `${constants.loginUrl}`;
            xhrLogin.open("POST", loginUrl);
            xhrLogin.setRequestHeader("authorization", "Basic " + window.btoa(this.state.username + ":" + this.state.loginPassword));
            xhrLogin.setRequestHeader("Content-Type", "application/json");
            xhrLogin.setRequestHeader("Cache-Control", "no-cache");
            xhrLogin.send(dataLogin);
        }
    }


    /* This method is used to handle the tab changes between Login and Signup. */
    tabChangeHandler = (event, value) => {
        this.setState({
            value,
            usernameRequired: "dispNone",
            loginPasswordRequired: "dispNone",
            firstnameRequired: "dispNone",
            emailRequired: "dispNone",
            registerPasswordRequired: "dispNone",
            contactRequired: "dispNone",
            emailValid: "dispNone",
            passwordValid: "dispNone",
            phoneValid: "dispNone",
            username: "",
            loginPassword: "",
            firstname: "",
            lastname: "",
            email: "",
            registerPassword: "",
            contact: "",
            emailCheck: false,
            passwordCheck: false,
            phoneCheck: false,
        });
    }
}

export default Header;