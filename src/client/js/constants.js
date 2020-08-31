export const VALIDATION_RULES = {
  username: "required|alpha_dash",
  first: "required|alpha",
  last: "required|alpha",
  email: "required|email",
  password: [
    "required",
    "regex:/^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\\s).{8,15}$/",
  ],
};

export const CUSTOM_REGISTER_ERRORS = {
  first: "First name is required",
  last: "Last name is required",
};

export const TWITCH_REGEX = /^(?:https?:\/\/)?(?:www\.|go\.)?twitch\.tv\/([a-z0-9_]+)($|\?)/;
// https://www.regextester.com/99797

export const YOUTUBE_REGEX = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w-]+\?v=|embed\/|v\/)?)([\w-]+)(\S+)?$/;
// https://regexr.com/3dj5t

export const TWITCH_LOGO = "https://webstockreview.net/images/twitch-icon-png-4.png";
