Hooks.once("init", async function () {
  libWrapper.register(
    "hover-distance",
    "Token.prototype.draw",
    DistanceTooltip.tokenDraw,
    "WRAPPER"
  );
  Token.prototype.drawDistanceTooltip = DistanceTooltip.draw;
  Token.prototype.clearDistanceTooltip = DistanceTooltip.clear;

  game.settings.register("hover-distance", "enableDistTooltip", {
    name: "Enable Hover Distance",
    hint: "If enabled, when overing over a token, show text indicating the distance to that token",
    scope: "client",
    config: true,
    type: Boolean,
    default: true,
  });

  game.settings.register("hover-distance", "highlightGrid", {
    name: "Highlight Token",
    hint: "Highlight the token when overing over it",
    scope: "client",
    config: true,
    type: Boolean,
    default: true,
  });

  game.settings.register("hover-distance", "use3d", {
    name: "Include vertical distance",
    hint: "Caclulations will be done including vertical distance, this will switch the measurement to euclidean",
    scope: "world",
    config: true,
    type: Boolean,
    default: false,
  });

  game.settings.register("hover-distance", "onlyInCombat", {
    name: "Highlight Only in Combat",
    hint: "Highlight only when a combat is started",
    scope: "world",
    config: true,
    type: Boolean,
    default: false,
  });
});

Hooks.once("ready", async function () {});
