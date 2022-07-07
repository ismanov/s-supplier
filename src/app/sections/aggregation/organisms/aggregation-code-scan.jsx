import React from "react";
import BarcodeReader from "react-barcode-reader";

import { ScanIconSvg } from "svgIcons/svg-icons";

import { validateAggregationCode } from "helpers/validate-aggregation-code";
import { openNotificationWithIcon } from "helpers/open-notification-with-icon";

const Barcode = require("react-barcode");

export const AggregationCodeScan = (props) => {
  const { code, setCode, disabled, alreadyExist } = props;

  const onScanComplete = (data) => {
    if (!validateAggregationCode(data)) {
      openNotificationWithIcon("warning", "Неверный формат кода агрегации");
      return;
    }

    setCode(data);
  };

  return (
    <div className="aggregationCodeScan">
      {code ? (
        <div className="aggregationCode">
          <Barcode format="CODE128" value={code} />
        </div>
      ) : (
        <div>
          <div className="aggregationCode-placeholder">
            <div className="placeholderIcon">
              <ScanIconSvg />
            </div>
            Отсканируйте код агрегации
          </div>
        </div>
      )}
      {!disabled && <BarcodeReader onScan={onScanComplete} timeBeforeScanTest={300} />}
    </div>
  );
};