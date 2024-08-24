import { lowerCase, startCase } from 'lodash'

export const titleCase = (string: string) => startCase(lowerCase(string))
