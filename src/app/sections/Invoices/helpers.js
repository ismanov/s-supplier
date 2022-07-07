import { Spin } from "antd";
import React from "react";

export const getCoeffGap = (taxGap) => {
  const style = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 90,
    height: 30,
    fontWeight: "bold",
  };
  if (taxGap > 0 && taxGap < 0.2) {
    return (
      <div
        style={{
          ...style,
          backgroundColor: "rgba(143, 212, 70, 0.7)",
        }}
      >
        <span>{String(taxGap)}</span>
      </div>
    );
  } else if (taxGap > 0.21 && taxGap < 0.4) {
    return (
      <div
        style={{
          ...style,
          backgroundColor: "rgba(253, 164, 1, 0.7)",
        }}
      >
        <span>{String(taxGap)}</span>
      </div>
    );
  } else if (taxGap > 0.41 && taxGap < 0.6) {
    return (
      <div
        style={{
          ...style,
          backgroundColor: "rgba(239, 69, 68, 0.7)",
        }}
      >
        <span>{String(taxGap)}</span>
      </div>
    );
  } else {
    return (
      <div
        style={{
          ...style,
          backgroundColor: "rgba(138, 1, 1, 0.7)",
        }}
      >
        <span>{String(taxGap)}</span>
      </div>
    );
  }
};

export const parseVATStatus = (VatRegStatus = {}) => {
  if (VatRegStatus === 20) {
    return "сертификат активный";
  } else if (VatRegStatus === 21) {
    return "сертификат неактивный";
  } else {
    return "сертификат временно неактивный";
  }
};

export const row = (key, value, index, loading) => (
  <div
    className="invoice__seller-and-buyer-detail__content__row"
    style={{ background: (index || 0) % 2 ? "#F6F9FC" : "white" }}
  >
    <span className="invoice__seller-and-buyer-detail__content__row__key">
      {key}:
    </span>
    <span>{loading ? <Spin size="small" /> : value || "-"}</span>
  </div>
);

export const camelCaseToWords = (text = "") => {
  const english = /^[A-Z'a-z0-9]*$/;
  if (english.test(text))
    return (text || "").replace(/([A-Z]+)*([A-Z][a-z])/g, "$1 $2");
  return (text || "").replace(/([А-Я]+)*([А-Я][а-я])/g, "$1 $2");
};

export const isAggregation = (code) => {
  const aggregation = /^\([0-9]{2}\)[0-9]{18}$/;
  const aggregationWithoutBracket = /^[0-9]{18,20}$/;
  return aggregation.test(code) || aggregationWithoutBracket.test(code);
};

export const translateCodeRuEn = (markCode) => {
  const rules = {};
// ru2en
  rules["Ё"] = "~";
  rules["ё"] = "`";
  rules["\""] = "@";
  rules["№"] = "#";
  rules["й"] = "q";
  rules["ц"] = "w";
  rules["у"] = "e";
  rules["к"] = "r";
  rules["е"] = "t";
  rules["н"] = "y";
  rules["г"] = "u";
  rules["ш"] = "i";
  rules["щ"] = "o";
  rules["з"] = "p";
  rules["ф"] = "a";
  rules["ы"] = "s";
  rules["в"] = "d";
  rules["а"] = "f";
  rules["п"] = "g";
  rules["р"] = "h";
  rules["о"] = "j";
  rules["л"] = "k";
  rules["д"] = "l";
  rules["я"] = "z";
  rules["ч"] = "x";
  rules["с"] = "c";
  rules["м"] = "v";
  rules["и"] = "b";
  rules["т"] = "n";
  rules["ь"] = "m";
  rules["Й"] = "Q";
  rules["Ц"] = "W";
  rules["У"] = "E";
  rules["К"] = "R";
  rules["Е"] = "T";
  rules["Н"] = "Y";
  rules["Г"] = "U";
  rules["Ш"] = "I";
  rules["Щ"] = "O";
  rules["З"] = "P";
  rules["Ф"] = "A";
  rules["Ы"] = "S";
  rules["В"] = "D";
  rules["А"] = "F";
  rules["П"] = "G";
  rules["Р"] = "H";
  rules["О"] = "J";
  rules["Л"] = "K";
  rules["Д"] = "L";
  rules["Я"] = "Z";
  rules["Ч"] = "X";
  rules["С"] = "C";
  rules["М"] = "V";
  rules["И"] = "B";
  rules["Т"] = "N";
  rules["Ь"] = "M";
  rules["х"] = "[";
  rules["Х"] = "{";
  rules["ъ"] = "]";
  rules["Ъ"] = "}";
  rules["ж"] = ";";
  rules["Ж"] = ":";
  rules["э"] = "'";
  rules["Э"] = "\"";
  rules["б"] = ",";
  rules["Б"] = "<";
  rules["ю"] = ".";
  rules["Ю"] = ">";
  rules["?"] = "&";
  rules["."] = "/";
  const setCharAt = (str, index, char) => {
    if(index > str.length-1) return str;
    return str.substr(0,index) + char + str.substr(index + 1);
  }
  const translate = (markCode) => {
    if (markCode.length > 0) {
      for (let i = 0; i < markCode.length; i++) {
        const key = markCode.charAt(i);
        if (rules[key])
          markCode = setCharAt(markCode, i, rules[key]);
      }
    }
    return markCode;
  }
  return translate(markCode)
}

export const checkCodesToExists = (products, code) => {
  const codes = [];
  products.forEach((product) => {
    product.aggregationCodes.forEach((c) => {
      codes.push(c);
    });
  });
  if (isAggregation(code) && code.length === 18) {
    // checking codes without (00)
    const filteredCodes = codes.filter((item) => item.slice(2) === code || item === code);
    return filteredCodes.length > 0
  }
  if (isAggregation(code) && code.length === 20) {
    // checking codes with (00)
    const filteredCodes = codes.filter((item) => code.slice(2) === item || item === code);
    return filteredCodes.length > 0
  }
  return codes.includes(code);
};
