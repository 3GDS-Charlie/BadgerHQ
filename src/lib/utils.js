import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { camelCase } from "change-case";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const isEq = (a, b) => a === b;

export const recursiveCamelCase = (item) => {
  if (item instanceof Array) {
    return item.map((value) => recursiveCamelCase(value));
  }
  if (item !== null && item !== undefined && item.constructor === Object) {
    return Object.keys(item).reduce((result, key) => {
      result[camelCase(key)] = recursiveCamelCase(item[key]);
      return result;
    }, {});
  }
  return item;
};
