import React from "react";
import { Provider } from "react-redux";
import * as SWRTC from "@andyet/simplewebrtc";
import UserMedia from "./userMedia";
// import RemoteMedia from './RemoteMedia';
import "../../style/videochat.css";

const API_KEY = process.env.REACT_APP_SIMPLE_WEB_RTC;

const CONFIG_URL = `https://api.simplewebrtc.com/config/guest/${API_KEY}`;
const store = SWRTC.createStore();

class VideoChat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lobbyName: this.props.name,
      hostName: "HOST",
      loggedUser: this.props.loggedUser
    };
    // add function binding here
    // this.renderRemoteMedia=this.renderRemoteMedia.bind(this);
    this.startScreenShare=this.startScreenShare.bind(this);
  }

  userHasMedia() {}

  startScreenShare(media) {
    console.log("Reached vidoechat: " + JSON.stringify(media));
    this.props.startScreenShare(media)

  }

  render(props) {
    return (
      <div>
        <div className="user-container">
          <Provider store={store}>
            <SWRTC.Provider
              configUrl={CONFIG_URL}
              displayName={this.state.loggedUser}
            >
              {/* Render based on the connection state */}
              <SWRTC.Connecting>
                <h1>Connecting...</h1>
              </SWRTC.Connecting>

              <SWRTC.Connected>
                {/* Request the user's media */}
                <SWRTC.RequestUserMedia audio video auto share />

                <SWRTC.RequestDisplayMedia share />

                <SWRTC.RemoteAudioPlayer />

                {/* Connect to a room with a name and optional password */}
                <SWRTC.Room
                  name={this.props.lobbyUrl}
                >
                  {props => {
                    return (
                      <div>
                        <UserMedia
                          remoteMedia={props.remoteMedia}
                          localMedia={props.localMedia[1]}
                          startScreenShare={(media) => this.startScreenShare(media)}
                          peers={props.peers}
                        />
                        {/* {console.log(props.localMedia)} */}
                        {/* {this.renderRemoteMedia(props.remoteMedia)} */}
                      </div>
                    );
                  }}
                </SWRTC.Room>
              </SWRTC.Connected>
            </SWRTC.Provider>
          </Provider>
        </div>
      </div>
    );
  }
}

export default VideoChat;
