import React from "react";
import { Video, UserControls } from "@andyet/simplewebrtc";
import "../../style/UserComponent.css";
import RemoteMedia from "./remoteMedia";

class UserMedia extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      userMedia: this.props.media,
      lobbyName: this.props.lobbyName,
      isHost: false,
      micOn: true,
      videoOn: true,
      remoteScreenShare: false
    };
    // add function binding here
    this.renderRemoteMedia = this.renderRemoteMedia.bind(this);
    this.muteUser = this.muteUser.bind(this);
    this.pauseUser = this.pauseUser.bind(this);
    this.startScreenShare = this.startScreenShare.bind(this);

    //this.launchLobby=this.launchLobby.bind(this);
  }

  muteUser = props => {
    this.setState({ micOn: !this.state.micOn });
    if (props.isMuted) {
      props.unmute();
    } else {
      props.mute();
    }
  };

  pauseUser(props) {
    this.setState({ videoOn: !this.state.videoOn });
    if (props.isPaused) {
      props.resumeVideo();
    } else {
      props.pauseVideo();
    }
  }

  renderRemoteMedia() {
    let propsArray = this.props.remoteMedia;
    let boxes = [];
    let peerIndex = 0;
    for (let i = 0; i < propsArray.length; i++) {
      if (propsArray[i].kind === "video") {
        if(this.state.remoteScreenShare) {
          if(!propsArray[i].screenCapture) {
            boxes.push(
              <RemoteMedia
                key={propsArray[i].id}
                media={propsArray[i] ? propsArray[i] : undefined}
                remoteName={this.props.peers[peerIndex] ? this.props.peers[peerIndex].displayName : ""}
              />
            ); 
          }
      
        } else {
          boxes.push(
            <RemoteMedia
              key={propsArray[i].id}
              media={propsArray[i] ? propsArray[i] : undefined}
              remoteName={this.props.peers[peerIndex] ? this.props.peers[peerIndex].displayName : ""}
            />
          ); 
          peerIndex +=1
        }
            
      }
    }
    return boxes;
  }

  startScreenShare() {
    let propsArray = this.props.remoteMedia;
    this.setState({remoteScreenShare:true},() => {
      for (let i = 0; i < propsArray.length; i++) {
        if (propsArray[i].kind === "video") {
          if(propsArray[i].screenCapture) {
            console.log("Screen share media found")
            this.props.startScreenShare(propsArray[i]);
          } 
        }
      }
    });
   
  }

  render(props) {
    return (
      <div key={this.props.localMedia} className="userVideoBoxes">
        <div className="currUserContainer">
          <UserControls>
            {userProps => {
              return (
                <div>
                  {/* {console.log(userProps)} */}
                  <div className="userVideo">
                    <Video
                      media={
                        this.props.localMedia
                          ? this.props.localMedia
                          : "undefined"
                      }
                    />
                  </div>
                  <div className="userCommands">
                    <div
                      id={this.state.micOn ? "mic-button-on" : "mic-button-off"}
                      className="mediaIcon"
                      onClick={() => this.muteUser(userProps)}
                    ></div>

                    <div
                      id={
                        this.state.videoOn
                          ? "video-button-on"
                          : "video-button-off"
                      }
                      className="mediaIcon"
                      onClick={() => this.pauseUser(userProps)}
                    ></div>
                  </div>
                  <button onClick={this.startScreenShare}>Play remote to screen</button>

                </div>
              );
            }}
          </UserControls>
        </div>
        {this.renderRemoteMedia()}
      </div>
    );
  }
}

export default UserMedia;
