import { firstUnique } from "./app/utils";
import { nearest, type Point } from "./geo";
import { Wagon, type SimpleJourney } from "./services/Wagon";

function randomize<T>(array: T[]): T[] {
  return array.sort(() => Math.random() - 0.5);
}

export async function nextTrainJourneys(
  currentStopId: string,
  lineId: string,
  terminusPosition: Point | undefined
): Promise<SimpleJourney[]> {
  const departures = await Wagon.departures(lineId, [currentStopId]);

  const nearestTerminusBranchHash =
    terminusPosition &&
    nearest(terminusPosition, departures, (d) => ({
      lat: d.destination.averagePosition.lat,
      lon: d.destination.averagePosition.long,
    }))?.branchHash;

  const first = firstUnique(
    4,
    (x) => x.journeyCode?.slice(0, 2) || x.destination.name,
    departures.filter((x) =>
      nearestTerminusBranchHash
        ? x.branchHash === nearestTerminusBranchHash
        : true
    )
  );

  const result = [];

  for (const [i, departure] of first.entries()) {
    const journey = await Wagon.journey(departure.id);
    const indexOfOrigin = journey.stops.findIndex(
      (x) => x.id === currentStopId
    );
    const stopsFromOrigin = journey.stops.slice(
      indexOfOrigin <= 0 || i === 0 ? indexOfOrigin : indexOfOrigin - 1
    );
    console.log(stopsFromOrigin.map((x) => x.name).join(" -> "));
    result.push({
      userStopDeparture: departure,
      ...journey,
      stops: stopsFromOrigin,
    });
  }

  return result;
}
