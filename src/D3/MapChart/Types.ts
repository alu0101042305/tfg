export interface Point {
  pos: [number, number],
  value: number
}

export interface Data {
  points: Point[],
  contaminante: object
}
