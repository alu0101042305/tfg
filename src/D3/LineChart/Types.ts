// Interfaz del objeto data que usa LineChart

export interface Point {
  date: Date,
  value: number
}

export interface Data {
  contaminante: Object,
  zone: string,
  points: Point[]
}

