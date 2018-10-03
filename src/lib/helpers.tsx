import { isArray } from "lodash"

export const toArray = (arg: any): any[] => (isArray(arg) ? arg : [arg])
