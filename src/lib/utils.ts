import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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


