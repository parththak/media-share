import React from "react";

import "../../style/header.css";

class Confirmation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.leaveLobby = this.leaveLobby.bind(this);
    this.toggleConfirmation = this.toggleConfirmation.bind(this);
  }

  leaveLobby() {
    this.props.leaveLobby();
  }

  toggleConfirmation() {
    this.props.toggleConfirmation();
  }

  render() {
    return (
      <div className="confirmation-container">
        <div>Are you sure you want to leave the lobby?</div>
        <div className="button-container">
          <div className="btn noselect" onClick={this.leaveLobby}>
            Yes!
          </div>
          <div className="btn noselect" onClick={this.toggleConfirmation}>
            Cancel
          </div>
        </div>
      </div>
    );
  }
}

export default Confirmation;
