export const Colors = {
  hexToRgb: function (hex: string) {
    const match = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
    if (!match) {
      throw new Error(`Invalid color: ${hex}`);
    }
    return {
      r: parseInt(match[1], 16),
      g: parseInt(match[2], 16),
      b: parseInt(match[3], 16),
    };
  },

  rgbToHex: function (rgb: { r: number; g: number; b: number }) {
    return (
      "#" +
      [rgb.r, rgb.g, rgb.b]
        .map((x) => {
          const hex = x.toString(16);
          return hex.length === 1 ? "0" + hex : hex;
        })
        .join("")
    );
  },

  mix: function (color: string, _with: string, by: number) {
    const c = this.hexToRgb(color);
    const w = this.hexToRgb(_with);
    return this.rgbToHex({
      r: Math.round(c.r + (w.r - c.r) * by),
      g: Math.round(c.g + (w.g - c.g) * by),
      b: Math.round(c.b + (w.b - c.b) * by),
    });
  },
};
