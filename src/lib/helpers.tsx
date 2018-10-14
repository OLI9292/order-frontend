import * as moment from "moment"
import { isArray, findIndex, extend } from "lodash"

export const toArray = (arg: any): any[] => (isArray(arg) ? arg : [arg])

export function updateObjects<T extends { id: any }>(
  original: T[],
  update: T[]
): T[] {
  update.forEach((u: T) => {
    const idx = findIndex(original, (o: T) => o.id === u.id)
    if (idx > -1) {
      original[idx] = extend(original[idx], u)
    }
  })
  return original
}

export const parseDateString = (str: string): string => {
  const format = str.includes(":") ? "YYYY-MM-DDTHH:mm:ss.SSS" : "x"
  const t = moment(str, format)
  return t.isValid() ? t.format("M/D/YY H:mm") : str
}
