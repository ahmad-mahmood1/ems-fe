import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import moment from "moment";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertJSONObjectToString(obj: object): string {
  const filteredObject = Object.fromEntries(
    Object.entries(obj).filter(
      ([key, value]) => value !== null && value !== undefined
    )
  );
  const jsonString = JSON.stringify(filteredObject);
  return jsonString;
}

export function parseValidDate(
  date: Date,
  formatString: string = "DD-MMM-YYYY"
): Date {
  try {
    let parsedDate = moment(date).format(formatString);
    if (parsedDate === "Invalid date") {
      return new Date(2022, 7, 2);
    }
    return new Date(parsedDate);
  } catch (e) {
    return new Date(2022, 7, 2);
  }
}

export function generateRandomNumberBetweenRange(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
