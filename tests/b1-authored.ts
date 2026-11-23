import { allUnits } from '../src/data/catalog'
import { isPlaceholderUnit } from '../src/data/curriculum'

/** The AUTHORED B1 units (ids 21–32) once B1 content is loaded: the 36 curriculum-v2 containers are listed, the twelve authored units are hidden legacy. */
export const b1AuthoredUnits = () => allUnits.filter(u => u.level === 'B1' && !isPlaceholderUnit(u))
