import React, { useState, useEffect } from "react";
import { useStore } from "effector-react";
import InputMask from "react-input-mask";
import { Modal, Form, Alert, Spin, Input, Select, Button, Checkbox } from "antd";

import effector from "../effector";

const { store, effects, events } = effector;

import { debounce } from "helpers/debounce";
import { openNotificationWithIcon } from "helpers/open-notification-with-icon";
import { FormField } from "ui/molecules/form-field";
import { CloseModalSvg } from "svgIcons/svg-icons";

const { Option } = Select;

const updateFilterSearch = debounce((action) => {
  action();
}, 400);

const FormState = ({ error, loading }) => {
  return (
    <div>
      {error && <div className="m-b-20">
        <Alert message={error.detail || error.title} type="error"/>
      </div>}
      {loading && <div className="abs-loader">
        <Spin size="large"/>
      </div>}
    </div>
  )
};

export const UserCompanyBankInfoUpdateModal = (props) => {
  const { $addUserCompanyBankInfo, $updateUserCompanyBankInfo, $companyBankCategories, $companyBanks, $companyBankBranches } = useStore(store);

  const { modalProps, setModalProps } = props;

  const { userCompanyBankInfo: userCompanyBankInfoProps } = modalProps;

  const [formFields, setFormFields] = useState({
    main: true
  });

  const [fieldsErrors, setFieldsErrors] = useState({});

  useEffect(() => {
    effects.getCompanyBanksEffect({
      orderBy: "id",
      size: 100
    });

    if (userCompanyBankInfoProps) {
      setFormFields({
        bankId: userCompanyBankInfoProps.bank.id,
        parentBank: userCompanyBankInfoProps.parentBank && userCompanyBankInfoProps.parentBank.id || null,
        accountNumber: userCompanyBankInfoProps.accountNumber,
        oked: userCompanyBankInfoProps.oked,
        main: userCompanyBankInfoProps.main,
        id: userCompanyBankInfoProps.id
      });
      effects.getCompanyBankBranchesEffect({
        orderBy: "id",
        parentId: userCompanyBankInfoProps.parentBank && userCompanyBankInfoProps.parentBank.id,
        size: 100,
      })
    }
  }, []);

  useEffect(() => {
    if ($updateUserCompanyBankInfo.success) {
      openNotificationWithIcon("success", "Данные банка обновлены");
      closeModal();
    }

    if ($addUserCompanyBankInfo.success) {
      openNotificationWithIcon("success", "Данные банка добавлены");
      closeModal();
    }
  }, [$addUserCompanyBankInfo.success, $updateUserCompanyBankInfo.success]);


  const closeModal = () => {
    setModalProps({ ...modalProps, visible: false });
  };

  const afterClose = () => {
    events.resetCompanyBankCategoriesEvent();
    events.resetCompanyBanksEvent();
    events.resetCompanyBankBranchesEvent();
    events.resetAddUserCompanyBankInfoEvent();
    events.resetUpdateUserCompanyBankInfoEvent();

    setModalProps({ ...modalProps, shouldRender: false, userCompanyBankInfo: null });
  };

  const onBankChange = (prop, val) => {
    setFormFields({
      ...formFields,
      [prop]: val,
      bankId: undefined
    });

    effects.getCompanyBankBranchesEffect({
      orderBy: "id",
      parentId: val,
      size: 100,
    });
    events.resetCompanyBankBranchesEvent();
  };

  const onBankSearch = (search) => {
    updateFilterSearch(() => {
      effects.getCompanyBanksEffect({
        orderBy: "id",
        size: 100,
        search
      });
    })
  }

  const onBankBranchSearch = (search) => {
    const { parentBank } = formFields;
    if (!parentBank) return;
    updateFilterSearch(() => {
      effects.getCompanyBankBranchesEffect({
        orderBy: "id",
        parentId: parentBank,
        size: 100,
        search,
      });
    })
  }

  const onFormFieldChange = (prop, val) => {
    setFormFields({
      ...formFields,
      [prop]: val
    });
  };

  const validateForm = () => {
    const notFilledMessage = "Не заполнено поле";

    const errors = {};

    if (!formFields.bankId) errors.bankId = notFilledMessage;
    if (!formFields.parentBank) errors.parentBank = notFilledMessage;
    if (!formFields.accountNumber) errors.accountNumber = notFilledMessage;
    if (!formFields.oked) errors.oked = notFilledMessage;

    return errors;
  };

  const onSubmit = () => {
    const errors = validateForm();

    if (Object.keys(errors).length) {
      setFieldsErrors(errors);
      return;
    }

    setFieldsErrors({});
    const data = {
      bankId: formFields.bankId,
      parentBank: formFields.parentBank,
      accountNumber: formFields.accountNumber.split(" ").join(""),
      oked: formFields.oked,
      main: formFields.main,
      id: formFields.id
    };

    if (userCompanyBankInfoProps) {
      effects.updateUserCompanyBankInfoEffect(data);
    } else {
      effects.addUserCompanyBankInfoEffect(data);
    }
  };

  return (
    <Modal
      className="custom-modal"
      title={userCompanyBankInfoProps ? "Редактирование банка" : "Добавить банк"}
      visible={modalProps.visible}
      onCancel={closeModal}
      afterClose={afterClose}
      footer={null}
      width={464}
      centered={true}
      closeIcon={<CloseModalSvg/>}
    >
      <FormState error={$addUserCompanyBankInfo.error} loading={$addUserCompanyBankInfo.loading}/>
      <FormState error={$updateUserCompanyBankInfo.error} loading={$updateUserCompanyBankInfo.loading}/>
      <Form onFinish={onSubmit}>
        <FormField title="Банк" error={fieldsErrors.parentBank}>
          <Select
            className={`custom-select ${fieldsErrors.parentBank ? "custom-select-error" : ""}`}
            loading={$companyBanks.loading}
            placeholder="Выбрать банк"
            value={$companyBanks.data.length ? formFields.parentBank : undefined}
            onChange={(parentBank) => onBankChange("parentBank", parentBank)}
            onSearch={onBankSearch}
            showSearch
            filterOption={(
              input,
              option
            ) =>
              option.children
                .toLowerCase()
                .indexOf(
                  input.toLowerCase()
                ) >= 0
            }
          >
            {$companyBanks.data.map((item) => <Option value={item.id} key={item.id}>{item.name}</Option>)}
          </Select>
        </FormField>
        <FormField title="Филиал" error={fieldsErrors.bankId}>
          <Select
            className={`custom-select ${fieldsErrors.bankId ? "custom-select-error" : ""}`}
            loading={$companyBankBranches.loading}
            placeholder="Выбрать филиал"
            value={$companyBankBranches.data.length ? formFields.bankId : undefined}
            onChange={(bankId) => onFormFieldChange("bankId", bankId)}
            onSearch={onBankBranchSearch}
            showSearch
            filterOption={(
              input,
              option
            ) =>
              option.children
                .toLowerCase()
                .indexOf(
                  input.toLowerCase()
                ) >= 0
            }
          >
            {$companyBankBranches.data.map((item) => <Option value={item.id} key={item.id}>{item.name}</Option>)}
          </Select>
        </FormField>
        <FormField title="Расчетный счет" error={fieldsErrors.accountNumber}>
          <InputMask
            className={`ant-input custom-input ${fieldsErrors.accountNumber ? "custom-input-error" : ""}`}
            placeholder="XXXXX XXX X XXXXXXXX XXX"
            mask="99999 999 9 99999999 999"
            value={formFields.accountNumber ? formFields.accountNumber : ""}
            maskChar=""
            onChange={(e) => onFormFieldChange("accountNumber", e.target.value)}
          />
        </FormField>
        <FormField title="ОКЭД" error={fieldsErrors.oked}>
          <InputMask
            className={`ant-input custom-input ${fieldsErrors.oked ? "custom-input-error" : ""}`}
            placeholder="XXXXX"
            mask="99999"
            value={formFields.oked ? formFields.oked : ""}
            maskChar=""
            onChange={(e) => onFormFieldChange("oked", e.target.value)}
          />
        </FormField>
        <FormField className="m-t-20">
          <Checkbox
            className="custom-checkbox-2"
            onChange={(e) => onFormFieldChange("main", e.target.checked)}
            checked={formFields.main}
          >
            Основной банк
          </Checkbox>
        </FormField>
        <div className="custom-modal__button-row">
          <Button htmlType="submit" className="custom-button primary-button fullwidth">
            {userCompanyBankInfoProps ? "Сохранить" : "Добавить"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};