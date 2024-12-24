/** @format */

import moment from "moment-timezone";

export function convertToNZDate(date_string: string): string {
  const nz_time_formatted: string = moment(date_string)
    .tz("Pacific/Auckland")
    .format("YYYY-MM-DD HH:mm:ss");
  return nz_time_formatted;
}
