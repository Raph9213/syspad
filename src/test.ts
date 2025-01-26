type Path = string[];
type NestedPath = (string | NestedPath)[];

function mergePaths(paths: Path[]): NestedPath {
  const buildTree = (paths: Path[], index: number): NestedPath => {
    const branches: Record<string, Path[]> = {};

    // Regrouper les chemins par leur étape actuelle
    for (const path of paths) {
      const step = path[index];
      if (step) {
        if (!branches[step]) {
          branches[step] = [];
        }
        branches[step].push(path);
      }
    }

    // Construire le tableau imbriqué
    const result: NestedPath = [];
    for (const [step, groupedPaths] of Object.entries(branches)) {
      const subPaths = groupedPaths
        .map((p) => p.slice(index + 1))
        .filter((p) => p.length > 0);
      if (subPaths.length > 0) {
        result.push([step, buildTree(subPaths, 0)]);
      } else {
        result.push(step);
      }
    }

    // Si une seule branche, aplatir le tableau
    return result.length === 1 ? result[0] : result;
  };

  return buildTree(paths, 0);
}

// Exemple d'utilisation
const paths: Path[] = [
  ["A", "B", "E", "F"],
  ["A", "C", "D", "E", "F"],
];

export const nestedPath = mergePaths(paths);
