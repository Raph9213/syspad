export function firstUnique<T>(
  count: number,
  identity: (x: T) => string,
  items: T[]
): T[] {
  const frequency = new Map<string, number>();
  const unique: T[] = [];

  for (const item of items) {
    const id = identity(item);
    const current = frequency.get(id) || 0;

    if (current === 0) {
      unique.push(item);
    }

    frequency.set(id, current + 1);
  }

  return unique.slice(0, count);
}
