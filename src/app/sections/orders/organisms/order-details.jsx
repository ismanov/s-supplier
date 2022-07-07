import React, { useEffect, useState } from "react";
import { useStore } from "effector-react";
import { Button, Popconfirm } from "antd";

import effector from "../effector";

import { OrderProducts } from "../atoms/order-products";
import { OrderReasonModal } from "./order-reason-modal";
import { openNotificationWithIcon } from "helpers/open-notification-with-icon";

const { store, events, effects } = effector;

export const OrderDetails = ({ orderInfo }) => {
  const { $confirmOrder } = useStore(store);

  const [ editMode, setEditMode ] = useState(false);

  const [ orderReasonEditProps, setOrderReasonEditProps ] = useState({
    visible: false,
    shouldRender: false,
    orderId: null,
    status: null
  });

  useEffect(() => {
    if ($confirmOrder.success) {
      openNotificationWithIcon('success', 'Заказ принят');

      events.resetConfirmOrderEvent();

      effects.getOrderInfoEffect({
        id: orderInfo.id
      });
    }
  }, [$confirmOrder.success]);

  const onConfirmOrder = () => {
    const data = {
      id: orderInfo.id,
      status: {
        code: "APPROVED"
      }
    };

    effects.confirmOrderEffect(data);
  };


  const onRejectOrder = () => {
    setOrderReasonEditProps({
      visible: true,
      shouldRender: true,
      orderId: orderInfo.id,
      status: "REJECTED"
    })
  };

  return (
    <>
      {orderInfo.orderItems &&
        <>
          {(orderInfo.status.code === "NEW" || orderInfo.status.code === "REVISED_BY_CLIENT") &&
            <div className="order-details__actions">
              <div className="order-details__actions-item">
                <Popconfirm
                  disabled={editMode}
                  title="Вы уверены что хотите принять заказ ?"
                  onConfirm={onConfirmOrder}
                  okText="Да"
                  cancelText="Нет"
                >
                  <Button
                    loading={$confirmOrder.loading}
                    disabled={editMode}
                    className="custom-button primary-button fullwidth"
                  >
                    Принять
                  </Button>
                </Popconfirm>
              </div>
              <div className="order-details__actions-item">
                <Button
                  disabled={editMode}
                  onClick={() => setEditMode(true)}
                  className="custom-button primary-button fullwidth"
                >
                  Редактировать
                </Button>
              </div>
              <div className="order-details__actions-item">
                <Button disabled={editMode} onClick={onRejectOrder} className="custom-button danger-button fullwidth">
                  Отклонить
                </Button>
              </div>
            </div>
          }
          <OrderProducts orderInfoData={orderInfo} editMode={editMode} setEditMode={setEditMode} />
        </>
      }
      {orderReasonEditProps.shouldRender && <OrderReasonModal
        modalProps={orderReasonEditProps} setModalProps={setOrderReasonEditProps}
      />}
    </>
  )
};