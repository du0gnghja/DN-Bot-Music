const { ContainerBuilder } = require("discord.js");
const config = require("../config.js");

function accentColor(hex = config.color) {
  const n = parseInt(String(hex || "#00D4FF").replace("#", ""), 16);
  return Number.isFinite(n) ? n : 0x00d4ff;
}

function withAccent(container) {
  if (container && typeof container.setAccentColor === "function") {
    container.setAccentColor(accentColor());
  }
  return container;
}

if (!ContainerBuilder.prototype.__grooveAccentPatched) {
  const originalToJSON = ContainerBuilder.prototype.toJSON;
  ContainerBuilder.prototype.toJSON = function toJSONWithAccent() {
    if (this.data && this.data.accent_color == null) {
      this.setAccentColor(accentColor());
    }
    return originalToJSON.call(this);
  };
  ContainerBuilder.prototype.__grooveAccentPatched = true;
}

module.exports = { accentColor, withAccent };
