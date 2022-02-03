Hooks.on("hoverToken", (token, hovered) => {
  if (
    game.settings.get("hover-distance", "onlyInCombat") &&
    !game.combat?.started
    || !canvas.tokens.controlled[0]
    || token.id == canvas.tokens.controlled[0].id
  ) {
    canvas.tokens.get(token.id)?.clearDistanceTooltip();
    return;
  }
  hovered && game.settings.get("hover-distance", "enableDistTooltip")
    ? canvas.tokens.get(token.id)?.drawDistanceTooltip()
    : canvas.tokens.get(token.id)?.clearDistanceTooltip();
});

Hooks.on("controlToken", (token, controlled) => {
  canvas.tokens.get(token.id)?.clearDistanceTooltip();
});
