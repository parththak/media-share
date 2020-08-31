import React from "react";
import "../../style/textchat.css";
import Linkify from "react-linkify";

class Message extends React.Component {
  render() {
    // let me = this.props.me;
    // ^ Render diff type of messsage if message is my own or someone else's

    let message = this.props.message;
    // get date
    let date = new Date(message.datetime);
    let month = (date.getMonth() + 1).toString();
    let day = date.getDate().toString();
    let year = date.getFullYear().toString();
    // get time & format to 2 digits HH:MM AM/PM
    let hour = date.getHours();
    let PM = hour >= 12;
    hour = ("0" + (hour % 12 || 12)).slice(-2);

    let mins = date.getMinutes();
    mins = ("0" + mins).slice(-2);
    // let seconds = date.getSeconds();
    // seconds = ("0" + seconds).slice(-2);

    return (
      <div>
        {/* <img id="Avatar"/> */}
        {/* <label id="sender-username">{this.state.username}:</label>
          <label id="sender-message">{this.state.message}</label> */}
        <Linkify
          className="full-message"
          properties={{
            target: "_blank",
            style: { color: "red", fontWeight: "bold" },
          }}
          >
          <div className="full-message">
            <div className="main-message"><b>{message.user}</b>: {message.msg}</div>
            <div className="message-tags">
              {`${month}/${day}/${year}`}
              <br></br>
              {`${hour}:${mins} ${PM ? "PM" : "AM"}`}
            </div>
          </div>
        </Linkify>
        {/* <div >{this.state.message}</div> */}
      </div>
    );
  }
}

export default Message;
