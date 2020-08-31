import React from "react";
import ReactPlayer from "react-player";
import "../../../client/style/videoplayer.css";
import Playlist from "./playlist";
import { Video } from "@andyet/simplewebrtc";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

class VideoPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lobbyName: this.props.lobbyName,
      socket: this.props.socket,
      // React Player states below
      url: "https://www.youtube.com/watch?v=atrWp3Ns1ZY", // source of video
      pip: false, // video in PIP mode
      playing: false, // is video currently playing?
      controls: true, // show video controls on video?
      volume: 0.8, // set volume; range is [0, 1]
      muted: false, // mute
      // All times below are in SECONDS
      playedSeconds: 0, // time played in video so far
      loadedSeconds: 0, // time played in video so far
      duration: 0, // length of video
      played: 0, // time played in video so far (%)
      loaded: 0, // time loaded in video so far (%)
      playbackRate: 1.0, // playback speed
      loop: false, // loop video?
      hostLocation: 0,
      isHost: false,
      lobbyUrl: this.props.lobbyUrl,
      screenShare: true,
      player: null,
    };
    // add function binding here
    this.playVideo = this.playVideo.bind(this);
    this.playNewVideo = this.playNewVideo.bind(this);
    this.playNextVideo = this.playNextVideo.bind(this);
    this.pauseVideo = this.pauseVideo.bind(this);
    this.hostSync = this.hostSync.bind(this);
    this.seekVideo = this.seekVideo.bind(this);

    this.hostStateSync = this.hostStateSync.bind(this);
  }

  componentDidMount() {
    this.state.socket.on("host-location", (data) => {
      this.state.socket.emit("host-sync", {
        playedSeconds: this.state.playedSeconds,
        played: this.state.played,
        playing: this.state.playing,
        userSocket: data.userSocket,
      });
    });
    this.state.socket.on("get-host-location", (data) => {
      this.setState({ hostLocation: data.playedSeconds }, () => {
        this.hostStateSync();
      });
    });
    this.state.socket.on("lobby-info", (data) => {
      this.setState({ isHost: data.isHost });
    });

    this.state.socket.on("host-play", (data) => {
      let hostLocation = data.playedSeconds;
      console.log(data);
      if (!this.props.isHost) {
        if (this.state.url !== data.url) {
          this.setState(
            {
              url: data.url,
              playing: true,
              hostLocation: hostLocation,
              screenShare: false,
            },
            () => {
              this.hostStateSync();
            }
          );
        }
        this.setState(
          { playing: true, hostLocation: hostLocation, screenShare: false },
          () => {
            this.hostStateSync();
          }
        );
        toast.warn("Video played by host");
      }
    });

    this.state.socket.on("host-pause", (data) => {
      let hostLocation = data.playedSeconds;
      if (!this.props.isHost) {
        this.setState({ playing: false, hostLocation: hostLocation }, () => {
          this.hostStateSync();
        });
        toast.warn("Video paused by host");
      }
    });

    this.state.socket.on("play-new-video", (data) => {
      console.log("new video");
      this.setState({ url: data.url, screenShare: false }, () => {
        console.log(this.state.player);
      });
    });
  }

  // reference to video player component
  set_video_player = (player) => {
    if (player) {
      this.setState({ player: player }, () => {
        this.video_player = player;
      });
    } else {
      this.video_player = this.state.player;
    }
  };

  set_playlist = (playlist) => {
    this.playlist = playlist;
  };

  get_vid_current_time() {
    return this.seconds_to_time_format(this.video_player.getCurrentTime());
  }

  seconds_to_time_format(seconds) {
    // from Stack Overflow
    // https://stackoverflow.com/a/52560608
    const format = (val) => `0${Math.floor(val)}`.slice(-2);
    const hours = seconds / 3600;
    const minutes = (seconds % 3600) / 60;
    return [hours, minutes, seconds % 60].map(format).join(":");
  }

  playVideo() {
    console.log(this.props.lobbyUrl, this.state.lobbyUrl);
    this.setState({ playing: true }, () => {
      if (this.props.isHost) {
        this.props.socket.emit("play_video", {
          video_url: this.state.url,
          playedSeconds: this.video_player.getCurrentTime(),
          room: this.state.lobbyUrl,
        });
      }
    });
  }

  playNewVideo(url) {
    // console.log(url, this.props.isHost, this.state.isHost);
    this.setState({ url, playing: true, screenShare: false }, () => {
      if (this.props.isHost) {
        this.state.socket.emit("play_video", {
          video_url: url,
          playedSeconds: this.video_player.getCurrentTime(),
          room: this.state.lobbyUrl,
        });
      }
    });
  }

  playNextVideo() {
    this.playlist.playNextVideo();
  }

  pauseVideo() {
    this.setState({ playing: false }, () => {
      if (this.props.isHost) {
        this.state.socket.emit("pause_video", {
          playedSeconds: this.video_player.getCurrentTime(),
          url: this.props.lobbyUrl,
        });
      }
    });
  }

  seekVideo() {
    if (this.state.isHost) {
      console.log("SEEKING: ");
    }
  }

  hostSync() {
    if (!this.state.isHost) {
      this.state.socket.emit("sync-to-host", {
        url: this.state.lobbyUrl,
        room: this.state.room,
      });
      toast.success("Synced to host");
    }
  }

  hostStateSync() {
    this.video_player.seekTo(parseFloat(this.state.hostLocation));
  }

  render(props) {
    return [
      <div className="playlist-media" key={12345}>
        <div>
          <div id="main-media" className="media-container" key={987654321}>
            {this.props.screenShare && this.state.screenShare ? (
              <div className="screen-container">
                <Video media={this.props.screenShareMedia} />
              </div>
            ) : (
              <ReactPlayer
                ref={this.set_video_player}
                key={12345678910}
                id="mmPlayer"
                url={this.state.url}
                playing={this.state.playing}
                controls={this.state.controls}
                width="100%"
                height="100%"
                pip={this.state.pip}
                config={{
                  youtube: {
                    playerVars: {
                      enablejsapi: 1,
                    },
                    embedOptions: {},
                    preload: true,
                  },
                }}
                onPlay={this.playVideo}
                onPause={this.pauseVideo}
                onEnded={this.playNextVideo}
                onError={(e) => {
                  console.log(e);
                }}
                onSeek={this.seekVideo}
                onProgress={(video_state) => this.setState(video_state)}
                onDuration={(duration) => this.setState({ duration })}
              />
            )}
          </div>

          <button
            id="sync-button"
            className="sync-button"
            onClick={this.hostSync}
          >
            SYNC TO HOST
          </button>
        </div>

        <Playlist
          ref={this.set_playlist}
          socket={this.props.socket}
          room={this.props.lobbyName}
          lobbyUrl={this.props.lobbyUrl}
          changeVideoFunc={this.playNewVideo}
          key={9999}
          isHost={this.props.isHost}
        />
      </div>,
    ];
  }
}

export default VideoPlayer;
