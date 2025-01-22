import { Graph } from "./app/Graph";
import { firstUnique } from "./app/utils";
import { Wagon, type SimpleStop } from "./services/Wagon";

export async function nextTrainGraph(): Promise<Graph<SimpleStop>> {
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

  for (const { id } of first) {
    const stops = await Wagon.journey(id);
    const stopsFromOrigin = stops.slice(
      stops.findIndex((x) => x.id === ORIGIN)
    );
    console.log(stopsFromOrigin.map((x) => x.name).join(" -> "));
    graph.add(stopsFromOrigin);
  }

  return graph;
}
