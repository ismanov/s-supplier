import React, { useEffect, useState } from "react";
import { useStore } from "effector-react";
import { Form, Row, Alert, Spin, Button } from "antd";
import Cookies from "js-cookie";

import effector from "../effector";

import { openNotificationWithIcon } from "helpers/open-notification-with-icon";
import { ArrowSvg } from "svgIcons/svg-icons";

import { AddAggregationSteps } from "../organisms/add-aggregation-steps";
import { AddAggregationStatusPanel } from "../organisms/add-aggregation-status-panel";
import { AddAggregationStep1 } from "../organisms/add-aggregation-step1";
import { AggregationCodeScan } from "../organisms/aggregation-code-scan";
import { MarksScan } from "../organisms/marks-scan";

const { store, events, effects } = effector;

const getSubmitBtnText = (step) => {
  if (step === 3) {
    return "Агрегировать";
  } else {
    return "Продолжить";
  }
};


export const AggregationAdd = (props) => {
  const { backUrl, history } = props;
  const [form] = Form.useForm();

  const [marksCodes, setMarksCodes] = useState([]);
  const [aggregationCode, setAggregationCode] = useState("");
  const [step, setStep] = useState(1);


  const $createAggregation = useStore(store.$createAggregation);
  const { success: createAggregationData, error: createAggregationError, loading } = $createAggregation;

  const goBack = () => {
    history.push(backUrl);
  };

  useEffect(() => {
    effects.getPackageTypesEffect();

    return () => {
      events.resetCreateAggregationEvent();
    };
  }, []);

  const onNextBoxClick = () => {
    events.resetCreateAggregationEvent();

    const boxCounter = Cookies.get('boxCounter') || "0";

    Cookies.set('boxCounter', parseInt(boxCounter) + 1);

    updateMarksCodes([]);
    setAggregationCode("");
    setStep(2);
  };

  useEffect(() => {
    if (createAggregationData) {
      openNotificationWithIcon("success", "Агрегация прошла успешно!");

      onNextBoxClick();
    }
  }, [createAggregationData]);

  const updateMarksCodes = (codes) => {
    setMarksCodes(codes);

    const quantity = form.getFieldValue("quantity");
    if (codes.length === quantity) {
      form.submit();
    }
  };

  const updateAggregationCode = (code) => {
    setAggregationCode(code);

    if (code) {
      form.submit();
    }
  };

  const onCancelClick = () => {
    Cookies.set('boxCounter', 0);
    goBack();
  };

  const onBackClick = () => {
    if (step === 3) {
      setStep(2);
      updateMarksCodes([]);
    } else if (step === 2) {
      if (!marksCodes.length) {
        setStep(1);
      }
    }
    events.resetCreateAggregationEvent();
  };

  const onFinish = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (!aggregationCode) {
        openNotificationWithIcon("warning", "Отсканируйте код агрегации");
        return false;
      }

      setStep(3);
    } else if (step === 3) {
      const { productId, packageType, quantity, description } = form.getFieldsValue([
        "productId",
        "packageType",
        "quantity",
        "description",
      ]);

      if (marksCodes.length !== parseInt(quantity)) {
        openNotificationWithIcon("warning", "Добавлено неверное количество КМ");
        return false;
      }

      const data = {
        productId: productId,
        unit: packageType,
        quantity: quantity,
        description: description,
        marks: marksCodes,
        printCode: aggregationCode,
      };

      effects.createAggregationEffect(data);
    }
  };

  return (
    <>
      <div className="content-h1-wr">
        <div className="content-h1-wr__left">
          <Button className="custom-button add-button onlyicon b-r-30 m-r-10 rotate-left" onClick={() => props.history.goBack()}>
            <ArrowSvg />
          </Button>
          <h1>Создание агрегации</h1>
        </div>
      </div>
      <div className="site-content__in aggregation-add">
        <AddAggregationSteps
          currentStep={step}
          onCancel={onCancelClick}
        />

        {step > 1 && (
          <AddAggregationStatusPanel form={form} error={createAggregationError} addedMarksLength={marksCodes.length} />
        )}

        <div className="content-block">
          <Form className="wrapInner" form={form} layout={"vertical"} onFinish={onFinish} requiredMark={false}>
            <div>
              {createAggregationError && (
                <div className="custom-modal__error">
                  <Alert message={createAggregationError.title || createAggregationError.message} type="error" />
                </div>
              )}
              {loading && (
                <div className="abs-loader">
                  <Spin size="large" />
                </div>
              )}
              {step === 1 && (
                <AddAggregationStep1
                  form={form}
                  disabled={false}
                />
              )}
              {step === 2 && (
                <AggregationCodeScan
                  code={aggregationCode}
                  setCode={updateAggregationCode}
                  disabled={!!createAggregationData}
                  alreadyExist={createAggregationError && createAggregationError.errorCode === -3}
                />
              )}
              {step === 3 && (
                <MarksScan
                  codes={marksCodes}
                  setCodes={updateMarksCodes}
                  quantity={form.getFieldValue("quantity")}
                  aggregationCode={aggregationCode}
                  disabled={false}
                  alreadyExistList={
                    createAggregationError && createAggregationError.errorCode === -2
                      ? createAggregationError.data
                      : undefined
                  }
                />
              )}
            </div>

            <Row justify="space-between">
              <>
                <div>
                  {step === 3 && (
                    <Button type="bordered" onClick={onBackClick}>
                      Назад
                    </Button>
                  )}
                </div>
                <Button type="primary" htmlType="submit">
                  {getSubmitBtnText(step)}
                </Button>
              </>
            </Row>
          </Form>
        </div>
      </div>
    </>
  );
};