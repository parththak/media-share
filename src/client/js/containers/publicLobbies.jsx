import React from "react";
import "../../style/lobbybrowser.css";

class PublicLobbiesTable extends React.Component {
  constructor(props) {
    super(props);
    this.navigateToLobby = this.navigateToLobby.bind(this);
  }
  navigateToLobby() {
    this.props.navigateToLobby();
  }
  render() {
    let response = this.props.response;
    let lobbies = response.data.publicLobbies.lobbies;
    let fetchMore = response.fetchMore;
    let cursor = response.data.publicLobbies.cursor;
    let hasMore = response.data.publicLobbies.hasMore;

    return (
      <div className="lobby-container">
        <table className="lobbies">
          <tbody>
            <tr>{this.props.renderTableHeader()}</tr>
            {this.props.renderTableData(lobbies)}
          </tbody>
        </table>
        {lobbies && hasMore && (
          <div
            onClick={() =>
              fetchMore({
                variables: {
                  after: cursor,
                },
                updateQuery: (prev, { fetchMoreResult, ...rest }) => {
                  if (!fetchMoreResult) return prev;
                  return {
                    publicLobbies: {
                      cursor: fetchMoreResult.publicLobbies.cursor,
                      hasMore: fetchMoreResult.publicLobbies.hasMore,
                      lobbies: [
                        ...prev.publicLobbies.lobbies,
                        ...fetchMoreResult.publicLobbies.lobbies,
                      ],
                    },
                  };
                },
              })
            }
            className="load-btn"
          >
            Load More
          </div>
        )}
      </div>
    );
  }
}

export default PublicLobbiesTable;
