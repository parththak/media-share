import React from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../../client/style/playlist.css";
import PlaylistItems from "../containers/playlistItems";
import { YOUTUBE_REGEX, TWITCH_REGEX } from "../constants";

class Playlist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // Playlist states
      socket: this.props.socket,
      lobbyName: this.props.room,
      playlist: [],
      newURL: "",
    };
    this.updateAddition = this.updateAddition.bind(this);
    this.addToPlaylist = this.addToPlaylist.bind(this);
    this.removeFromPlaylist = this.removeFromPlaylist.bind(this);
    this.playFromPlaylist = this.playFromPlaylist.bind(this);
    this.playNextVideo = this.playNextVideo.bind(this);
  }

  componentDidMount() {
    this.state.socket.on("playlist-url-message", (data) => {
      const messages = {
        0: "URL already in playlist!",
        1: "URL not in playlist!",
      };
      toast.error(messages[data.code]);
    });
    this.state.socket.on("update-playlist", (result) => {
      this.setState({ playlist: result.playlist }, () =>
        console.log("Playlist Updated!", result.playlist)
      );
    });
  }

  updateAddition(e) {
    this.setState({ newURL: e.target.value });
  }

  addToPlaylist() {
    let url = this.state.newURL;
    if (this.state.playlist.includes(url)) {
      toast.error("URL already in playlist!");
    } else {
      // validate and pass to socket
      let isYoutube = true;
      let isTwitch = true;
      if (!url.match(YOUTUBE_REGEX)) {
        isYoutube = false;
      }
      if (!url.match(TWITCH_REGEX)) {
        isTwitch = false;
      }
      console.log(isYoutube, isTwitch);
      if (isYoutube || isTwitch) {
        this.state.socket.emit("add-to-playlist", {
          url,
          room: this.props.lobbyUrl,
        });
      } else {
        toast.error("Invalid URL entered! Please submit a Youtube or Twitch link!");
      }
    }
    this.setState({ newURL: "" });
  }
  removeFromPlaylist(url) {
    // use URL to remove
    this.state.socket.emit("remove-from-playlist", {
      url,
      room: this.props.lobbyUrl,
    });
  }

  playFromPlaylist(url) {
    // set current video to URL
    // remove from playlist if need be ?
    console.log("video clicked");
    // console.log(this.props.isHost);
    if (this.props.isHost) {
      this.props.changeVideoFunc(url);
      this.removeFromPlaylist(url);
      // this.state.socket.emit("play-from-playlist", {
      //   url: url,
      //   room: this.props.room,
      // });
    }
  }

  playNextVideo() {
    if (this.state.playlist.length !== 0) {
      let next = this.state.playlist[0];
      this.playFromPlaylist(next);
    }
  }

  render() {
    let removeFunc = this.removeFromPlaylist;
    let playFunc = this.playFromPlaylist;
    return [
      <div className="playlist-url" key={8988}>
        <input
          className="playlist-input"
          id="add-playlist-url"
          type="text"
          placeholder="Enter URL to add video to playlist"
          onChange={this.updateAddition}
          value={this.state.newURL}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              this.addToPlaylist();
            }
          }}
          key={1212}
        />
        <p>Playlist</p>
      </div>,
      <div className="playlist-items-container" key={101010}>
        {console.log(this.state.playlist)}
        {this.state.playlist.map(function (vid_url, index) {
          return (
            <PlaylistItems
              url={vid_url}
              key={100 + index}
              playFunc={playFunc}
              removeFunc={removeFunc}
            />
          );
        })}
      </div>,
    ];
  }
}

export default Playlist;
