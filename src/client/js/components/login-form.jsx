import React from "react";
import "../../style/header.css";

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    };
    this.updateUserName = this.updateUserName.bind(this);
    this.updatePass = this.updatePass.bind(this);
    this.submitLogin = this.submitLogin.bind(this);
  }

  updateUserName(e) {
    this.setState({ username: e.target.value });
  }

  updatePass(e) {
    this.setState({ password: e.target.value });
  }

  submitLogin(event) {
    event.preventDefault();
    this.props.login({
      variables: {
        username: this.state.username,
        password: this.state.password
      }
    });
  }

  render() {
    return (
      <div className="login-container">
        <div className="login-title" key="4">
          Login!
        </div>
        <form key="5" onSubmit={e => this.submitLogin(e)}>
          <label>Username:</label>
          <input
            type="text"
            id="login-username"
            placeholder="Enter username"
            onChange={this.updateUserName}
          />
          <label>Password:</label>
          <input
            id="login-pw"
            type="password"
            placeholder="Enter password"
            onChange={this.updatePass}
          />
          <button type="submit" className="submit-btn" key="6">
            Submit
          </button>
        </form>
      </div>
    );
  }
}

export default LoginForm;
