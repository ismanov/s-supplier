import React, { useState, useEffect } from "react";
import { useStore } from "effector-react";
import InputMask from "react-input-mask";
import { Modal, Form, Alert, Spin, Input, Button } from "antd";

import effector from "../effector";

const { store, effects, events } = effector;

import { openNotificationWithIcon } from "helpers/open-notification-with-icon";
import { FormField } from "ui/molecules/form-field";
import { CloseModalSvg } from "svgIcons/svg-icons";

export const UserInfoUpdateModal = (props) => {
  const { $updateUserInfo } = useStore(store);

  const { modalProps, setModalProps } = props;

  const { userInfo: userInfoProps } = modalProps;

  const [ formFields, setFormFields ] = useState({});
  const [ fieldsErrors, setFieldsErrors ] = useState({});

  useEffect(() => {
    if ($updateUserInfo.success) {
      openNotificationWithIcon('success', 'Данные пользователя обновлены');
      closeModal();
    }
  }, [$updateUserInfo.success]);

  useEffect(() => {
    if (userInfoProps) {
      setFormFields({
        id: userInfoProps.id,
        lastName: userInfoProps.lastName,
        firstName: userInfoProps.firstName,
        patronymic: userInfoProps.patronymic
      });
    }
  }, []);


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
    events.resetUpdateUserInfoEvent();

    setModalProps({ ...modalProps, shouldRender: false, userInfo: null });
  };

  const validateForm = () => {
    const notFilledMessage = "Не заполнено поле";

    const errors = {};

    if (!formFields.lastName) errors.lastName = notFilledMessage;
    if (!formFields.firstName) errors.firstName = notFilledMessage;
    if (!formFields.patronymic) errors.patronymic = notFilledMessage;

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
      id: userInfoProps.id,
      lastName: userInfoProps.lastName === formFields.lastName ? undefined : formFields.lastName,
      firstName: userInfoProps.firstName === formFields.firstName ? undefined : formFields.firstName,
      patronymic: userInfoProps.patronymic === formFields.patronymic ? undefined : formFields.patronymic
    };

    effects.updateUserInfoEffect(data);
  };

  return (
    <Modal
      className="custom-modal"
      title="Редактирование пользователя"
      visible={modalProps.visible}
      onCancel={closeModal}
      afterClose={afterClose}
      footer={null}
      width={464}
      centered={true}
      closeIcon={<CloseModalSvg />}
    >
      {$updateUserInfo.error && <div className="m-b-20">
        <Alert message={$updateUserInfo.error.detail || $updateUserInfo.error.title} type="error" />
      </div>}
      {$updateUserInfo.loading && <div className="abs-loader">
        <Spin size="large"/>
      </div>}
      <Form onFinish={onSubmit}>
        <FormField title="Фамилия" error={fieldsErrors.lastName}>
          <Input
            type="text"
            placeholder="Введите фамилию"
            value={formFields.lastName}
            onChange={(lastName) => onFormFieldChange("lastName", lastName.target.value)}
          />
        </FormField>
        <FormField title="Имя" error={fieldsErrors.firstName}>
          <Input
            type="text"
            placeholder="Введите имя"
            value={formFields.firstName}
            onChange={(firstName) => onFormFieldChange("firstName", firstName.target.value)}
          />
        </FormField>
        <FormField title="Отчество" error={fieldsErrors.patronymic}>
          <Input
            type="text"
            placeholder="Введите отчество"
            value={formFields.patronymic}
            onChange={(patronymic) => onFormFieldChange("patronymic", patronymic.target.value)}
          />
        </FormField>
        <div className="custom-modal__button-row">
          <Button htmlType="submit" className="custom-button primary-button fullwidth">
            Сохранить
          </Button>
        </div>
      </Form>
    </Modal>
  );
};