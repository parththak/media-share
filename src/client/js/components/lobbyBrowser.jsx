import React from "react";
import CategorySelector from "./categorySelector";
import "../../style/lobbybrowser.css";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import PublicLobbiesTable from "../containers/publicLobbies";

const QUERY_PUBLIC = gql`
  query queryPublic($categories: [Category]!, $after: String) {
    publicLobbies(categories: $categories, after: $after) {
      cursor
      hasMore
      lobbies {
        id
        name
        host_username
        categories
        others
        limit
        url
      }
    }
  }
`;

class LobbyBrowser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lobbies: [
        {
          id: 1,
          link: "test1",
          host: "Derek",
          members: "2/4",
          categories: ["sports", "games"],
        },
        {
          id: 2,
          link: "test2",
          host: "Justin",
          members: "4/4",
          categories: ["girls", "boys"],
        },
        {
          id: 3,
          link: "test3",
          host: "Parth",
          members: "1/4",
          categories: ["news", "sports"],
        },
        {
          id: 4,
          link: "test4",
          host: "Khansa",
          members: "3/4",
          categories: ["games", "yugioh"],
        },
        {
          id: 5,
          link: "test5",
          host: "Bilal",
          members: "1/4",
          categories: ["reality", "digimon"],
        },
        {
          id: 6,
          link: "test6",
          host: "Alex",
          members: "2/4",
          categories: ["drama", "agumon"],
        },
        {
          id: 7,
          link: "test7",
          host: "Jordan",
          members: "1/4",
          categories: ["games", "patamon"],
        },
      ],
      categories: {
        SPORTS: false,
        VIDEOGAMES: false,
        POLITICS: false,
        JUSTCHATTING: false,
        CELEBRITY: false,
        MUSIC: false,
      },
    };
    this.setData = this.setData.bind(this);
    this.renderTableHeader = this.renderTableHeader.bind(this);
    this.renderTabledata = this.renderTableData.bind(this);
    this.addToList = this.addToList.bind(this);
    this.navigateToLobby = this.navigateToLobby.bind(this);
  }

  setData(desired) {
    this.setState({ lobbies: [] });
    this.setState({ categories: desired });
  }

  navigateToLobby(url) {
    // console.log("CLICK PUBLIC LOBBY");
    this.props.navigateToLobby(url);
  }

  addToList(value) {
    this.setState({ lobbies: [...this.state.lobbies, value] });
  }

  renderTableHeader() {
    let header = ["name", "link", "host", "members", "categories"];
    return header.map((key, index) => {
      return <th key={index}>{key.toUpperCase()}</th>;
    });
  }

  renderTableData(data) {
    return data.map((lobby, _index) => {
      // console.log(lobby, lobby.categories);
      const { id, name, url, host, others, categories } = lobby;
      // console.log(id, name, url, host, others, categories);
      let others_string = others.join(", ");
      let cats_string = categories.join(", ");
      // let categoriesFixed = "";
      // for (const category of categories) {
      //   categoriesFixed = categoriesFixed + ", " + category;
      // }
      // categoriesFixed = categoriesFixed.slice(2);
      return (
        <tr key={id}>
          <td>{name}</td>
          <td className="lobby-link" onClick={() => this.navigateToLobby(url)}>
            {url}
          </td>
          <td>{host}</td>
          <td>{others_string}</td>
          <td>{cats_string}</td>
        </tr>
      );
    });
  }
  // LINE 128 <td className="lobby-link" onClick={() => this.navigateToLobby(url)}>{url}</td> not sure why this doesn't work
  // OR       <td className="lobby-link" onClick={() => this.navigateToLobby({url})}>{url}</td> not sure why either doesn't work
  render() {
    const categories = Object.keys(this.state.categories);
    const active = categories.filter(
      (category) => this.state.categories[category]
    );
    // console.log("STATE", this.state);
    // console.log("ACTIVE:", active);
    // console.log("ALL CATS:", categories);
    // return (
    //   <div className="open-lobby-container">
    //     <div className="browser-title">Open Lobbies</div>
    //     <CategorySelector setData={this.setData}></CategorySelector>
    //     <table className="lobbies">
    //       <tbody>
    //         <tr>{this.renderTableHeader()}</tr>
    //         {this.renderTableData(this.state.lobbies)}
    //       </tbody>
    //     </table>
    //   </div>
    // );
    return (
      <div className="open-lobby-container">
        <div className="browser-title">Open Lobbies</div>
        <CategorySelector
          setData={this.setData}
          active={this.state.categories}
        ></CategorySelector>
        <Query
          query={QUERY_PUBLIC}
          variables={{ categories: active }}
          // fetchPolicy={"network-only"}
        >
          {({ loading, error, data, fetchMore }) => {
            if (loading)
              return null;
              // <img
              //   src="https://www.drupal.org/files/issues/throbber_12.gif"
              //   alt="LOADING"
              //   className="loading-image"
              // />
            if (error) return error;

            console.log(data);

            return (
              <PublicLobbiesTable
                renderTableHeader={this.renderTableHeader}
                renderTableData={this.renderTableData}
                navigateToLobby={this.navigateToLobby}
                response={{ data, fetchMore }}
              />
            );
          }}
        </Query>
      </div>
    );
  }
}

export default LobbyBrowser;
