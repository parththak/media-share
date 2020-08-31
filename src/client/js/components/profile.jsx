import React from "react";
import "../../style/profile.css";
import { Query } from "react-apollo";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

const GET_USER = gql`
  query getUser($username: String!) {
    userInfo(username: $username) {
      id
      username
      first_name
      last_name
      email
      friends
    }
  }
`;

const UPDATE_PROFILE = gql`
  mutation updateUserProfile($email: EmailAddress, $password: String) {
    updateProfile(email: $email, password: $password) {
      id
      username
      first_name
      last_name
      email
      friends
    }
  }
`;

const GET_FRIENDS = gql`
  query getUsersFriends($username: String, $after: String) {
    getFriends(username: $username, after: $after) {
      cursor
      hasMore
      friends
    }
  }
`;

const ADD_FRIEND = gql`
  mutation addNewFriend($username: String) {
    addFriend(username: $username)
  }
`;

const REMOVE_FRIEND = gql`
  mutation removeFriend($username: String) {
    removeFriend(username: $username)
  }
`;

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayEdit: false,
      isCurrent: props.targetUser === props.current_user.username,
      email: "",
      currentPass: "",
      newPass: "",
    };
    this.reset = this.reset.bind(this);
    this.updateEmail = this.updateEmail.bind(this);
    this.updateCurrent = this.updateCurrent.bind(this);
    this.updateNew = this.updateNew.bind(this);
  }

  reset() {
    this.setState({ email: "", currentPass: "", newPass: "" });
  }

  updateEmail(e) {
    this.setState({ email: e.target.value });
  }

  updateCurrent(e) {
    this.setState({ currentPass: e.target.value });
  }

  updateNew(e) {
    this.setState({ newPass: e.target.value });
  }

  render() {
    const displayEdit = this.state.displayEdit;
    const isCurrent = this.state.isCurrent;
    const [addFriend] = useMutation(ADD_FRIEND, {
      onCompleted({ addFriend }) {
        console.log("Added");
      }
    });
    const [removeFriend] = useMutation(REMOVE_FRIEND, {
      onCompleted({ removeFriend }) {
        console.log("removed");
      }
    });
    return (
      <Query
        query={GET_USER}
        variables={{ username: this.props.targetUser }}
        fetchPolicy={"network-only"}
      >
        {({ loading, error, data }) => {
          if (loading)
            return (
              <img
                src="https://www.drupal.org/files/issues/throbber_12.gif"
                alt="LOADING"
              />
            );
          if (error) return error;
          return(
            <div className="profile-container">
              <div className="profile-title">
                <b>{data.User.username}</b>
                <div>{data.User.first_name.concat(" ", data.User.last_name)}</div>
                <div>{data.User.email}</div>
                {/*display if the user looking at the profile is the current user*/}
                {isCurrent ? (
                  <div
                    className="edit-btn noselect"
                    onClick={() => this.setState({displayEdit: true})}
                  >
                    Edit Profile
                  </div>
                  ) : (
                      null
                  )}
              </div>
              <div className="split" />
              <div className="friends-list">
                <b className="list-title">Friends</b>
                {data.User.friends.map((friend) => (
                  <div className="friend">
                    <div className="friend-name" onClick={this.props.goToProfile(friend)}>{friend}</div>
                    {true ? (
                      <div className="add-btn noselect" onClick={
                        removeFriend({ variables: {username: friend}})
                      }>Remove Friend</div>
                    ) : (
                      <div className="add-btn noselect" onClick={
                        addFriend({ variables: {username: friend}})
                      }>Add Friend</div>
                    )}
                  </div>
                ))}
              </div>
              {displayEdit ? (
                <div className="edit-popup">
                  <div className="edit-title">Edit Profile</div>
                  <form>
                    <label>Edit email:</label>
                    <input
                      type="text"
                      id="email"
                      placeholder="dereknguyen123@outlook.com"
                      onChange={this.updateEmail}
                    />
                    <label>Current Password:</label>
                    <input
                      id="login-old-pw"
                      type="password"
                      placeholder="Enter current password"
                      onChange={this.updateCurrent}
                    />
                    <label>New Password:</label>
                    <input
                      id="login-new-pw"
                      type="password"
                      placeholder="Enter new password"
                      onChange={this.updateNew}
                    />
                    <div className="buttons">
                      <div
                        className="form-btn"
                        onClick={() => {
                          this.setState({ displayEdit: false }, () => this.reset());
                        }}
                      >
                        Cancel
                      </div>
                      <div
                        className="form-btn"
                        onClick={() => {
                          this.setState({ displayEdit: false }, () => this.reset());
                        }}
                      >
                        Submit
                      </div>
                    </div>
                  </form>
                </div>
              ) : null}
            </div>);}}
        </Query>
    );
  }
}

export default Profile;
