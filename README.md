# Media Share
| Name | uTorID |
|---|---|
| Derek Nguyen | nguy1524 |
| Justin Abrokwah | abrokwah |
| Parth Thakkar | thakka28 |

## Project Description
With the introduction of the internet we've been able to have an increasing amount of interaction with our friends online which before we would have had to be together physically. But we haven't yet had a single platform for video chat, text chat and syncronized media sharing. As if we were all together watching a youtube video, synchronized between us so we can enjoy the great moments together. Another example would be if we were just sharing images.

We plan to create a web application that allows users to video chat, view media, screen share, and text chat together in a "chat room" environment. After creating an account, users can start chat rooms for which they will be the administrators. Administrators to chat rooms will be able to share a link to their friends so that they can join in on the video/text chat and media sharing fun, or they can leave the chat room open for strangers to join. Administrators can also assign other users roles in their chat rooms to be able to be the ones to share/queue up media, or share their screens. Users who are not administrators and have not been assigned this role are relagated to only video, audio, and text chats.
If users don't want to create their own chat room, they will be able to join open lobbies and chat with strangers if they choose.
In terms of what media can be shared for the media sharing, we plan to allow for video/image uploads, youtube links or direct links to video/image media and screensharing.

**Documentation can be found at https://github.com/UTSCC09/project-media-share/blob/master/docs.md**

**Project hosted at https://crewtube.herokuapp.com**


## Key Features for Beta
* Users can start a lobby that other users can join
* Video chat functionality
* Text chat
* Syncronized media sharing
* Production environment running (hosted online)

## Additional Features for Final
* 2-Factor Authentication
* Administrator, media sharing role split
* User Profiles (Names, profile pictures, bio, etc.)
* Search for open lobbies to join

## Techonologies to be used
* **React JS** will be used for front end. This is something that we haven't used before and decided that it would be a great opportunity to use and practice with this library. It allows for really powerful single page applications that can be used to easily modify the DOM and create good user interfaces.
* **Heroku** will be used to deploy our project as it offers simple, free, and long term web hosting.
* **MongoDB** is going to be used for our database storage for user information, and other important data. The choice of nosql server will allow for faster quering and easy scaling. MongoDB has a lot of documentation and tutorials so it would be easy to learn. 
* **WebRTC API** is an API that can help us get the video, audio, and screensharing inputs from each user to be shared. It allows for real-time communication to handle synchronous media sharing. 
* **GraphQL** will be used to implement an efficient, queryable API.

## Technical Challenges
1. Syncronized media sharing
1. Creating "chat rooms" or lobbies for which users can join mid-session
1. Learning new libraries/frameworks such as WebRTC, react, and GraphQL to be integrated well in our project.
1. Managing a lot of chat rooms/lobbies to be closed/opened efficiently to manage server load appropriately.
1. Creating a shared browser in which users can share, control and view media.
