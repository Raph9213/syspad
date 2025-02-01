export class Graph<T> {
  private adjacencyList: Map<string, Set<string>>;
  private nodeMap: Map<string, T> = new Map();
  private initialPaths: T[][] = [];

  constructor(private identity: (x: T) => string) {
    this.adjacencyList = new Map();
    this.nodeMap = new Map();
  }

  /**
   * Adds nodes to the graph, connecting each node in the list to the next as its successor.
   * @param nodes - The ordered list of nodes to add, where each is the predecessor of the next.
   * @param predecessors - Additional predecessors to connect to the first node in the list.
   */
  add(nodes: T[], predecessors: T[] = []): void {
    if (nodes.length === 0) return;

    this.initialPaths.push(nodes);

    // Ensure all nodes in the list are added and connected sequentially
    for (let i = 0; i < nodes.length; i++) {
      const currentId = this.identity(nodes[i]);
      this.nodeMap.set(currentId, nodes[i]);

      // Ensure the current node exists in the adjacency list
      if (!this.adjacencyList.has(currentId)) {
        this.adjacencyList.set(currentId, new Set());
      }

      // If there’s a next node in the list, connect the current node to it
      if (i < nodes.length - 1) {
        const nextId = this.identity(nodes[i + 1]);
        if (!this.adjacencyList.has(nextId)) {
          this.adjacencyList.set(nextId, new Set());
        }
        this.adjacencyList.get(currentId)?.add(nextId);
      }
    }

    // Connect all additional predecessors to the first node in the list
    const firstNodeId = this.identity(nodes[0]);
    predecessors.forEach((pred) => {
      const predId = this.identity(pred);
      if (!this.adjacencyList.has(predId)) {
        this.adjacencyList.set(predId, new Set());
      }
      this.adjacencyList.get(predId)?.add(firstNodeId);
    });
  }

  paths(from: T): string[][] {
    const fromId = this.identity(from);
    const paths: string[][] = [];
    const visited = new Set<string>();

    const dfs = (current: string, path: string[]) => {
      visited.add(current);
      path.push(current);

      const successors = this.adjacencyList.get(current) || new Set();

      // If the current node has no children, add the current path to paths
      if (successors.size === 0) {
        paths.push([...path]);
      } else {
        // Continue to search for successors
        successors.forEach((neighbor) => {
          if (!visited.has(neighbor)) {
            dfs(neighbor, path);
          }
        });
      }

      // Backtrack
      path.pop();
      visited.delete(current);
    };

    // Start DFS from the 'from' node
    dfs(fromId, []);

    return paths;
  }

  groupedTopologicalSort(): T[][] {
    const inDegrees = new Map<string, number>();
    const groups: T[][] = [];

    // Initialize in-degrees for all nodes
    this.adjacencyList.forEach((_, node) => {
      inDegrees.set(node, 0);
    });

    // Calculate in-degrees
    this.adjacencyList.forEach((neighbors, _) => {
      neighbors.forEach((neighbor) => {
        inDegrees.set(neighbor, (inDegrees.get(neighbor) || 0) + 1);
      });
    });

    // Process nodes with in-degree 0
    const queue: string[] = [];
    inDegrees.forEach((degree, node) => {
      if (degree === 0) {
        queue.push(node);
      }
    });

    // BFS-like processing to group nodes
    while (queue.length > 0) {
      const group: T[] = [];
      const nextQueue: string[] = [];

      // Process all nodes in the current queue
      queue.forEach((node) => {
        const originalNode = this.nodeMap.get(node); // Retrieve the original object
        if (originalNode) {
          group.push(originalNode);
        }

        // Reduce in-degree of all neighbors
        this.adjacencyList.get(node)?.forEach((neighbor) => {
          const newDegree = (inDegrees.get(neighbor) || 0) - 1;
          inDegrees.set(neighbor, newDegree);

          // If in-degree becomes 0, add to the next queue
          if (newDegree === 0) {
            nextQueue.push(neighbor);
          }
        });
      });

      // Add the current group to the result
      groups.push(group);

      // Move to the next level
      queue.splice(0, queue.length, ...nextQueue);
    }

    return groups;
  }

  private predecessors(node: string): string[] {
    const preds: string[] = [];
    this.adjacencyList.forEach((neighbors, neighbor) => {
      if (neighbors.has(node)) {
        preds.push(neighbor);
      }
    });
    return preds;
  }

  private successors(node: string): string[] {
    const succs: string[] = [];
    const neighbors = this.adjacencyList.get(node);
    if (neighbors) {
      neighbors.forEach((neighbor) => {
        succs.push(neighbor);
      });
    }
    return succs;
  }

  get commonPaths(): Set<T[]> {
    const result = new Set<T[]>(); // Stocke les sous-chemins uniques

    for (const path of this.initialPaths) {
      const subPaths: T[][] = [];
      let subPath: T[] = [];

      for (const node of path) {
        const nodeId = this.identity(node);
        const preds = this.predecessors(nodeId);
        const succs = this.successors(nodeId);

        if (preds.length > 1) {
          // Si le nœud a plusieurs prédécesseurs, on ferme le sous-chemin actuel
          if (subPath.length > 0) {
            subPaths.push(subPath);
          }
          // Démarre un nouveau sous-chemin incluant ce nœud
          subPath = [node];
        } else {
          subPath.push(node);
        }

        if (succs.length > 1) {
          // Si le nœud a plusieurs successeurs, on ferme le sous-chemin actuel après l'avoir ajouté
          subPaths.push(subPath);
          subPath = [];
        }
      }

      // Ajoute le dernier sous-chemin s'il contient encore des éléments
      if (subPath.length > 0) {
        subPaths.push(subPath);
      }

      for (const subPath of subPaths) {
        if (
          ![...result].some((existingPath) =>
            this.arraysEqual(existingPath, subPath)
          )
        ) {
          result.add(subPath);
        }
      }
    }

    return result;
  }

  /**
   * Vérifie si deux tableaux sont égaux en contenu et en ordre.
   */
  private arraysEqual(arr1: T[], arr2: T[]): boolean {
    if (arr1.length !== arr2.length) return false;
    return arr1.every(
      (element, index) => this.identity(element) === this.identity(arr2[index])
    );
  }

  get groupedTopologicalPaths(): T[][][] {
    const topoSort = this.groupedTopologicalSort(); // Récupère le tri topologique normal
    const paths = this.commonPaths; // Récupère les chemins communs
    const result: T[][][] = []; // Liste des niveaux du tri topo
    const processed = new Set<string>(); // Garde en mémoire les éléments déjà ajoutés

    for (const level of topoSort) {
      const newLevel: T[][] = [];

      for (const node of level) {
        const nodeId = this.identity(node);

        if (processed.has(nodeId)) continue; // On ignore les éléments déjà placés

        // Cherche un chemin contenant ce noeud
        const path = [...paths].find((p) =>
          p.some((n) => this.identity(n) === nodeId)
        );

        if (path) {
          newLevel.push(path); // Ajoute le chemin entier au niveau du tri topo
          path.forEach((n) => processed.add(this.identity(n))); // Marque tous les éléments du chemin
        } else {
          newLevel.push([node]); // Ajoute l'élément seul
          processed.add(nodeId);
        }
      }

      if (newLevel.length > 0) {
        result.push(newLevel); // On n'ajoute que si le niveau contient des éléments
      }
    }

    return result;
  }
}
