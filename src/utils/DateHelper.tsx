import dayjs, { Dayjs } from "dayjs";

export const getEndDate = (
  num: number,
  start_date: Dayjs | null,
  classes: any[]
) => {
  let end_date = start_date;

  if (num < 1 || !start_date || !classes || classes?.length === 0) return;

  const dows: any = {};
  const dow_class = classes?.map((c: any) => {
    const dow = c.day_of_week;
    dows[dow] = dows[dow] ? dows[dow]++ : 1;

    return dow;
  });

  while (0 <= num) {
    const day = dayjs(end_date).day();
    if (num === 0 && dow_class.includes(day)) break;

    if (dow_class.includes(day)) num -= dows[day];
    end_date = dayjs(end_date).add(1, "day");
  }

  return end_date;
};
