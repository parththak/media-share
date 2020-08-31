import React from "react";
import "../../style/mainlobby.css";
import VideoChat from "./videoChat";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import VideoPlayer from "./videoPlayer";
import TextChat from "./textChat";
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";
import { Query } from "react-apollo";
import Login from "../pages/login";
import gql from "graphql-tag";

class MainLobby extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lobbyName: this.props.lobbyName
        ? this.props.lobbyName // get lobby name from creation
        : window.location.href.substring(
            window.location.href.lastIndexOf("/") + 1 // get lobby name from last part of URL
          ),
      lobbyUrl: this.props.url + "/" + this.props.name,
      messages: [],
      socket: this.props.socket,
      currentMessage: "",
      isHost: false,
      host: "",
      users: {},
      showChat: true,
      unreadMessages: 0,
      loggedUser: this.props.loggedUser,
      screenShare: false,
      screenShareMedia: null,
    };
    // add function binding here
    this.loadMessages = this.allMessages.bind(this);
    this.updateMessage = this.updateMessage.bind(this);
    this.toggleChat = this.toggleChat.bind(this);
    this.newUnreadMessage = this.newUnreadMessage.bind(this);
    this.changeChatVisibility = this.changeChatVisibility.bind(this);
    this.getLobbyInfoQuery = this.getLobbyInfoQuery.bind(this);
    this.startScreenShare = this.startScreenShare.bind(this);
  }

  componentDidMount() {
    this.props.socket.emit("join_room", {
      room: this.props.name,
      user: this.props.loggedUser
        ? {
            username: this.props.loggedUser.username,
            socket: this.props.socket.id,
          }
        : {
            username: "Guest " + this.props.socket.id,
            socket: this.props.socket.id,
          },
      url: this.state.lobbyUrl,
      socket: this.props.socket.id,
    });
    this.props.socket.on("GetNewMessage", (data) => {
      let messages = this.state.messages;
      messages.push(data);
      this.setState({ messages: messages });
    });
    this.props.socket.on("user-join", (data) => {
      // toast for new user
      // console.log(data);
      toast.info(data.user.username + " has entered the chat!");
    });
    this.props.socket.on("user-leave", (data) => {
      // console.log(data);
      toast.error(data.user + " has left the chat!");
    });

    this.props.socket.on("lobby-info", (data) => {
      console.log(data);
      this.setState(
        {
          host: data.host,
          users: data.users,
          isHost: data.host === this.props.loggedUser.username,
        },
        () => console.log("State updated!")
      );
    });
    this.props.socket.on("leave-room", () => {
      console.log(
        "LEAVING",
        this.state.lobbyUrl,
        this.state.loggedUser.username
      );
      console.log("TIME TO LEAVE");
      this.props.socket.emit("user-leave-lobby", {
        room: this.state.lobbyUrl,
        username: this.props.loggedUser.username,
      });
    });
    // window.addEventListener("beforeunload", function (e) {
    //   // Cancel the event
    //   e.preventDefault(); // If you prevent default behavior in Mozilla Firefox prompt will always be shown
    //   // Chrome requires returnValue to be set
    //   e.returnValue = "";
    // });
  }

  componentWillUnmount() {
    this.props.socket.disconnect();
  }

  toggleChat() {
    this.setState({ showChat: !this.state.showChat });
  }

  allMessages() {
    return this.state.messages;
  }

  updateMessage(e) {
    this.setState({ currentMessage: e.target.value });
  }

  newUnreadMessage() {
    if (!this.state.showChat) {
      this.setState({ unreadMessages: this.state.unreadMessages + 1 });
    }
  }

  changeChatVisibility() {
    if (!this.state.showChat) {
      this.setState({ unreadMessages: 0 });
    }
    this.setState({ showChat: !this.state.showChat });
  }

  startScreenShare(media) {
    console.log("called screenshare");
    this.setState({ screenShare: true, screenShareMedia: media }, () => {
      console.log(media);
    });
  }

  getLobbyInfoQuery() {
    return gql`
      query getLobbyDetails($url: String!) {
        lobbyInfo(url: $url) {
          name
          host_id
          host_username
          limit
          others
          categories
          access
          playlist
          url
        }
      }
    `;
  }

  render(props) {
    let lobbyURl = this.props.url + "/" + this.props.name;
    return this.props.loggedUser ? (
      <Query
        query={this.getLobbyInfoQuery()}
        variables={{ url: lobbyURl }}
        pollInterval={1000}
      >
        {({ loading, error, data }) => {
          if (loading) return "Loading";
          if (error) {
            console.log(error);
            return error;
          }
          if (data.lobbyInfo === null) {
            console.log(data);
            return "Loading...";
          }

          let lobby = data.lobbyInfo;
          console.log(lobby);
          console.log(lobby.host_username === this.props.loggedUser.username);
          console.log(lobby.others);

          return (
            <div key={132131}>
              <div>
                <p className="lobby-name" style={{ marginBottom: 0 }}>
                  &emsp; <b>Lobby Name:</b> <u>{lobby.name}</u> &emsp;{" "}
                  <b>Current host:</b> <u>{lobby.host_username}</u> &emsp;{" "}
                  <b>Currently:</b>{" "}
                  <u>
                    {lobby.others.length + 1}/{lobby.limit}
                  </u>{" "}
                  &emsp; <b>Users:</b> <u>{lobby.others.join(", ")}</u>
                </p>
              </div>
              <div className="main-text-video" key={12345}>
                <VideoPlayer
                  socket={this.props.socket}
                  key={99999}
                  lobbyName={lobby.name}
                  lobbyUrl={lobby.url}
                  isHost={lobby.host_username === this.props.loggedUser.username}
                  screenShare={this.state.screenShare}
                  screenShareMedia={this.state.screenShareMedia}
                />
                <div className="videoTextChat">
                  <div className="video-chat-place">
                    <VideoChat
                      path="/lobby/:name"
                      lobbyName={this.state.lobbyName}
                      loggedUser={this.props.loggedUser.username}
                      startScreenShare={(media) => this.startScreenShare(media)}
                      lobbyUrl={this.state.lobbyUrl}
                    />
                  </div>
                  {this.state.showChat ? (
                    <TextChat
                      lobbyName={this.state.lobbyname}
                      loggedUser={this.props.loggedUser}
                      socket={this.props.socket}
                      lobbyUrl={lobby.url}
                      unreadCounter={this.newUnreadMessage}
                      unreadCount={this.state.unreadMessages}
                    />
                  ) : undefined}
                  <div
                    className="hide-chat-btn"
                    onClick={() => this.changeChatVisibility()}
                  >
                    <NotificationBadge
                      count={this.state.unreadMessages}
                      effect={Effect.SCALE}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        }}
      </Query>
    ) : (
      <Login />
    );
  }
}

export default MainLobby;
