import { parse, stringify } from 'querystring'


export function assignQuery(baseUri: string, query: Record<string, any> = {}) {
  const [url, baseQuery] = baseUri.split('?', 2)
  const mergedQuery = Object.entries({
    ...baseQuery ? parse(baseQuery) as Record<string, any> : {},
    ...query,
  }).reduce<Record<string, any>>((carry, [key, value]) => {
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
