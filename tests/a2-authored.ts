import { allUnits } from '../src/data/catalog'
import { isPlaceholderUnit } from '../src/data/curriculum'

/** The AUTHORED A2 units (ids 11–20) once A2 content is loaded: the 43 curriculum-v2 containers are listed, the ten authored units are hidden legacy. */
export const a2AuthoredUnits = () => allUnits.filter(u => u.level === 'A2' && !isPlaceholderUnit(u))
