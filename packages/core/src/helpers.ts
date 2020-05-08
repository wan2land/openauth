import { parse, stringify } from 'querystring'


export function underscoreToCamel(data: Record<string, any>): Record<string, any> {
  return Object.entries(data).reduce<Record<string, any>>((carry, [key, value]) => {
    carry[key.replace(/_+(.)/g, (_, c) => c.toUpperCase())] = value
    return carry
  }, {}) as any
}

export function camelToUnderscore(data: Record<string, any>): Record<string, any> {
  return Object.entries(data).reduce<Record<string, any>>((carry, [key, value]) => {
    carry[key.replace(/[A-Z]/g, (c) => `_${c.toLocaleLowerCase()}`)] = value
    return carry
  }, {}) as any
}

export function createUri(baseUri: string, query: Record<string, string | null | undefined> = {}) {
  const [url, baseQuery] = baseUri.split('?', 2)
  const mergedQuery = Object.entries({
    ...baseQuery ? parse(baseQuery) : {},
    ...camelToUnderscore(query),
  }).reduce<Record<string, string>>((carry, [key, value]) => {
    if (value === null || typeof value === 'undefined') {
      return carry
    }
    carry[key] = value
    return carry
  }, {})
  if (Object.keys(mergedQuery).length === 0) {
    return url
  }
  return `${url}?${stringify(mergedQuery)}`
}
