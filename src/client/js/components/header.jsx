import React from "react";
import Login from "../pages/login";
import Register from "../pages/register";
import LogoutButton from "../containers/logout-button";
import Confirmation from "./confirmation";
import "../../style/header.css";

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayLogin: false,
      displaySignup: false,
      displayConfirmation: false,
      lobbyName: null,
      hostName: null,
    };
    this.toggleLoginStatus = this.toggleLoginStatus.bind(this);
    this.toggleLoginForm = this.toggleLoginForm.bind(this);
    this.toggleSignupForm = this.toggleSignupForm.bind(this);
    this.toggleConfirmation = this.toggleConfirmation.bind(this);
    this.toggleBrowsing = this.toggleBrowsing.bind(this);
    this.leaveLobby = this.leaveLobby.bind(this);
    this.goToMyProfile = this.goToMyProfile.bind(this);
    this.goHome = this.goHome.bind(this);
    this.checkInLobby = this.checkInLobby.bind(this);
    this.checkWhereToGo = this.checkWhereToGo.bind(this);
  }

  toggleLoginStatus() {
    // this.props.toggleLogin();
    this.setState({ current_user: null });
  }

  toggleBrowsing() {
    this.props.toggleBrowsing();
  }

  leaveLobby() {
    this.props.leaveLobby();
    this.toggleConfirmation();
  }

  toggleConfirmation() {
    const inLobby = this.props.inLobby;
    if (inLobby) {
      this.setState({
        displayConfirmation: !this.state.displayConfirmation,
      });
    } else {
      this.toggleBrowsing();
    }
  }

  toggleLoginForm() {
    this.setState({
      displaySignup: false,
      displayLogin: !this.state.displayLogin,
    });
  }

  toggleSignupForm() {
    this.setState({
      displaySignup: !this.state.displaySignup,
      displayLogin: false,
    });
  }

  goToMyProfile() {
    this.props.goToProfile(this.props.current_user.username);
  }

  goHome() {
    this.props.goHome();
  }

  checkInLobby() {
    return window.location.href.includes("lobby");
  }

  checkWhereToGo() {
    // clicking home button
    // console.log(this.checkInLobby());
    if (this.checkInLobby()) {
      this.toggleConfirmation();
    } else {
      this.goHome();
    }
  }

  render() {
    const loggedIn = this.props.loggedIn;
    const inLobby = this.props.inLobby;
    const browsing = this.props.browsing;
    const showSignupForm = this.state.displaySignup;
    const showLoginForm = this.state.displayLogin;
    const displayConfirmation = this.state.displayConfirmation;
    return (
      <div className="header-container">
        <div
          id="main-logo"
          className="header-logo"
          onClick={this.checkWhereToGo}
        />
        {inLobby || browsing ? (
          <div className="btn noselect home" onClick={this.toggleConfirmation}>
            Home
          </div>
        ) : (
          <div className="btn noselect home" onClick={this.toggleBrowsing}>
            Browse
          </div>
        )}
        {displayConfirmation && inLobby ? (
          <Confirmation
            leaveLobby={this.leaveLobby}
            toggleConfirmation={this.toggleConfirmation}
          />
        ) : null}
        {inLobby ? (
          // Link goes where the share button is. Omitted noselect so that user could copy paste
          <div className="btn share">Share</div>
        ) : null}
        {loggedIn
          ? // <div className="btn noselect" onClick={this.updateLogin}>Logout</div>
            [
              this.props.current_user ? (
                <div className="profile-logout-container" key={333333333}>
                  <div
                    id="logged-in-user-icon"
                    key="11"
                    onClick={() => this.goToMyProfile()}
                  >
                    <div className="user-icon" />
                    {this.props.current_user.username}
                  </div>
                  <LogoutButton
                    key="12"
                    className="btn noselect"
                    onClick={this.toggleLoginStatus}
                  />
                </div>
              ) : null,
            ]
          : [
              <div className="login-signup-container" key={124543}>
                <div
                  key="1"
                  className="btn noselect"
                  onClick={this.toggleSignupForm}
                >
                  Sign Up
                </div>

                <div
                  key="2"
                  className="btn noselect"
                  onClick={this.toggleLoginForm}
                >
                  Login
                </div>
              </div>,
            ]}
        {!loggedIn ? (
          showSignupForm ? (
            <Register />
          ) : showLoginForm ? (
            <Login />
          ) : null
        ) : null}
      </div>
    );
  }
}

export default Header;
