class DistanceTooltip {
  constructor(originToken, destinationToken) {
    this.destinationToken = destinationToken;
    const ray = new Ray(
      { x: originToken.center.x, y: originToken.center.y },
      { x: destinationToken.center.x, y: destinationToken.center.y }
    );
    this.distance = canvas.grid.measureDistances([{ ray }], {
      gridSpaces: true,
    });
  }

  static draw() {
    this.hud.tooltip.visible=false
    const origin = canvas?.tokens?.controlled[0];
    if (!origin || origin.id == this.id) return;
    const ray = new Ray(
      { x: this.center.x, y: this.center.y },
      { x: origin.center.x, y: origin.center.y }
    );
    const is3d = game.settings.get("hover-distance", "use3d")
    const distance = is3d ? DistanceTooltip.getUnitTokenDist(this,origin) : Math.floor(canvas.grid.measureDistances([{ ray }], {
      gridSpaces: true,
    }));
    this.hud.distanceTooltip.removeChildren().forEach((c) => c.destroy());

    // Create the tooltip Text
    let tip = `${distance} ${canvas?.scene?.data?.gridUnits}.`;
    if (!tip.length) return;
    const style = CONFIG.canvasTextStyle.clone();
    style.fontSize = Math.max(Math.round(canvas.dimensions.size * 0.36 * 12) / 12, 36);
    const text = new PreciseText(tip, style);
    this.hud.distanceTooltip.addChild(text);

    // Add the tooltip at the top of the parent Token container
    text.anchor.set(0.5, 1);
    this.hud.distanceTooltip.position.set(this.w / 2, -2);
    DistanceTooltip.highlightGrid(this)
  }

  static clear() {
    this.hud.tooltip.visible=true
    this.hud.distanceTooltip?.removeChildren()?.forEach((c) => c.destroy());
    DistanceTooltip.clearGrid();
  }
  static async tokenDraw(wrapped, ...args) {
    await wrapped(...args);
    this.hud.distanceTooltip = this.addChild(new PIXI.Container());
    return this;
  }

  static highlightGrid(token) {
    if(!game.settings.get("hover-distance", "highlightGrid")) return;
    if (!canvas.background.distanceHighlight) {
      canvas.background.distanceHighlight = new PIXI.Graphics();
      canvas.background.addChild(canvas.background.distanceHighlight);
    }
    if(!canvas.background.distanceHighlight.geometry){
      canvas.background.removeChild(canvas.background.distanceHighlight);
      canvas.background.distanceHighlight = new PIXI.Graphics();
      canvas.background.addChild(canvas.background.distanceHighlight);
    }
    const highlight = canvas.background.distanceHighlight;
    highlight.clear();
    const shape = new PIXI.Rectangle(token.x,token.y,token.w,token.h);
    const color = 0x0000ff;
    const border = 0x000000;
    const alpha = 0.25;
    highlight.beginFill(color, alpha);
    if (border) highlight.lineStyle(2, border, Math.min(alpha * 1.5, 1.0));
    highlight.drawShape(shape).endFill();
  }
  static clearGrid(){
    const highlight = canvas?.background?.distanceHighlight;
    if(highlight && !highlight._destroyed) highlight?.clear();
  }

  static getUnitTokenDist(token1, token2) {
    const unitsToPixel = canvas.dimensions.size / canvas.dimensions.distance;
    const x1 = token1.center.x;
    const y1 = token1.center.y;
    const z1 = token1.losHeight * unitsToPixel;
    const x2 = token2.center.x;
    const y2 = token2.center.y;
    const z2 = token2.losHeight * unitsToPixel;

    const d =
      Math.sqrt(
        Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2)
      ) / unitsToPixel;
    return Math.floor(d);
  }
}
