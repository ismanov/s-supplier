import React from "react";
import { Col, Row } from "antd";

export const AddAggregationStatusPanel = (props) => {
  const { form, addedMarksLength, error } = props;

  const product = form.getFieldValue("product");
  const packageTypeObj = form.getFieldValue("packageTypeObj");
  const quantity = form.getFieldValue("quantity");

  return (
    <div className="statusPanel">
      <Row justify="space-between" gutter={[15, 0]}>
        <Col span={8}>
          <div className="ag-info">
            <div className="ag-infoItem">
              <div className="ag-infoItemName">Название</div>
              <div className="ag-infoItemValue">{product && product.name}</div>
            </div>
            <div className="ag-infoItem">
              <div className="ag-infoItemName">Упаковка</div>
              <div className="ag-infoItemValue">{packageTypeObj && packageTypeObj.name}</div>
            </div>
          </div>
        </Col>
        <Col span={8}>
          <div className={`ag-status ${error ? "ag-error-status" : ""}`}>
            <div className="ag-statusName">Статус</div>
            <div className="ag-statusText">{error ? "Ошибка" : "ОК"}</div>
          </div>
        </Col>
        <Col span={8}>
          <div className="ag-counter">
            {addedMarksLength} / {quantity}
          </div>
        </Col>
      </Row>
    </div>
  );
};
