import React from "react";
import Header from "./components/header";
import FrontPage from "./components/frontPage";
import MainLobby from "./components/mainLobby";
import LobbyBrowser from "./components/lobbyBrowser";
import TextChat from "./components/textChat";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import io from "socket.io-client";
import { Router, navigate } from "@reach/router";

import "../style/App.css";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import NotFound from "./components/notFound";
import Profile from "./components/profile";

// For all toast notifications in App
toast.configure({ position: "bottom-right" });

const socket_url =
  process.env.REACT_APP_CHAT_SOCKET_URL || "http://localhost:4000";

const USER_STATUS = gql`
  query userStatus {
    isLoggedIn
    currentUser {
      id
      username
    }
  }
`;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: this.props.loggedIn,
      inLobby: false,
      browsing: false || window.location.pathname === "/browse",
      lobbyName: "",
      lobbyUrl: "/lobby/",
      inChat: false,
      socket: io(socket_url),
      categories: [],
      lobbyPrivacy: "PUBLIC",
      targetUser: "",
    };
    this.updateLogin = this.toggleLoginStatus.bind(this);
    this.updateLobby = this.updateLobby.bind(this);
    this.navigateToLobby = this.navigateToLobby.bind(this);
    this.leaveLobby = this.leaveLobby.bind(this);
    this.toggleBrowsing = this.toggleBrowsing.bind(this);
    this.goToMyProfile = this.goToMyProfile.bind(this);
    this.goToProfile = this.goToProfile.bind(this);
    this.goHome = this.goHome.bind(this);
  }

  toggleBrowsing() {
    if (this.state.browsing) {
      this.setState({ browsing: false });
      navigate("/");
    } else {
      this.setState({ browsing: true });
      navigate("/browse");
    }
  }

  toggleLoginStatus() {
    this.props.toggleLogin();
  }

  leaveLobby() {
    console.log("LEAVING: ");
    this.state.socket.emit("user-leave-lobby", {
      room: window.location.href.substring(
        window.location.href.lastIndexOf(
          "/",
          window.location.href.lastIndexOf("/") - 1
        ) + 1
      ),
      username: this.props.current_user.username,
    });
    this.setState({ inLobby: false, lobbyName: "" });
    navigate("/");
    console.log("TIME TO LEAVE");
  }

  updateLobby(hash, name, categories, privacy) {
    const categoriesKeys = Object.keys(categories);
    const active = categoriesKeys.filter((category) => categories[category]);
    this.setState({ inLobby: !this.state.inLobby });
    this.setState({ lobbyName: name });
    this.setState({ categories: active });
    this.setState({ lobbyPrivacy: privacy });
    console.log("Lobby launched, it's name is: " + name);
    console.log("With categories: " + active);
    console.log("And it is: " + privacy);
    // this.setState({ inLobby: !this.state.inLobby });
    let url = hash + "/" + name;
    this.setState({ lobbyName: name, lobbyUrl: url });
    navigate("lobby/" + url, {
      state: {
        loggedUser: this.props.current_user,
        lobbyName: name,
        lobbyUrl: url,
        categories: this.state.categories,
        privacy: this.state.lobbyPrivacy,
      },
    });
  }

  goToMyProfile(username) {
    this.setState({ targetUser: username }, () =>
      navigate("/user/" + username)
    );
  }

  goToProfile(username) {
    this.setState({ targetUser: username }, () =>
      navigate("/user/" + username)
    );
  }

  navigateToLobby(url) {
    // console.log(url);
    this.setState({ lobbyName: url });
    this.setState({ inLobby: !this.state.inLobby });
    navigate("/lobby/" + url);
  }

  goHome() {
    navigate("/");
  }

  render(props) {
    const inLobby = this.state.inLobby;
    const isLoggedIn = this.props.loggedIn;
    const browsing = this.state.browsing;

    return [
      <Query query={USER_STATUS} fetchPolicy={"network-only"}>
        {({ loading, error, data }) => {
          if (loading) return "Loading...";
          if (error) return `Error! ${error.message}`;
          // console.log(data);

          return [
            <Header
              key={212356}
              loggedIn={isLoggedIn}
              current_user={data.currentUser}
              inLobby={inLobby}
              goToProfile={this.goToProfile}
              leaveLobby={this.leaveLobby}
              goHome={this.goHome}
              browsing={browsing}
              toggleBrowsing={this.toggleBrowsing}
            />,
            <Router key="66">
              <NotFound default />
              <FrontPage
                path="/"
                loggedIn={isLoggedIn}
                current_user={data.currentUser}
                updateLobby={this.updateLobby}
              />
              <MainLobby
                path="/lobby/:url/:name"
                lobbyName={this.state.lobbyName}
                loggedUser={data.currentUser}
                lobbyUrl={this.state.lobbyUrl}
                socket={this.state.socket}
              />
              <TextChat
                path="/chat/:name"
                lobbyName={this.state.lobbyName}
                loggedUser={data.currentUser}
              />
              <LobbyBrowser
                path="/browse"
                navigateToLobby={this.navigateToLobby}
              />
              <Profile
                path="/user/:username"
                current_user={data.currentUser}
                target_user={this.state.targetUser}
                goToProfile={this.goToProfile}
              />
            </Router>,
          ];
        }}
      </Query>,
    ];
  }
}

export default App;
