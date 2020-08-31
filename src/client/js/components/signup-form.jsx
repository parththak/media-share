import React from "react";
import "../../style/header.css";
import Validator from "validatorjs";
import { VALIDATION_RULES, CUSTOM_REGISTER_ERRORS } from "../constants";

class SignupForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      first: "",
      last: "",
      email: "",
      password: "",
      startedTyping_username: false,
      startedTyping_first: false,
      startedTyping_last: false,
      startedTyping_email: false,
      startedTyping_password: false,
    };
    this.updateEmail = this.updateEmail.bind(this);
    this.updateUserName = this.updateUserName.bind(this);
    this.updateFirst = this.updateFirst.bind(this);
    this.updateLast = this.updateLast.bind(this);
    this.updatePass = this.updatePass.bind(this);
    this.submitSignup = this.submitSignup.bind(this);
  }

  updateEmail(e) {
    this.setState({ email: e.target.value });
    if (this.state.startedTyping_email === false) {
      this.setState({ startedTyping_email: true });
    }
  }

  updateUserName(e) {
    this.setState({ username: e.target.value });
    if (this.state.startedTyping_username === false) {
      this.setState({ startedTyping_username: true });
    }
  }

  updateFirst(e) {
    this.setState({ first: e.target.value });
    if (this.state.startedTyping_first === false) {
      this.setState({ startedTyping_first: true });
    }
  }

  updateLast(e) {
    this.setState({ last: e.target.value });
    if (this.state.startedTyping_last === false) {
      this.setState({ startedTyping_last: true });
    }
  }

  updatePass(e) {
    this.setState({ password: e.target.value });
    if (this.state.startedTyping_password === false) {
      this.setState({ startedTyping_password: true });
    }
  }

  submitSignup(event) {
    event.preventDefault();
    this.props.register({
      variables: {
        username: this.state.username,
        first_name: this.state.first,
        last_name: this.state.last,
        email: this.state.email,
        password: this.state.password,
      },
    });
  }

  render() {
    let validation = new Validator(
      this.state,
      VALIDATION_RULES,
      CUSTOM_REGISTER_ERRORS
    );
    let invalid_form = validation.fails();
    // console.log(this.state);
    // console.log(invalid_form);
    // console.log(validation.errors);
    return (
      <div className="login-container">
        <div className="login-title" key="1">
          Sign Up!
        </div>
        <form key="2" onSubmit={(e) => this.submitSignup(e)}>
          <label>Username:</label>
          <input
            type="text"
            id="signup-username"
            placeholder="Enter username"
            onChange={this.updateUserName}
            required
            autoComplete="off"
          />
          {this.state.startedTyping_username === true &&
          validation.errors.get("username") ? (
            <div>
              {validation.errors.get("username").map((err, ind) => {
                return err;
              })}
            </div>
          ) : null}
          <label>First Name:</label>
          <input
            type="text"
            placeholder="Enter first name"
            onChange={this.updateFirst}
            required
          />
          {this.state.startedTyping_first === true &&
          validation.errors.get("first") ? (
            <div>
              {validation.errors.get("first").map((err, ind) => {
                return err;
              })}
            </div>
          ) : null}
          <label>Last Name:</label>
          <input
            type="text"
            placeholder="Enter last name"
            onChange={this.updateLast}
            required
          />
          {this.state.startedTyping_last === true &&
          validation.errors.get("last") ? (
            <div>
              {validation.errors.get("last").map((err, ind) => {
                return err;
              })}
            </div>
          ) : null}
          <label>Email:</label>
          <input
            type="text"
            id="signup-email"
            placeholder="Enter email"
            onChange={this.updateEmail}
            required
          />
          {this.state.startedTyping_email === true &&
          validation.errors.get("email") ? (
            <div>
              {validation.errors.get("email").map((err, ind) => {
                return err;
              })}
            </div>
          ) : null}
          <label>Password:</label>
          <input
            type="password"
            id="signup-pw"
            placeholder="Enter password"
            onChange={this.updatePass}
            required
            autoComplete="off"
          />
          {this.state.startedTyping_password === true &&
          validation.errors.get("password") ? (
            <div>
              {validation.errors.get("password").map((err, ind) => {
                return err;
              })}
            </div>
          ) : null}
          <button
            type="submit"
            disabled={invalid_form}
            className={
              invalid_form === true ? "submitbtn-disabled" : "submitbtn"
            }
            key="3"
          >
            Submit
          </button>
        </form>
      </div>
    );
  }
}

export default SignupForm;
