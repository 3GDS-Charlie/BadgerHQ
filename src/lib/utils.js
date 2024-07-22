import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { camelCase } from "change-case";
import dayjs from "dayjs";
import { GUARD_ROLES } from "./data";

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

export const isDatePast = (date) => {
  // Convert the provided date to a dayjs object and set to start of the day
  const dateToCompare = dayjs(date).startOf("day");

  // Get the current date and set to start of the day
  const currentDate = dayjs().startOf("day");

  // Compare the current date with the provided date
  return currentDate.isAfter(dateToCompare);
};

export const fillMissingAppointment = (existingPersonnels) => {
  // Create a map of existing personnel by role
  const personnelMap = existingPersonnels.reduce(
    (acc, { appointment, rank, name }) => {
      acc[appointment] = { appointment, rank, name };
      return acc;
    },
    {}
  );

  // Combine all main and sub appointment
  const allAppointments = [...GUARD_ROLES.main, ...GUARD_ROLES.sub];

  // Create a new array with all appointment including missing ones
  const completePersonnels = allAppointments.map(
    (appointment) =>
      personnelMap[appointment] || { appointment, rank: null, name: null }
  );

  return completePersonnels;
};
