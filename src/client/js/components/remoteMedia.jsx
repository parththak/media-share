import React from "react";
import * as SWRTC from "@andyet/simplewebrtc";
import "../../style/UserComponent.css";

class RemoteMedia extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      userMedia: this.props.media,
      lobbyName: this.props.lobbyName,
      isHost: false
    };
    // add function binding here
    //this.getName=this.getName.bind(this);
    //this.launchLobby=this.launchLobby.bind(this);
  }

  userHasMedia() {}

  render(props) {
    return (
      <div>
        <div className="currUserContainer">
          <div className="userVideo">
            <SWRTC.Video
              screenCapture
              media={this.props.media ? this.props.media : "undefined"}
            />
            <p className="peer-name">{this.props.remoteName}</p>
          </div>
        </div>
      </div>
    );
  }
}

export default RemoteMedia;
