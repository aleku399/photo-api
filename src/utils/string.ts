import * as Ramda from "ramda";

export const arrayFromStringArray = (valueString: string): string[] => {
  const removeQuotes = valueString.substr(0, valueString.length - 1).substr(1);

  return Ramda.split(",", removeQuotes);
};

export function getFormatDate(dateStr: string | Date): string {
  const date = new Date(dateStr);
  const year = date.getFullYear();

  const month = 1 + date.getMonth();
  const formattedMonth = month > 9 ? month : `0${month}`;

  const day = date.getDate();
  const formattedDay = day > 9 ? day : `0${day}`;

  return `${year}-${formattedMonth}-${formattedDay}`;
}
