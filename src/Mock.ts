import { Graph } from "./app/Graph";

function identity<T>(x: T): T {
  return x;
}

const graph = new Graph<string>(identity);

// graph.add(["Juvisy", "Viry-Châtillon"]);

// // south
// graph.add(
//   [
//     "Grigny Centre",
//     "Orangis Bois de l'Epine",
//     "Evry Courcouronnes",
//     "Le Bras de Fer",
//   ],
//   ["Viry-Châtillon"]
// );

// // north
// graph.add(["Ris Orangis", "Grand Bourg", "Evry"], ["Viry-Châtillon"]);

// graph.add(["Corbeil-Essonnes"], ["Evry", "Le Bras de Fer"]);

// graph.add(["A", "B", "C", "E", "G"]);
// graph.add(["A", "B", "D", "E", "G"]);
// graph.add(["A", "F", "G"]);

graph.add(["A", "B", "D"]);
graph.add(["A", "C", "D"]);

export { graph };
