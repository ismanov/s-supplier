export const fromObjToArray = (obj) => {
  const arr = [];

  Object.keys(obj).forEach((item) => {
    arr.push(obj[item]);
  });

  return arr;
};