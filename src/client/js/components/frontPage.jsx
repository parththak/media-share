import React from "react";
import CategorySelector from "./categorySelector";
import "../../style/frontpage.css";
import randomstring from "randomstring";

class FrontPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lobbyName: "",
      privacy: false,
      categories: {
        SPORTS: false,
        VIDEOGAMES: false,
        POLITICS: false,
        JUSTCHATTING: false,
        CELEBRITY: false,
        MUSIC: false,
      },
    };
    this.getName = this.updateName.bind(this);
    this.launchLobby = this.launchLobby.bind(this);
    this.updateName = this.updateName.bind(this);
    this.setData = this.setData.bind(this);
    this.togglePrivacy = this.togglePrivacy.bind(this);
  }

  updateName(e) {
    this.setState({ lobbyName: e.target.value });
  }

  togglePrivacy() {
    this.setState({ privacy: !this.state.privacy });
  }

  setData(desired) {
    this.setState({ categories: desired });
  }

  launchLobby(e) {
    console.log("Lobby launched, it's name is: " + this.state.lobbyName);
    let hash = randomstring.generate(5);
    let privacyState = "";
    if(this.state.privacy) {
      privacyState = "PRIVATE";
    } else {
      privacyState = "PUBLIC";
    }
    this.props.updateLobby(hash, this.state.lobbyName, this.props.current_user, this.state.categories, privacyState);
    
  }



  render(props) {
    const privacy = this.state.privacy;
    return (
      <div className="home-container">
        <div className="title">CREWTUBE</div>
        <div className="launch-container">
          <input
            className="lobby-name"
            id="lobbyName"
            type="text"
            placeholder="Enter lobby name"
            onChange={this.updateName}
          ></input>
          <div className="launch-btn noselect" onClick={this.launchLobby}>
            Launch Lobby!
          </div>
        </div>
        <CategorySelector setData={this.setData} active={this.state.categories}></CategorySelector>
        <div onClick={this.togglePrivacy} className={(privacy ? "private" : "public") + " toggle noselect"}>Private</div>
      </div>
    );
  }
}

export default FrontPage;
