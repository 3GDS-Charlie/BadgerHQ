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
    (acc, { id, appointment, platoon, contact, rank, name, dutyPoints }) => {
      acc[appointment] = {
        id,
        appointment,
        platoon,
        contact,
        rank,
        name,
        dutyPoints
      };
      return acc;
    },
    {}
  );

  // Combine all main and sub appointment
  const allAppointments = [...GUARD_ROLES.main, ...GUARD_ROLES.sub];

  // Create a new array with all appointment including missing ones
  const completePersonnels = allAppointments.map(
    (appointment) =>
      personnelMap[appointment] || {
        appointment,
        id: null,
        platoon: null,
        contact: null,
        rank: null,
        name: null,
        dutyPoints: null
      }
  );

  return completePersonnels;
};

export const calculateGDPoints = (date, twoPoints = false) => {
  // eslint-disable-next-line prefer-const
  let points = 1; // weekday
  if (!date) {
    return null;
  }
  // check what day of the week is it
  const dayOfTheWeek = new Date(date).getDay(); // 0 = sunday, 1 = monday, 6 = saturday, 5 = friday
  // Sat/sun/public holiday
  if (dayOfTheWeek === 1 || dayOfTheWeek === 6 || twoPoints) {
    points = 2;
  } else if (dayOfTheWeek === 5) {
    points = 1.5;
  }
  return points;
};
