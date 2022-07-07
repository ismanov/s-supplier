import React, { useState, useEffect } from "react";
import { useStore } from "effector-react";
import { Alert, Form, Modal, Spin, Button, Select } from "antd";

import effector from "../effector";

import { CloseModalSvg } from "svgIcons/svg-icons";
import { FormField } from "ui/molecules/form-field";
import { openNotificationWithIcon } from "helpers/open-notification-with-icon";

const { store, effects, events } = effector;

const { Option } = Select;

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

export const ChangeUserBranchStatusModal = (props) => {
  const { $changeUserBranchStatus } = useStore(store);

  const { modalProps, setModalProps } = props;

  const { branch } = modalProps;

  const [ formFields, setFormFields ] = useState({
    id: branch.id
  });
  const [ fieldsErrors, setFieldsErrors ] = useState({});

  useEffect(() => {
    if ($changeUserBranchStatus.success) {
      openNotificationWithIcon('success', 'Статус обновлен');
      closeModal();
    }
  }, [$changeUserBranchStatus.success]);


  const onFormFieldChange = (prop, val) => {
    setFormFields({
      ...formFields,
      [prop]: val
    });
  };

  const closeModal = () => {
    setModalProps({ ...modalProps, visible: false });
  };

  const afterClose = () => {
    events.resetChangeUserBranchStatusEvent();

    setModalProps({ ...modalProps, shouldRender: false, branch: null });
  };

  const validateForm = () => {
    const notFilledMessage = "Не заполнено поле";

    const errors = {};

    if (!formFields.status) errors.status = notFilledMessage;

    return errors;
  };

  const onSubmit = () => {
    const errors = validateForm();

    if (Object.keys(errors).length) {
      setFieldsErrors(errors);
      return;
    }

    setFieldsErrors({});

    effects.changeUserBranchStatusEffect(formFields);
  };

  return (
    <Modal
      className="custom-modal"
      title={`Статус филиала ${branch.name}`}
      visible={modalProps.visible}
      onCancel={closeModal}
      afterClose={afterClose}
      footer={null}
      width={464}
      centered={true}
      closeIcon={<CloseModalSvg />}
    >
      <FormState error={$changeUserBranchStatus.error} loading={$changeUserBranchStatus.loading} />
      <Form onFinish={onSubmit}>
        <FormField title="Статус" error={fieldsErrors.status}>
          <Select
            placeholder="Выбрать статус"
            value={formFields.status}
            onChange={(status) => onFormFieldChange("status", status)}
          >
            <Option value="ACTIVE">Активный</Option>
            <Option value="IN_ACTIVE">Не активный</Option>
          </Select>
        </FormField>
        <div className="custom-modal__button-row">
          <Button htmlType="submit" className="custom-button primary-button fullwidth">Сохранить</Button>
        </div>
      </Form>
    </Modal>
  )
};