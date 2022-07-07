import React, { useState, useEffect } from "react";
import { useStore } from "effector-react";
import { Button, Input, Popconfirm } from "antd";

import effector from "../effector";

import { OrderProductsItem } from "./order-products-item";
import { formatPrice } from "helpers/format-price";
import { openNotificationWithIcon } from "helpers/open-notification-with-icon";
import Moment from "react-moment";

const { store, events, effects } = effector;

const { TextArea } = Input;

export const OrderProducts = ({ orderInfoData, editMode, setEditMode }) => {
  const { $revisedOrder } = useStore(store);

  const defaultOrderItems = [...orderInfoData.orderItems];

  const [ orderItems, setOrderItems ] = useState(defaultOrderItems);
  const [ orderComment, setOrderComment ] = useState("");
  const [ fieldErrors, setFieldErrors ] = useState({});

  useEffect(() => {
    if ($revisedOrder.success) {
      openNotificationWithIcon('success', 'Заказ пересмотрен');

      events.resetRevisedOrderEvent();
      setEditMode(false);

      effects.getOrderInfoEffect({
        id: orderInfoData.id
      });
    }
  }, [$revisedOrder.success]);

  const notesData = orderInfoData.notes.map((note) => {
    return (
      <div className="order-products__notes__item" key={note.id}>
        <div className="order-products__notes__item__title">
          {note.createdBy}
          <span><Moment format="DD.MM.YYYY" date={note.createdDate} /></span>
        </div>
        <div className="order-products__notes__item__body">
          {note.comment}
        </div>
      </div>
    )
  });

  const changeOrderItems = (order) => {
    const currentOrderItems = [...orderItems];

    const newOrderItems = currentOrderItems.map((item) => {
      let currentItem = {...item};

      if (item.id === order.id) {
        currentItem = order;
      }

      return currentItem;
    });

    setOrderItems(newOrderItems)
  };

  let totalPrice = 0;

  const productListRender = orderItems.map((product, index) => {
    totalPrice = totalPrice + product.costPrice;

    return <OrderProductsItem
      product={product}
      index={index}
      changeOrderItems={changeOrderItems}
      key={product.id}
      editMode={editMode}
      fieldErrors={fieldErrors}
      setFieldErrors={setFieldErrors}
    />
  });

  const onCancelEdit = () => {
    setOrderItems(defaultOrderItems);
    setEditMode(false);
  };

  const onRevised = () => {
    if (Object.keys(fieldErrors).length) {
      return;
    }

    const orderItemsData = orderItems.map((item) => {
      const selectedUnit = item.units.filter((unit) => unit.selected);

      return {
        id: item.id,
        costPrice: selectedUnit[0].price * item.qty,
        unitId: selectedUnit[0].unit.id,
        productId: item.product.id,
        minOrder: item.minOrder,
        name: item.product.name,
        qty: item.qty,
        price: selectedUnit[0].price,
      }
    });

    const data = {
      id: orderInfoData.id,
      orderItems: orderItemsData,
      status: {
        code: "REVISED_BY_SUPPLIER",
      },
      total: totalPrice,
      note: {
        comment: orderComment
      }
    };

    effects.revisedOrderEffect(data);
  };

  return (
    <div className="order-products">
      {productListRender}
      <div className="m-b-30">
        <div>
          {notesData.length > 0 &&
            <>
              <div className="order-products__notes-head">Комментарии</div>
              <div className={`order-products__notes ${notesData.length % 2 === 0 ? "notes-odd" : "notes-even"}`}>
                {notesData}
              </div>
            </>
          }
        </div>
        <div className="order-products__total">Итого: {formatPrice(totalPrice)}</div>
      </div>
      <div className="order-products__bottom">
        <div className="order-products-textarea">
          {editMode &&
            <TextArea
              value={orderComment}
              onChange={(comment) => setOrderComment(comment.target.value)}
              placeholder="Введите комментарий"
            />
          }
        </div>
        {editMode &&
          <div className="order-products-buttons">
            <Popconfirm
              title="Вы уверены что хотите отправить заказ ?"
              onConfirm={onRevised}
              okText="Да"
              cancelText="Нет"
            >
              <Button loading={$revisedOrder.loading} className="custom-button primary-button">Отправить</Button>
            </Popconfirm>
            <Button onClick={onCancelEdit} className="custom-button danger-button m-l-20">Отменить</Button>
          </div>
        }
      </div>
    </div>
  )
};