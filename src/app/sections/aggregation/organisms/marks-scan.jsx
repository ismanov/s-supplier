import React from "react";
import { Button } from "antd";
import BarcodeReader from "react-barcode-reader";

import { CloseOutlined, MarkEmptyIconSvg, MarkErrorSvg, MarkSuccessSvg } from "svgIcons/svg-icons";
import { openNotificationWithIcon } from "helpers/open-notification-with-icon";
import { validateMarkCode } from "helpers/validate-aggregation-code";

const Barcode = require("react-barcode");

export const MarksScan = (props) => {
  const { codes, setCodes, quantity, aggregationCode, disabled, alreadyExistList } = props;

  const onScanComplete = (text) => {

    if (!validateMarkCode(text)) {
      openNotificationWithIcon("warning", "Неверный формат кода маркировки");
      return;
    }

    if (codes.length < parseInt(quantity)) {
      const duplicate = codes.find((code) => code === text);

      if (duplicate) {
        openNotificationWithIcon("warning", "Данный КМ уже добавлен");
      } else {
        setCodes([...codes, text]);
      }
    } else {
      openNotificationWithIcon("warning", "Достигнуто максимальное количество");
    }
  };

  const onRemoveMarkClick = (index) => {
    const codesClone = [...codes];
    codesClone.splice(index, 1);

    setCodes(codesClone);
  };

  const isError = (code) => {
    return alreadyExistList && alreadyExistList.includes(code);
  };

  const emptyCodes = new Array(quantity - codes.length).fill(0);

  return (
    <div className="MarksScan">
      <div className="aggregationCode">
        <Barcode format="CODE128" height={30} value={aggregationCode} />
      </div>
      <div className="codesList">
        {!disabled && <BarcodeReader onScan={onScanComplete} timeBeforeScanTest={300} />}

        {codes.map((item, index) => {
          const error = isError(item);

          return (
            <div key={index} className={`codesItem ${error ? "codesItemError" : ""}`}>
              {error ? (
                <>
                  <div className="codesItemErrorText">Код уже используется</div>
                  <div className="codesItemErrorIcon">
                    <Button icon={<MarkErrorSvg />} onClick={() => onRemoveMarkClick(index)} />
                  </div>
                </>
              ) : (
                <>
                  <div className="codesItemIcon">
                    <MarkSuccessSvg />
                  </div>
                  <div className="codesItemCode">
                    <div className="codesItemNum">{index + 1}.</div>
                    {item}
                  </div>
                  {!disabled && (
                    <Button
                      className="codesItemRemove"
                      icon={<CloseOutlined />}
                      onClick={() => onRemoveMarkClick(index)}
                    />
                  )}
                </>
              )}
            </div>
          );
        })}
        {emptyCodes.map((item, index) => (
          <div key={index} className={`codesItem codesItemEmpty`}>
            <div className="codesItemIcon">
              <MarkEmptyIconSvg />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};