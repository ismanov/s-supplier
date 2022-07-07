import React, { useState, useEffect } from "react";
import { useStore } from "effector-react";
import { Modal, Form, Alert, Spin, Input, Button } from "antd";

import effector from "../effector";

const { store, effects } = effector;

import { openNotificationWithIcon } from "helpers/open-notification-with-icon";
import { CloseModalSvg } from "svgIcons/svg-icons";
import InputMask from "react-input-mask";

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

export const UserAggregationUpdateModal = (props) => {
  const { $updateUserCompanyInfo } = useStore(store);
  const [form] = Form.useForm();

  const { modalProps, setModalProps } = props;

  const { userAggregationData } = modalProps;

  useEffect(() => {
    form.setFieldsValue({ ...userAggregationData })
  }, [userAggregationData]);

  useEffect(() => {
    if ($updateUserCompanyInfo.success) {
      openNotificationWithIcon("success", "Данные обновлены");
      closeModal();
    }
  }, [$updateUserCompanyInfo.success]);


  const closeModal = () => {
    setModalProps({ ...modalProps, visible: false });
  };

  const afterClose = () => {
    setModalProps({ ...modalProps, shouldRender: false, userAggregationData: null });
  };

  const onSubmit = (values) => {
    effects.updateUserCompanyInfoEffect({
      ...values,
      id: userAggregationData.id
    });
  };

  return (
    <Modal
      className="custom-modal"
      title="Редактирование данные"
      visible={modalProps.visible}
      onCancel={closeModal}
      afterClose={afterClose}
      footer={null}
      width={464}
      centered={true}
      closeIcon={<CloseModalSvg/>}
    >
      <FormState error={$updateUserCompanyInfo.error} loading={$updateUserCompanyInfo.loading}/>
      <Form onFinish={onSubmit} form={form}>
        <Form.Item
          name="gcp"
          labelCol={{ sm: { span: 24 } }}
          labelAlign="left"
          label="GS1 код"
          rules={[
            {
              required: true,
              message: "Объязательная поля"
            },
            {
              min: 9,
              message: "Минимальное количесто кода 9"
            }
          ]}
        >
          <InputMask
            className="ant-input custom-input"
            placeholder="XXX XXX XXX"
            mask="999999999"
            maskChar=""
          />
        </Form.Item>
        <Form.Item
          name="omsId"
          labelCol={{ sm: { span: 24 } }}
          labelAlign="left"
          label="OMSID"
          rules={[{
            required: true,
            message: "Объязательная поля"
          }]}
        >
          <Input placeholder="OMSID"/>
        </Form.Item>
        <Form.Item
          name="turonToken"
          labelCol={{ sm: { span: 24 } }}
          labelAlign="left"
          label="Turon token"
          rules={[{
            required: true,
            message: "Объязательная поля"
          }]}
        >
          <Input placeholder="Turon token"/>
        </Form.Item>
        <div className="custom-modal__button-row">
          <Button htmlType="submit" className="custom-button primary-button fullwidth">
            Сохранить
          </Button>
        </div>
      </Form>
    </Modal>
  );
};