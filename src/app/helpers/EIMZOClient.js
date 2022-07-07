import $ from "jquery";
// import { config } from "../utils/config";
// import * as constants from "../constants";

// import { message, notification } from "antd";

const EIMZO_MAJOR = 3;
const EIMZO_MINOR = 37;

const errorCAPIWS =
  "Ошибка соединения с E-IMZO. Возможно у вас не установлен модуль E-IMZO или Браузер E-IMZO.";
const errorBrowserWS =
  "Браузер не поддерживает технологию WebSocket. Установите последнюю версию браузера.";
const errorUpdateApp =
  'ВНИМАНИЕ !!! Установите новую версию приложения E-IMZO или Браузера E-IMZO.<br /><a href="https://e-imzo.uz/root/downloads/" role="button">Скачать ПО E-IMZO</a>';
const errorWrongPassword = "Пароль неверный.";

const loadEImzoApiKeys = (success) => {
  window.EIMZOClient.API_KEYS = [
    "localhost",
    "96D0C1491615C82B9A54D9989779DF825B690748224C2B04F500F370D51827CE2644D8D4A82C18184D73AB8530BB8ED537269603F61DB0D03D2104ABF789970B",
    "127.0.0.1",
    "A7BCFA5D490B351BE0754130DF03A068F855DB4333D43921125B9CF2670EF6A40370C646B90401955E1F7BC9CDBF59CE0B2C5467D820BE189C845D0B79CFC96F",
    "null",
    "E0A205EC4E7B78BBB56AFF83A733A1BB9FD39D562E67978CC5E7D73B0951DB1954595A20672A63332535E13CC6EC1E1FC8857BB09E0855D7E76E411B6FA16E9D",
    "supply.smartpos.uz",
    "5DD38012EDA57A1B21244B7FA5425D8115456AE9750ECF6C5B6222F6ED1CA5A62BC59A85F1B9F5CBB0D4A1F8AD9EBBA327562569C21D34CBAB87F0E867EC7809",
  ];
  window.EIMZOClient.checkVersion(
    (major, minor) => {
      const newVersion = EIMZO_MAJOR * 100 + EIMZO_MINOR;
      const installedVersion = parseInt(major) * 100 + parseInt(minor);
      if (installedVersion < newVersion) {
        updateAppMessage();
      } else {
        window.EIMZOClient.installApiKeys(
          () => {
            loadKeys(success);
          },
          (e, r) => {
            if (r) {
              showMessage(r);
            } else {
              wsError(e);
            }
          }
        );
      }
    },
    (e, r) => {
      if (r) {
        showMessage(r);
      } else {
        notLoadedMessage(e);
      }
    }
  );
};

const createEImzoPkcs7 = (docKeyId, data, success, fail) => {
  window.EIMZOClient.createPkcs7(
    docKeyId,
    JSON.stringify(data),
    timeStamperRequest,
    success,
    (e, r) => {
      if (r) {
        if (r.indexOf("BadPaddingException") !== -1) {
          //    showMessage(constants.errorWrongPassword);
          //     message.success(constants.errorWrongPassword, 4);
          // notification.open({
          //     message: 'Ошибка',
          //     description:
          //     errorWrongPassword,
          // });
        } else {
          showMessage(r);
        }
      } else {
        showMessage(errorBrowserWS);
      }
      if (e) wsError(e);
      fail();
    }
  );
};

const appendPkcs7Attached = (docKeyId, data, success, fail) => {
  window.EIMZOClient.appendPkcs7Attached(
    docKeyId,
    data,
    timeStamperRequest,
    success,
    (e, r) => {
      if (r) {
        if (r.indexOf("BadPaddingException") !== -1) {
          //     showMessage(constants.errorWrongPassword);
          // notification.open({
          //     message: 'Ошибка',
          //     description:
          //     errorWrongPassword,
          // });
        } else {
          showMessage(r);
        }
      } else {
        showMessage(errorBrowserWS);
      }
      if (e) wsError(e);
      fail();
    }
  );
};

const loadKey = (json, success) => {
  window.EIMZOClient.loadKey(json, success, (e, r) => {
    if (r) {
      if (r.indexOf("BadPaddingException") !== -1) {
        // notification.open({
        //     message: 'Ошибка',
        //     description:
        //     errorWrongPassword,
        // });
      } else {
        showMessage(r);
      }
    } else {
      showMessage(errorBrowserWS);
    }
    if (e) wsError(e);
  });
};

const loadKeys = (success) => {
  window.EIMZOClient.listAllUserKeys(
    (o, i) => {
      return "itm-" + o.serialNumber + "-" + i;
    },
    (itemId, v) => {
      return createItem(itemId, v);
    },
    success,
    (e, r) => {
      showMessage(errorCAPIWS);
    }
  );
};

const createItem = (itmkey, vo) => {
  const now = new Date();
  vo.expired = window.dates.compare(now, vo.validTo) > 0;

  return {
    key: itmkey,
    data: vo,
    text: vo.CN,
    expired: vo.expired,
  };
};

const showMessage = (message) => {
  alert(message);
};

const wsError = (e) => {
  if (e) {
    //  showMessage(constants.errorCAPIWS + " : " + e);
    // message.success(errorCAPIWS, 10);
  } else {
    showMessage(errorBrowserWS);
  }
};

const updateAppMessage = () => {
  alert(errorUpdateApp);
};

const notLoadedMessage = (e) => {
  e ? wsError(e) : showMessage(errorBrowserWS);
};

const timeStamperRequest = (signature_hex, callback, fail) => {
  $.ajax({
    url: "https://api.x-file.uz/api/timestamp_signature",
    method: "GET",
    data: {
      signatureHex: signature_hex,
    },
    success: (data) => {
      if (data.success) {
        callback(data.data);
      } else {
        fail(data.reason);
      }
    },
    error: (response) => {
      console.log(JSON.stringify(response));
      fail(response);
    },
  });
};

export default {
  loadEImzoApiKeys,
  createEImzoPkcs7,
  appendPkcs7Attached,
  loadKey,
};
