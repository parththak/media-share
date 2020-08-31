import React from "react";
import "../../style/textchat.css";
import Message from "../containers/message";

class TextChat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lobbyName: this.props.lobbyName
        ? this.props.lobbyName // get lobby name from creation
        : window.location.href.substring(
            window.location.href.lastIndexOf("/") + 1 // get lobby name from last part of URL
          ),
      messages: [],
      socket: this.props.socket,
      currentMessage: "",
      lobbyUrl: this.props.lobbyUrl,
    };
    // add function binding here
    this.sendMessage = this.sendMessage.bind(this);
    this.allMessages = this.allMessages.bind(this);
    this.updateMessage = this.updateMessage.bind(this);
    this.toggleChat = this.toggleChat.bind(this);
  }

  scrollToBottom = () => {
    this.endOfMessages.scrollIntoView({ behavior: "smooth" });
  };

  componentDidMount() {
    this.state.socket.on("GetNewMessage", (data) => {
      this.props.unreadCounter();
      // console.log(data);
      let messages = this.state.messages;
      messages.push(data);
      this.setState({ messages: messages });
    });
    // this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }
  toggleChat() {
    this.setState({ showChat: !this.showChat });
  }

  sendMessage(e) {
    e.preventDefault();
    this.state.socket.emit("SendNewMessage", {
      username: this.props.loggedUser
        ? this.props.loggedUser.username
        : "Guest" + this.state.socket.id,
      room: this.state.lobbyName,
      message: this.state.currentMessage,
      datetime: new Date(),
      url: this.state.lobbyUrl,
    });
    this.setState({ currentMessage: "" });
  }

  allMessages() {
    return this.state.messages;
  }

  updateMessage(e) {
    this.setState({ currentMessage: e.target.value });
  }

  render(props) {
    let count = this.state.messages.length;
    return (
      <div key={132131} className="chat-container">
        <div className="chat-box" key={987654}>
          <div className="text-lobby" key={0}>
            {this.allMessages().map(function (msg, index) {
              return (
                <Message
                  message={msg}
                  // me={this.props.loggedUser}
                  key={100 + index}
                />
              );
            })}
            {/* Reference element below to autoscroll on new messages */}
            {/* From stack overflow: https://stackoverflow.com/a/41700815 */}
            <div
              ref={(el) => {
                this.endOfMessages = el;
              }}
            />
          </div>
          <form
            className="message-box"
            onSubmit={(e) => this.sendMessage(e)}
            key={1}
          >
            <input
                className="message-chat"
                type="text"
                value={this.state.currentMessage}
                name="message"
                onChange={this.updateMessage}
                autoComplete={"off"}
                required
                placeholder="Message"
            />
            <input type="submit" value="Submit" className="message-button" />
          </form>
        </div>
      </div>
    );
  }
}

export default TextChat;
