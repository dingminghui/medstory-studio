import dayjs from "dayjs";

export function formatMonthDay(value: string | Date) {
  return dayjs(value).format("MM/DD");
}
