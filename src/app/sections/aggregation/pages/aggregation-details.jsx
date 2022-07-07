import React, { useEffect, useRef } from "react";
import { useStore } from "effector-react";
import { Form, Row, Alert, Col, Button, Spin, Input } from "antd";
import ReactToPrint from "react-to-print";

import effector from "../effector";

import { ArrowSvg, DoneSvg} from "svgIcons/svg-icons";

const { store, events, effects } = effector;

const Barcode = require("react-barcode");


export const AggregationDetails = (props) => {
  const { match } = props;

  const barcodePrintRef = useRef(null);
  
  const $aggregationDetails = useStore(store.$aggregationDetails);
  const { data: aggregationDetails, error: aggregationDetailsError, loading } = $aggregationDetails;

  useEffect(() => {
    effects.getAggregationDetailsEffect(match.params.id);

    return () => {
      events.resetAggregationDetails();
    };
  }, []);

  return (
    <>
      <div className="content-h1-wr">
        <div className="content-h1-wr__left">
          <Button className="custom-button add-button onlyicon b-r-30 m-r-10 rotate-left" onClick={() => props.history.goBack()}>
            <ArrowSvg />
          </Button>
          <h1>Агрегация > {aggregationDetails && aggregationDetails.printCode}</h1>
        </div>
      </div>
      <div className="site-content__in aggregation-details">
        <div className="content-block">
          <Form layout={"vertical"} requiredMark={false}>
            {aggregationDetailsError && (
              <div className="m-b-20">
                <Alert message={aggregationDetailsError.title || aggregationDetailsError.message} type="error" />
              </div>
            )}
            {loading && (
              <div className="abs-loader">
                <Spin size="large" />
              </div>
            )}

            <div>
              {aggregationDetails && (
                <>
                  {aggregationDetails.status !== "DRAFT" && (
                    <>
                      <Row justify="space-between" gutter={[20, 0]}>
                        <Col span={12}>
                          <Form.Item label="Продукция">
                            <Input value={aggregationDetails.productName} readOnly={true} />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item label="Тип упаковки">
                            <Input value={aggregationDetails.unitName} readOnly={true} />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item label="Кол-во бутылок">
                            <Input value={aggregationDetails.quantity} readOnly={true} />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Form.Item label="Описание">
                        <Input.TextArea value={aggregationDetails.description} readOnly={true} />
                      </Form.Item>
                      <div className="codesList">
                        {aggregationDetails.marks.map((item, index) => (
                          <div key={index} className="codesItem">
                            <div className="codesItemIcon">
                              <DoneSvg />
                            </div>
                            <div className="codesItemCode">{item}</div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  <div className="resultWrap">
                    <div className="resultRow">
                      <div className="resultPrintWr" ref={barcodePrintRef}>
                        <div className="resultPrintBarcode">
                          <div className="resultPrintBarcodeInner">
                            <Barcode format="CODE128" value={aggregationDetails.printCode} />
                          </div>
                        </div>
                      </div>
                      {barcodePrintRef && (
                        <div className="resultButton">
                          <ReactToPrint
                            trigger={() => <Button className="custom-button">Печать</Button>}
                            content={() => barcodePrintRef.current}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};