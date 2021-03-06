export interface Contaminante {
  display_name: string, // nombre en Unicode
  db_name: string, // nombre en la base de datos
  id: number,
  range: number[]
}

const Contaminante = (display_name: string, db_name: string, id: number, range: number[]) => ({
  display_name,
  db_name,
  id,
  range
})

export const Contaminantes: Contaminante[] = [
  Contaminante('SO\u2082', 'SO2', 1, [100, 200, 350, 500, 1250]),
  Contaminante('NO\u2082','NO2', 8, [40, 100, 200, 400, 1000]),
  Contaminante('PM\u2082\u2085', 'PM2.5', 9, [10, 20, 25, 50, 800]),
  Contaminante('PM\u2081\u2080', 'PM10', 10, [20, 35, 50, 100, 1200]),
  Contaminante('O\u2083', 'O3', 14, [80, 120, 180, 240, 600]),
]

export const Colors = [
  'rgb(0,255,250)',
  'rgb(80,200,163)',
  'rgb(255,255,0)',
  'rgb(255,79,92)',
  'rgb(192,0,0)'
]

export function getColor(value: number, contaminante: Contaminante): string {
  const {range} = contaminante
  for(var i = 0; i < range.length; ++i) {
    if(value < range[i]){
      return Colors[i]
    }
  }
  return Colors[Colors.length - 1]
}