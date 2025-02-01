import { firstUnique } from "./app/utils";
import { Wagon, type SimpleJourney } from "./services/Wagon";

export async function nextTrainJourneys(): Promise<SimpleJourney[]> {
  const [ORIGIN, _, LINE] = "stop_area:IDFM:71410/line/line:IDFM:C01743".split(
    "/"
  );

  const departures = await Wagon.departures(LINE, [ORIGIN]);

  const first = firstUnique(
    3,
    (x) => x.journeyCode?.slice(0, 2) || x.destination,
    departures.filter((x) => x.branchHash === "0")
  );

  console.log(first);

  const result = [];

  for (const [i, departure] of first.entries()) {
    const journey = await Wagon.journey(departure.id);
    const stopsFromOrigin = journey.stops.slice(
      journey.stops.findIndex((x) => x.id === ORIGIN) - (i === 0 ? 0 : 1)
    );
    console.log(stopsFromOrigin.map((x) => x.name).join(" -> "));
    result.push({
      userStopDeparture: departure,
      stops: stopsFromOrigin,
      line: journey.line,
    });
  }

  return result;
}
