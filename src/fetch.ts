import { firstUnique } from "./app/utils";
import { Wagon, type SimpleJourney } from "./services/Wagon";

export async function nextTrainJourneys(): Promise<SimpleJourney[]> {
  const [ORIGIN, _, LINE] = "stop_area:IDFM:478926/line/line:IDFM:C01742".split(
    "/"
  );

  const departures = await Wagon.departures(LINE, [ORIGIN]);

  const first = firstUnique(
    4,
    (x) => x.journeyCode?.slice(0, 2) || x.destination,
    departures.filter((x) => x.branchHash === "1")
  );

  const result = [];

  for (const departure of first.values()) {
    const journey = await Wagon.journey(departure.id);
    const indexOfOrigin = journey.stops.findIndex((x) => x.id === ORIGIN);
    const stopsFromOrigin = journey.stops.slice(
      indexOfOrigin <= 0 ? 0 : indexOfOrigin - 1
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
