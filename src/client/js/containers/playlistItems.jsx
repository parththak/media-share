import React from "react";
import { TWITCH_LOGO, YOUTUBE_REGEX } from "../constants";
import "../../../client/style/playlist.css";

class PlaylistItems extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: this.props.url,
      title: "",
    };
    this.playFromPlaylist = this.playFromPlaylist.bind(this);
    this.removeFromPlaylist = this.removeFromPlaylist.bind(this);
  }

  playFromPlaylist(url) {
    this.props.playFunc(url);
  }

  removeFromPlaylist(url) {
    this.props.removeFunc(url);
  }

  componentDidMount() {
    // get Video Title
    // Using fetch https://stackoverflow.com/a/37491171
    getYTVideoTitle(this.state.url).then(([video_data]) =>{
      if (!video_data.error) {
        this.setState({ title: video_data.title.slice(0, 50) })}
      }
    ).catch((e) => {
      console.log(e.message);
    });
  }

  render() {
    let url = this.props.url;

    let isYoutube = url.match(YOUTUBE_REGEX);
    let img_src = "https://image.flaticon.com/icons/svg/482/482059.svg";
    let title = this.state.title;

    if (isYoutube) { // is YT
      // https://stackoverflow.com/a/3452617 to get video ID
      let video_id = url.split("v=")[1];
      let ampersandPosition = video_id.indexOf("&");
      if (ampersandPosition !== -1) {
        video_id = video_id.substring(0, ampersandPosition);
      }
      img_src = `https://img.youtube.com/vi/${video_id}/1.jpg`;
    } else { // is Twitch
      img_src = TWITCH_LOGO;
      title = "Twitch Channel: " + url.substring(url.lastIndexOf('/') + 1);
    }

    return [
      <div key={122222}>
        <div className="playlist-item" key={1738}>
          <button
            className="remove-playlist-icon"
            onClick={(e) => {
              console.log("CLICK REMOVE");
              this.removeFromPlaylist(url);
            }}
            key={1741}
          ></button>
          <div
            className="video-thumbnail-title"
            onClick={(e) => this.playFromPlaylist(url)}
            key={1739}
          >
            <img
              // Image URL: https://stackoverflow.com/a/37826950
              className="thumbnail"
              src={img_src}
              alt="Thumbnail for video"
              key={1740}
            />
            {title}
          </div>
        </div>
      </div>,
    ];
  }
}

function getYTVideoTitlePromise(url) {
  return fetch(`https://noembed.com/embed?url=${url}`).then((resp) =>
    resp.json()
  );
}

function getYTVideoTitle(url) {
  return Promise.all([getYTVideoTitlePromise(url)]);
}

export default PlaylistItems;
