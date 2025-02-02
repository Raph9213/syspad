import { describe, expect, it } from "vitest";
import { isInParis } from "./geo";

const LA_DEFENSE = {
  id: "stop_area:IDFM:71517",
  name: "La Défense",
  position: {
    lat: 48.89223,
    long: 2.238419,
  },
  lines: [],
};

const CDG_ETOILE = {
  id: "stop_area:IDFM:71347",
  name: "Charles de Gaulle - Etoile",
  position: {
    lat: 48.874173,
    long: 2.295231,
  },
  lines: [],
};

const AUBER = {
  id: "stop_area:IDFM:478926",
  name: "Auber",
  position: {
    lat: 48.872349,
    long: 2.329659,
  },
  lines: [],
};

const NATION = {
  id: "stop_area:IDFM:71673",
  name: "Nation",
  position: {
    lat: 48.848233,
    long: 2.395944,
  },
  lines: [],
};

const VINCENNES = {
  id: "stop_area:IDFM:71651",
  name: "Vincennes",
  position: {
    lat: 48.847347,
    long: 2.432584,
  },
  lines: [],
};

describe("Is in Paris ?", () => {
  it("should return true for all stops in Paris", () => {
    expect(isInParis(CDG_ETOILE)).toBe(true);
    expect(isInParis(AUBER)).toBe(true);
    expect(isInParis(NATION)).toBe(true);
  });

  it("should return false for all stops outside Paris", () => {
    expect(isInParis(LA_DEFENSE)).toBe(false);
    expect(isInParis(VINCENNES)).toBe(false);
  });
});
