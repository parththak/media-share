import React from "react";
import "../../style/lobbybrowser.css";
//import { Router, navigate } from "@reach/router";

class CategorySelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.props.active; // {
    //   SPORTS: false,
    //   VIDEOGAMES: false,
    //   POLITICS: false,
    //   JUSTCHATTING: false,
    //   CELEBRITY: false,
    //   MUSIC: false,
    // };
    this.setData = this.setData.bind(this);
  }

  setData() {
    this.props.setData(this.state);
    console.log(this.state);
  }

  render() {
    const SPORTS = this.state.SPORTS;
    const VIDEOGAMES = this.state.VIDEOGAMES;
    const POLITICS = this.state.POLITICS;
    const JUSTCHATTING = this.state.JUSTCHATTING;
    const CELEBRITY = this.state.CELEBRITY;
    const MUSIC = this.state.MUSIC;
    return (
      <div className="selector-container">
        <div className="guide noselect">Choose Some Categories:</div>
        <table className="category-selector">
          <tbody>
            <tr>
              <td
                className={(SPORTS ? "caton" : "catoff") + " selector"}
                onClick={(e) => {
                  this.setState({ SPORTS: !this.state.SPORTS }, () => {this.setData()});
                }}
              >
                Sports
              </td>
              <td
                className={(VIDEOGAMES ? "caton" : "catoff") + " selector"}
                onClick={(e) => {
                  this.setState({ VIDEOGAMES: !this.state.VIDEOGAMES }, () => {this.setData()});
                }}
              >
                Video Games
              </td>
              <td
                className={(POLITICS ? "caton" : "catoff") + " selector"}
                onClick={() => {
                  this.setState({ POLITICS: !this.state.POLITICS }, () => {this.setData()});
                }}
              >
                Politics
              </td>
              <td
                className={(JUSTCHATTING ? "caton" : "catoff") + " selector"}
                onClick={() => {
                  this.setState({ JUSTCHATTING: !this.state.JUSTCHATTING }, () => {this.setData()});
                }}
              >
                Just Chatting
              </td>
              <td
                className={(CELEBRITY ? "caton" : "catoff") + " selector"}
                onClick={() => {
                  this.setState({ CELEBRITY: !this.state.CELEBRITY }, () => {this.setData()});
                }}
              >
                Celebrity
              </td>
              <td
                className={(MUSIC ? "caton" : "catoff") + " selector"}
                onClick={() => {
                  this.setState({ MUSIC: !this.state.MUSIC }, () => {this.setData()});
                }}
              >
                Music
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default CategorySelector;
