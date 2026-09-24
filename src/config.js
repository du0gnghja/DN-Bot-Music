const path = require('path');

const jsonConfig = path.join(__dirname, 'config.json');

let config;
try {
  config = require(jsonConfig);
} catch (err) {
  console.error("❌ Không tìm thấy hoặc config.json không hợp lệ!", err.message);
  process.exit(1);
}

config.token = process.env.DISCORD_TOKEN || config.token;
config.SpotifyID = process.env.SPOTIFY_CLIENT_ID || config.SpotifyID;
config.SpotifySecret = process.env.SPOTIFY_CLIENT_SECRET || config.SpotifySecret;
config.LastFmKey = process.env.LASTFM_API_KEY || config.LastFmKey;
config.LastFmSecret = process.env.LASTFM_API_SECRET || config.LastFmSecret;

function parseBoolean(value) {
  if (typeof value === "string") {
    value = value.trim().toLowerCase();
  }
  switch (value) {
    case true:
    case "true":
      return true;
    default:
      return false;
  }
}

config.parseBoolean = parseBoolean;

module.exports = config;
