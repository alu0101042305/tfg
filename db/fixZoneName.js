
const map = {}

function Name(fixedName) {
  return (...names) => {
    names.forEach(name => {
      map[name] = fixedName
    })
  }
}

Name('Refinería')('Refineria', 'Puerta Principal-Refinería', 'Puerta Litoral-Refinería', 'Torre Meteorológica Refinería')
Name('Playa del Inglés')('Playa del Ingles', 'Playa ingles')
Name('Parque San Juan-Telde')('Parque San Juan-Telde')
Name('Médano')('Medano')
Name('Néstor Álamo')('Nestor Alamo')
Name('Mercatenerife')('Mercado Central', 'Merca Tenerife')
Name('Jinámar 3')('Jinamar Fase 3', 'Jinámar fase 3', 'Jinamar 3')
Name('Jinámar')('Jinamar', 'Torre Meteorológica Jinámar')
Name('El Río')('El rio')
Name('El Charco-Pto del Rosario')('El Charco-Puerto del Rosario')
Name('Camping Temisas-Sta Lucía de T.')('Camping Temisas-Sta Lucía de T', 'Camping Temisas-Sta Lucia T.')
Name('Igueste')('Igueste Sanidad')
Name('Igueste 2')('igueste2', 'Igueste2')
Name('Granadilla')('Torre Meteorológica Granadilla')
Name('Médano')('Medano')
Name('San Isidro')('S.Isidro')
Name('Agüimes')('Aguimes')
Name('Castillo del Romeral')('Castillo Romeral')
Name('San Agustín')('S.Agustin')
Name('Centro de Arte', 'Centro Arte')
Name('Arrecife', 'Ciudad Deportiva-Arrecife')
Name('Parque de San Juan-Telde')('Parque San Juan-Telde')
Name('La Hidalga-Arafo')('La Hidalgo-Arafo')
Name('Parque Las Rehoyas-Las PalmasGC')('Parque Las Rehoyas-Las Palmas G')
Name('Tena Artigas-Sta Cruz de TF')('Tena Artigas-Sta Cruz TF')
Name('Casa Palacio-Puerto del Rosario')('Casa Palacio-Pto del Rosario')
Name('UM3-Parque Bomberos-Sta Cruz TF')('Bomberos')
Name('Torre Meteorológica Los Guinchos')('Torre Meteorológica LosGuinchos', 'Torre Meteorológica Guinchos')


/**
 * Devuelve un nombre en común para la mima zona,
 * ya que la base de datos del gobierno de Canarias es inconcisa
 * y aparecen las mismas zonas con diferentes nombres o errores ortográficos
 * @param {string} zone Nombre de la zona
 */
function fixZoneName(zone) {
  return map[zone] || zone
}

module.exports = fixZoneName