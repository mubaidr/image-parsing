const toCamelCase = (s: string): string => {
  return s
    .trim()
    .toLowerCase()
    .replace(/([-_ ][a-z])/gi, ($1) => {
      return $1.toUpperCase().replace(' ', '').replace('-', '').replace('_', '')
    })
}

const toHeadingCase = (s: string): string => {
  return s
    .replace(/([A-Z])/g, ($1) => {
      return ' ' + $1
    })
    .trim()
    .toUpperCase()
}

export { toCamelCase, toHeadingCase }
