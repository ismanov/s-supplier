import React, { useState, useEffect } from "react";
import { useStore } from "effector-react";
import { Form, Input, Button, Select, Upload, DatePicker, Spin, Tooltip, Alert } from "antd";
import moment from "moment";

import effector from "../effector";

import { UploadSvg } from "svgIcons/svg-icons";
import { FormField } from "ui/molecules/form-field";
import { FormState } from "ui/molecules/form-state";
import { openNotificationWithIcon } from "helpers/open-notification-with-icon";
import { dateDiffernce } from "helpers/date-differnce";

moment.locale('ru');

const { store, effects, events } = effector;

const { Option } = Select;

export const OrderContract = ({ orderInfo }) => {
  const { $uploadContractFile, $saveCurrentContract, $contractTypes, $currentContracts, $contractDetails } = useStore(store);

  const [ uploadMode, setUploadMode ] = useState(false);
  const [ formFields, setFormFields ] = useState({
    contract: "NEW",
    uploadedDocuments: []
  });
  const [ fieldsErrors, setFieldsErrors ] = useState({});

  let lastDaysOfContract = 0;

  useEffect(() => {
    if (orderInfo.contract) {
      effects.getContractDetailsEffect(orderInfo.id);
    } else {
      effects.getContractTypesEffect();
      effects.getCurrentContractsEffect({
        orderBy: "id",
        supplierId: orderInfo.supplier.id,
        customerId: orderInfo.customer.id
      });
    }
  }, []);

  useEffect(() => {
    if ($uploadContractFile.success) {
      openNotificationWithIcon('success', 'Договор прикреплён');

      events.resetUploadContractFileEvent();

      effects.getOrderInfoEffect({
        id: orderInfo.id
      });

      effects.getContractDetailsEffect(orderInfo.id);

      setUploadMode(false);
      setFormFields({
        contract: "NEW",
        uploadedDocuments: []
      })
    }
  }, [ $uploadContractFile.success ]);

  useEffect(() => {
    if ($saveCurrentContract.success) {
      openNotificationWithIcon('success', 'Договор прикреплён');

      events.resetSaveCurrentContractEvent();

      effects.getOrderInfoEffect({
        id: orderInfo.id
      });

      effects.getContractDetailsEffect(orderInfo.id);

      setUploadMode(false);
      setFormFields({
        contract: "NEW",
        uploadedDocuments: []
      })
    }
  }, [ $saveCurrentContract.success ]);

  if ($contractDetails.data.expiryDate) {
    const nowDate = moment(Date.now()).format('YYYY-MM-DD');
    const exDate = moment($contractDetails.data.expiryDate).format('YYYY-MM-DD');

    lastDaysOfContract = dateDiffernce(nowDate, exDate) + 1; // + 1 учитывая текущий день
  }

  const onChangeContract = () => {
    setUploadMode(true);

    effects.getContractTypesEffect();
    effects.getCurrentContractsEffect({
      orderBy: "id",
      supplierId: orderInfo.supplier.id,
      customerId: orderInfo.customer.id
    });
  };

  const onFormFieldChange = (prop, val) => {
    setFormFields({
      ...formFields,
      [prop]: val
    });
  };

  const onContractFieldChange = (contractId) => {
    if (contractId === "NEW") {
      setFormFields({
        contract: "NEW",
        uploadedDocuments: []
      })
    } else {
      $currentContracts.data.forEach((item) => {
        if (item.id === contractId) {
          setFormFields({
            contract: contractId,
            contractNumber: item.contractNumber,
            contractType: item.contractType.code,
            startDate: item.startDate,
            expiryDate: item.expiryDate
          });
        }
      });
    }
  };

  const uploadProps = {
    onRemove: () => {
      onFormFieldChange("uploadedDocuments", []);
    },
    beforeUpload: (file) => {
      onFormFieldChange("uploadedDocuments", [file]);

      return false;
    },
    fileList: formFields.uploadedDocuments,
  };

  const onStartDateChange = (moment, date) => {
    setFormFields({
      ...formFields,
      startDate: date,
      expiryDate: undefined
    });
  };

  const disabledFututeDate = (current) => {
    const fromTodayToCurent = dateDiffernce(moment(current).format('YYYY-MM-DD'), moment(Date.now()).format('YYYY-MM-DD'));

    return current && fromTodayToCurent < 0;
  };

  const disabledDate = (current) => {
    const fromStartToCurent = dateDiffernce(moment(current).format('YYYY-MM-DD'), moment(formFields.startDate).format('YYYY-MM-DD'));

    return current && fromStartToCurent > 0;
  };

  const validateForm = () => {
    const notFilledMessage = "Не заполнено поле";

    const errors = {};

    if (formFields.contract === "NEW" && !formFields.uploadedDocuments.length) errors.file = notFilledMessage;

    if (!formFields.contractType) errors.contractType = notFilledMessage;
    if (!formFields.contractNumber) errors.contractNumber = notFilledMessage;
    if (!formFields.startDate) errors.startDate = notFilledMessage;
    if (!formFields.expiryDate) errors.expiryDate = notFilledMessage;

    return errors;
  };

  const onSubmit = () => {
    const errors = validateForm();

    if (Object.keys(errors).length) {
      setFieldsErrors(errors);
      return;
    }

    setFieldsErrors({});

    if (formFields.contract !== "NEW") {
      effects.saveCurrentContractEffect({
        purchaseOrderId: orderInfo.id,
        id: formFields.contract
      });
    } else {
      const fileData = new FormData();
      fileData.append('file', formFields.uploadedDocuments[0]);
      fileData.append('body', JSON.stringify({
        purchaseOrderId: orderInfo.id,
        customerId: orderInfo.customer.id,
        supplierId: orderInfo.supplier.id,
        contractNumber: formFields.contractNumber,
        contractType: {
          code: formFields.contractType
        },
        expiryDate: formFields.expiryDate,
        startDate: formFields.startDate,
      }));

      effects.uploadContractFileEffect(fileData);
    }
  };

  return (
    <div className="order-contract">
      {$contractDetails.error && <div className="m-b-20">
        <Alert message={$contractDetails.error.detail || $contractDetails.error.title} type="error"/>
      </div>}
      {$contractDetails.loading && <div className="abs-loader">
        <Spin size="large"/>
      </div>
      }
      <div className="order-contract__details">
        {Object.keys($contractDetails.data).length > 0 &&
          <>
            <div className="order-contract__details__left">
              <div className="order-contract__details__item">
                Статус договора: <span>{$contractDetails.data.status.nameRu}</span>
              </div>
              <div className="order-contract__details__item">
                Договор №: <span>{$contractDetails.data.contractNumber}</span>
              </div>
              <div className="order-contract__details__item">
                Тип договора: <span>{$contractDetails.data.contractType.nameRu}</span>
              </div>
              <div className="order-contract__details__item">
                Дата начала: <span>{$contractDetails.data.startDate}</span>
              </div>
              <div className="order-contract__details__item">
                Дата окончания: <span>{$contractDetails.data.expiryDate}</span>
              </div>
              {$contractDetails.data.status.code === "DOCUMENT_ATTACHED" &&
                <div className="order-contract__details__item__warning">
                  {lastDaysOfContract < 1 ? "Срок действия договора истек"
                    : lastDaysOfContract < 4 ? `До окончания договора ${lastDaysOfContract === 1 ? `остался ${lastDaysOfContract} день` : `осталось ${lastDaysOfContract} дня`}`
                      : ""
                  }
                </div>
              }
              {$contractDetails.data.originalDocument.id !== $contractDetails.data.document.id &&
                <div className="order-contract__details__item">
                  <a className="order-contract__details__button" href={$contractDetails.data.document.path} target="_blank">
                    Посмотреть договор
                  </a>
                </div>
              }
              <div className="order-contract__details__item">
                <a className="order-contract__details__button" href={$contractDetails.data.originalDocument.path} target="_blank">
                  Посмотреть оригинальный договор
                </a>
              </div>
              {$contractDetails.data.reason &&
                <div className="order-contract__details__item">
                  Причина отклонения договора: {$contractDetails.data.reason}
                </div>
              }
            </div>
            {(!uploadMode && $contractDetails.data.status.code !== "ACCEPTED") &&
              <div className="order-contract__details__right">
                <Tooltip placement="topRight" title="Прикрепить договор">
                  <Button onClick={onChangeContract} className="custom-button primary-button onlyicon">
                    <UploadSvg />
                  </Button>
                </Tooltip>
              </div>
            }
          </>
        }
      </div>
      {(uploadMode || orderInfo.status.code === "WAITING_FOR_CONTRACT_ATTACHMENT") &&
        <Form onFinish={onSubmit}>
          <FormState error={$uploadContractFile.error || $saveCurrentContract.error} loading={$uploadContractFile.loading || $saveCurrentContract.loading}/>
          <FormField title="Договор">
            <Select
              value={formFields.contract}
              onChange={onContractFieldChange}
            >
              <Option value="NEW">Новый</Option>
              {$currentContracts.data.map((item) => <Option value={item.id} key={item.id}>
                Договор №: {item.contractNumber}
              </Option>)}
            </Select>
          </FormField>
          {formFields.contract === "NEW" &&
            <>
              <FormField title="Загрузить файл" error={fieldsErrors.file}>
                <Upload {...uploadProps}>
                  <Button>Выбрать файл</Button>
                </Upload>
              </FormField>
            </>
          }
          <FormField title="Тип договора" error={fieldsErrors.contractType}>
            <Select
              disabled={formFields.contract !== "NEW"}
              loading={$contractTypes.loading}
              placeholder="Выберите тип договора"
              value={formFields.contractType}
              onChange={(contractType) => onFormFieldChange("contractType", contractType)}
            >
              {$contractTypes.data.map((item) => <Option value={item.code} key={item.code}>{item.nameRu}</Option>)}
            </Select>
          </FormField>
          <FormField title="Номер договора" error={fieldsErrors.contractNumber}>
            <Input
              disabled={formFields.contract !== "NEW"}
              type="text"
              placeholder="Введите номер договора"
              value={formFields.contractNumber}
              onChange={(contractNumber) => onFormFieldChange("contractNumber", contractNumber.target.value.replace(/[^0-9]/g, ''))}
            />
          </FormField>
          <div className="custom-modal__double-row">
            <div className="custom-modal__double-row-item">
              <FormField title="Дата начала" error={fieldsErrors.startDate}>
                <div className="custom-calendar-picker">
                  <DatePicker
                    disabledDate={disabledFututeDate}
                    disabled={formFields.contract !== "NEW"}
                    {...(formFields.startDate ? {value: moment(formFields.startDate)} : {})}
                    onChange={onStartDateChange}
                    allowClear
                  />
                </div>
              </FormField>
            </div>
            <div className="custom-modal__double-row-item">
              <FormField title="Дата окончания" error={fieldsErrors.expiryDate}>
                <div className="custom-calendar-picker">
                  <DatePicker
                    disabledDate={disabledDate}
                    disabled={formFields.contract !== "NEW" || !formFields.startDate}
                    {...(formFields.expiryDate ? {value: moment(formFields.expiryDate)} : {})}
                    onChange={(moment, date) => onFormFieldChange("expiryDate", date)}
                    allowClear
                  />
                </div>
              </FormField>
            </div>
          </div>
          <div className="custom-modal__button-row">
            <Button htmlType="submit" className="custom-button primary-button fullwidth">Отправить</Button>
          </div>
        </Form>
      }
    </div>
  )
};