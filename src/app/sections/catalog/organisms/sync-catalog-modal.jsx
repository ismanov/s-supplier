import React, { useEffect, useState } from "react";
import { useStore } from "effector-react";

import { FormField } from "ui/molecules/form-field";

import effector from "../effector";

import {
  Row,
  Modal,
  Button,
  Form,
  Spin,
  notification,
  Col,
  Select,
} from "antd";

const { store, effects, events } = effector;

const { Option } = Select;

export const SyncCatalogModal = (props) => {
  const { modalProps, setModalProps, branchId } = props;

  const [selectedBranchId, setSelectedBranchId] = useState(undefined);
  const $branchItems = useStore(store.$catalogBranches);
  const $syncCatalog = useStore(store.$syncCatalog);

  useEffect(() => {
    if ($syncCatalog.success) {
      notification["success"]({
        message: "Синхронизация прошла успешно",
      });

      events.resetSyncCatalogEvent();

      closeModal();
    }
  }, [$syncCatalog.success]);

  const closeModal = () => {
    setModalProps({ ...modalProps, visible: false });
  };

  const afterClose = () => {
    catalogEffector.events.resetCreateCatalogProductEvent();
    setModalProps({ ...modalProps, shouldRender: false, productId: null });
  };

  const onFinish = () => {
    effects.syncCatalogEffect({
      fromBranchId: branchId,
      toBranchId: selectedBranchId,
    });
  };

  const filteredBranchItems = $branchItems.data.filter(
    (b) => b.id !== branchId
  );

  return (
    <Modal
      title={"Синхронизация каталога"}
      visible={modalProps.visible}
      onCancel={closeModal}
      afterClose={afterClose}
      footer={null}
      width={440}
    >
      {/*{($createCatalogProduct.error || $updateCatalogProduct.error) && <div className="custom-modal__error">*/}
      {/*  <Alert message={$createCatalogProduct.error.detail || $updateCatalogProduct.error.detail} type="error"/>*/}
      {/*</div>}*/}
      {$syncCatalog.loading && (
        <div className="modal-loader">
          <Spin size="large" />
        </div>
      )}
      <Form onFinish={onFinish}>
        <FormField title="Филиал">
          <Form.Item
            name="layout"
            rules={[{ required: true, message: "Выберите филиал" }]}
          >
            <Select
              className="custom-select"
              loading={$branchItems.loading}
              placeholder="Выберите филиал"
              value={selectedBranchId}
              onChange={setSelectedBranchId}
              allowClear
            >
              {filteredBranchItems.map((item) => (
                <Option value={item.id} key={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </FormField>

        <div className="form-bottom">
          <Row justify="space-between" gutter={[20, 0]}>
            <Col span={12}>
              <Button onClick={closeModal} type="ghost">
                Отмена
              </Button>
            </Col>
            <Col span={10}>
              <Button
                htmlType="submit"
                type="primary"
                style={{ width: "100%" }}
              >
                Синхронизировать
              </Button>
            </Col>
          </Row>
        </div>
      </Form>
    </Modal>
  );
};
