export const MENU_TYPE_NOT_COLLAPSED = "MENU_TYPE_NOT_COLLAPSED";
export const MENU_TYPE_COLLAPSED = "MENU_TYPE_COLLAPSED";
export const DATE_FORMAT = "DD.MM.YYYY";
export const DATE_TIME_FORMAT = "DD.MM.YYYY, h:mm";
export const RANGE_DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm';
export const RANGE_DATE_FORMAT = 'YYYY-MM-DD';
export const ORDER_STATUSES = {
  NEW: "NEW",
  DRAFT: "DRAFT",
  IN_PROGRESS: "IN_PROGRESS",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
}
export const cyrillicPattern = /^\p{Script=Cyrillic}+$/u;
export const checkToCyrillic = (text) => {
  let hasCyrillic = false;
  for (let i = 0; i < text.length; i++) {
    if (cyrillicPattern.test(text[i])) {
      hasCyrillic = true;
      break
    }
  }
  return hasCyrillic
}