import React, { useEffect, useRef } from "react";
import { useStore } from "effector-react";
import ReactToPrint from "react-to-print";
import { Button, Spin } from "antd";

import effector from "../effector";

import { ArrowSvg } from "svgIcons/svg-icons";

const Barcode = require("react-barcode");

const { store, events, effects } = effector;

export const AggregationOrderPrint = (props) => {
  const { match, history } = props;

  const barcodePrintRef = useRef(null);

  const batchId = match.params.batchId;

  const $aggregationsList = useStore(store.$aggregationOrderCodes);

  const { data: codes, loading } = $aggregationsList;

  useEffect(() => {
    effects.getAggregationOrderCodesEffect(batchId);

    return () => {
      events.resetAggregationOrderCodesEvent();
    };
  }, []);

  return (
    <>
      <div className="content-h1-wr">
        <div className="content-h1-wr__left">
          <Button className="custom-button add-button onlyicon b-r-30 m-r-10 rotate-left" onClick={() => history.push("/orders")}>
            <ArrowSvg />
          </Button>
          <h1>Печать кодов агрегации</h1>
        </div>
        <div>
          {barcodePrintRef && (
            <ReactToPrint
              trigger={() => (
                <Button className="custom-button" minW={185}>
                  Печать
                </Button>
              )}
              content={() => barcodePrintRef.current}
            />
          )}
        </div>
      </div>

      <div className="site-content__in aggregationOrderPrint">
        {loading && (
          <div className="abs-loader">
            <Spin size="large" />
          </div>
        )}
        <div ref={barcodePrintRef}>
          {codes.map((code) => (
            <>
              <div className="aggregationCode" key={code}>
                <div className="resultPrintBarcode">
                  <div className="resultPrintBarcodeInner">
                    <Barcode format="CODE128" value={code} />
                  </div>
                </div>
              </div>
              <div className="pagebreak" />
            </>
          ))}
        </div>
      </div>
    </>
  );
};