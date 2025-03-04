import type { SimpleStop } from "./services/Wagon";

export type Point = { lat: number; lon: number };

function isInside(p: Point, polygon: Point[]): boolean {
  let isInside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].lat;
    const yi = polygon[i].lon;
    const xj = polygon[j].lat;
    const yj = polygon[j].lon;
    const intersect =
      yi > p.lon !== yj > p.lon &&
      p.lat < ((xj - xi) * (p.lon - yi)) / (yj - yi) + xi;
    if (intersect) {
      isInside = !isInside;
    }
  }
  return isInside;
}

export function isInParis(stop: SimpleStop): boolean {
  const PARIS = [
    [2.2797157023652233, 48.87851114803195],
    [2.260758439431669, 48.85943705776893],
    [2.250725603630201, 48.851771232014215],
    [2.252587203777324, 48.83892471441001],
    [2.256918652080401, 48.83446204263046],
    [2.271550968899362, 48.83445914285036],
    [2.291114621872964, 48.82663535815962],
    [2.334447983719997, 48.815784140139016],
    [2.345287926634228, 48.81575541284957],
    [2.3642418596329833, 48.81522793302469],
    [2.4130302040167066, 48.835187986521504],
    [2.416281192355882, 48.84998854577634],
    [2.4141860657588268, 48.87062868036486],
    [2.408755907552944, 48.87933336904129],
    [2.397272521667105, 48.88614948295714],
    [2.3932591798833585, 48.899713403700105],
    [2.379991770128811, 48.9013263118716],
    [2.330120794975727, 48.90204326235818],
    [2.315209600628549, 48.898845542250285],
    [2.2875653501001807, 48.886359489323866],
    [2.2797157023652233, 48.87851114803195],
  ];

  return isInside(
    { lat: stop.position.lat, lon: stop.position.long },
    PARIS.map(([lon, lat]) => ({ lat, lon }))
  );
}

function radians(degree: number) {
  let rad: number = (degree * Math.PI) / 180;

  return rad;
}

function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  let dlat, dlon, a, c, R: number;

  R = 6372.8; // km
  dlat = radians(lat2 - lat1);
  dlon = radians(lon2 - lon1);
  lat1 = radians(lat1);
  lat2 = radians(lat2);
  a =
    Math.sin(dlat / 2) * Math.sin(dlat / 2) +
    Math.sin(dlon / 2) * Math.sin(dlon / 2) * Math.cos(lat1) * Math.cos(lat2);
  c = 2 * Math.asin(Math.sqrt(a));
  return R * c;
}

export function nearest<T>(
  from: Point,
  elements: T[],
  getPosition: (x: T) => Point
) {
  let nearestElement: T | null = null;
  let nearestDistance = Infinity;

  for (const element of elements) {
    const position = getPosition(element);
    const distance = haversine(from.lat, from.lon, position.lat, position.lon);

    if (distance < nearestDistance) {
      nearestElement = element;
      nearestDistance = distance;
    }
  }

  return nearestElement;
}
