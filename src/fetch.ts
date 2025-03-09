import dayjs from "dayjs";
import { firstUnique } from "./app/utils";
import { nearest, type Point } from "./geo";
import {
  Wagon,
  type SimpleDeparture,
  type SimpleJourney,
} from "./services/Wagon";

// function randomize<T>(array: T[]): T[] {
//   return array.sort(() => Math.random() - 0.5);
// }

export async function nextTrainJourneys(
  currentStopId: string,
  lineId: string,
  terminusPosition: Point | undefined,
  previousJourneys: SimpleJourney[]
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

  async function getJourney(departure: SimpleDeparture) {
    const needToRefreshFirstJourney = dayjs().minute() % 5 === 0;
    const isFirstJourney = first.at(0)?.id === departure.id;

    if (isFirstJourney && needToRefreshFirstJourney) {
      return Wagon.journey(departure.id);
    }

    return (
      previousJourneys.find((x) => x.id === departure.id) ||
      Wagon.journey(departure.id)
    );
  }

  const result = [];

  for (const [i, departure] of first.entries()) {
    const journey = await getJourney(departure);
    const indexOfOrigin = journey.stops.findIndex(
      (x) => x.id === currentStopId
    );
    const stopsFromOrigin = journey.stops.slice(
      indexOfOrigin <= 0 || i === 0 ? indexOfOrigin : indexOfOrigin - 1
    );
    console.log(stopsFromOrigin.map((x) => x.name).join(" -> "));

    // Only print for the OTHER trains, not the first one
    if (i > 0) {
      const diffMinutes = departure.leavesAt.diff(dayjs(), "minute");
      const diffMinutesFormatted = diffMinutes < 0 ? "now" : `${diffMinutes}m`;
      console.log(
        `${departure.destination.name} in ${diffMinutesFormatted} (${departure.leavesAt.format(
          "HH:mm"
        )})`
      );
    }

    result.push({
      userStopDeparture: departure,
      ...journey,
      stops: stopsFromOrigin,
    });
  }

  return result;
}
