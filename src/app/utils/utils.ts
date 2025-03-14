export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const kebabCase = (str: string): string => {
  return str.replace(/[_\s]/, '-').toLowerCase();
}

export const snakeCase = (str: string): string => {
  return str.replace(/[-\s]/, '_').toLowerCase();
}
