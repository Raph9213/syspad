import { Graph } from "./app/Graph";
import { firstUnique } from "./app/utils";
import { Wagon, type SimpleJourney, type SimpleStop } from "./services/Wagon";

export async function nextTrainJourneys(): Promise<SimpleJourney[]> {
  const CHATELET = "stop_area:IDFM:474151";
  const JUVISY = "stop_area:IDFM:478505";
  const RER_A = "line:IDFM:C01742";
  const RER_D = "line:IDFM:C01728";
  const ORIGIN = JUVISY;
  const graph = new Graph<SimpleStop>((x) => x.id);

  const departures = await Wagon.departures(RER_D, [ORIGIN]);

  const first = firstUnique(
    3,
    (x) => x.journeyCode?.slice(0, 2) || "",
    departures.filter((x) => x.branchHash === "1")
  );

  const result = [];

  for (const departure of first) {
    const journey = await Wagon.journey(departure.id);
    const stopsFromOrigin = journey.stops.slice(
      journey.stops.findIndex((x) => x.id === ORIGIN)
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
