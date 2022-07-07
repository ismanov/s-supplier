import React from "react";
import { Popconfirm, Button } from "antd";
import Cookies from "js-cookie";

export const AddAggregationSteps = (props) => {
  const { currentStep, onCancel } = props;

  const steps = [
    { key: "1", name: "Данные агрегации" },
    { key: "2", name: "Код агрегации" },
    { key: "3", name: "Агрегация" },
  ];

  const boxCounter = Cookies.get('boxCounter') || "0";

  return (
    <div className="stepsRow">
      <div className="stepsRowLeft">
        <div className="stepsInner">
          {steps.map((item) => (
            <div key={item.key} className={currentStep === parseInt(item.key) ? "step-active" : ""}>
              {item.name}
            </div>
          ))}
        </div>
        <div className="boxesCount">
          <div className="boxesCountLabel">Кол-во упаковок:</div>
          <div className="boxesCountValue">{boxCounter}</div>
        </div>
      </div>
      <Popconfirm placement="topLeft" title="Вы уверены что хотите завершить агрегацию?" onConfirm={onCancel}>
        <Button className="custom-button danger-button">
          Завершить
        </Button>
      </Popconfirm>
    </div>
  );
};