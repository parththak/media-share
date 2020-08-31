const { gql } = require("apollo-server");

//  For live updates in FE
const subscriptions = gql`
  type Subscription {
    joinedRoom: [User]
    leftRoom: [User]
    # To be continued...
  }
`;

module.exports = subscriptions;
