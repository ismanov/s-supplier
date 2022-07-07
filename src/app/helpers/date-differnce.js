export const dateDiffernce = (date1, date2) => {
  const startDate = Math.ceil(Math.abs(new Date(date1).getTime()) / (1000 * 3600 * 24));
  const stopDate =  Math.ceil(Math.abs(new Date(date2).getTime()) / (1000 * 3600 * 24));

  return stopDate >= startDate ? stopDate - startDate : -1;
};