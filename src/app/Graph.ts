export class Graph<T> {
  private adjacencyList: Map<string, Set<string>>;
  private nodeMap: Map<string, T> = new Map();

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
}
