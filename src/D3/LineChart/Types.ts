// Interfaz del objeto data que usa LineChart
import {Contaminante} from '../../assets/Contaminante'

export interface Point {
  date: Date,
  value: number
}

export interface Data {
  contaminante: Contaminante,
  zone?: string,
  points: Point[][]
}

