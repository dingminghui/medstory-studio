import dayjs from "dayjs";

export function formatDate(value: string | Date, format = "MM/DD") {
  return dayjs(value).format(format);
}
