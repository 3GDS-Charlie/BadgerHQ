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
    (
      acc,
      { id, appointment, platoon, contact, rank, name, dutyPoints, signExtra }
    ) => {
      acc[appointment] = {
        id,
        appointment,
        platoon,
        contact,
        rank,
        name,
        dutyPoints,
        signExtra
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
        dutyPoints: null,
        signExtra: false
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
  if (dayOfTheWeek === 0 || dayOfTheWeek === 6 || twoPoints) {
    points = 2;
  } else if (dayOfTheWeek === 5) {
    points = 1.5;
  }
  return points;
};

export const getDayOfWeekName = (date) => dayjs(date).format("dddd");

export const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text);
};

// [{ key: "", value: "" }] -> { [key]: [value] }
export const makeDictionary = (arr) =>
  arr.reduce((acc, curr) => {
    acc[curr.label] = curr.value;
    return acc;
  }, {});

export const mapPltStrToDBValue = (pltStr) => {
  let rawPlt = "HQ";
  if (pltStr === "Plt 7") {
    rawPlt = "7";
  } else if (pltStr === "Plt 8") {
    rawPlt = "8";
  } else if (pltStr === "Plt 9") {
    rawPlt = "9";
  }
  return rawPlt;
};

export const convertToMMM = (monthLowercase) => {
  // Capitalize the first letter of the month
  const monthCapitalized =
    monthLowercase.charAt(0).toUpperCase() + monthLowercase.slice(1);

  // Parse the month name with an arbitrary day and year
  const date = dayjs(`${monthCapitalized} 1, 2023`, "MMMM D, YYYY");

  // Check if the date is valid
  if (date.isValid()) {
    // Format the date to return the MMM format
    return date.format("MMM");
  }
  return "error";
};
