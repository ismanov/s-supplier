import React, { useEffect } from "react";
import { useStore } from "effector-react";
import { Spin, Button } from "antd";

import effector from "../effector";

import { OrderSteps } from "../organisms/order-steps";

import { formatPhoneNumber } from "helpers/format-phone";
import { formatPrice } from "helpers/format-price";
import { ArrowSvg, RefreshSvg } from "svgIcons/svg-icons";
import Moment from "react-moment";

const { store, events, effects } = effector;

export const OrderPage = (props) => {
  const { $orderInfo } = useStore(store);

  const orderId = props.match.params.id;

  useEffect(() => {
    effects.getOrderInfoEffect({
      id: orderId
    });

    return () => {
      events.resetOrderInfoEvent();
    }
  }, []);

  const onRefreshOrder = () => {
    events.resetOrderInfoEvent();

    effects.getOrderInfoEffect({
      id: orderId
    });
  };

  return (
    <>
      <div className="content-h1-wr">
        <div className="content-h1-wr__left">
          <Button className="custom-button add-button onlyicon b-r-30 m-r-10 rotate-left" onClick={() => props.history.push('/orders/list')}>
            <ArrowSvg />
          </Button>
          <h1>Заказ №: {$orderInfo.data.number}</h1>
        </div>
      </div>
      <div className="order-details">
        {$orderInfo.loading && <div className="abs-loader">
          <Spin size="large"/>
        </div>
        }
        <div className="order-details-customer-wr">
          {$orderInfo.data.customerDetail &&
            <>
              <div className="order-details-customer">
                <div className="order-details-customer-row">
                  <div className="order-details-customer-item">
                    <div className="order-details-customer-item-title">
                      Статус заказа:
                    </div>
                    <div className="order-details-customer-item-body">
                      {$orderInfo.data.status.nameRu}
                    </div>
                  </div>
                  <div className="order-details-customer-item">
                    <div className="order-details-customer-item-title">
                      Покупатель
                    </div>
                    <div className="order-details-customer-item-body">
                      {$orderInfo.data.customerDetail.businessType.nameRu} "{$orderInfo.data.customer.name}"
                    </div>
                  </div>
                  <div className="order-details-customer-item">
                    <div className="order-details-customer-item-title">
                      Телефон
                    </div>
                    <div className="order-details-customer-item-body">
                      {formatPhoneNumber($orderInfo.data.customerDetail.phone)}
                    </div>
                  </div>
                  <div className="order-details-customer-item">
                    <div className="order-details-customer-item-title">
                      Сумма заказа
                    </div>
                    <div className="order-details-customer-item-body">
                      {formatPrice($orderInfo.data.total)}
                    </div>
                  </div>
                  <div className="order-details-customer-item">
                    <div className="order-details-customer-item-title">
                      Способ оплаты
                    </div>
                    <div className="order-details-customer-item-body">
                      {$orderInfo.data.paymentType.nameRu}
                    </div>
                  </div>
                  <div className="order-details-customer-item">
                    <div className="order-details-customer-item-title">
                      Способ доставки
                    </div>
                    <div className="order-details-customer-item-body">
                      {$orderInfo.data.deliveryType.nameRu}
                    </div>
                  </div>
                  <div className="order-details-customer-item">
                    <div className="order-details-customer-item-title">
                      Дата заказа
                    </div>
                    <div className="order-details-customer-item-body">
                      <Moment format="DD.MM.YYYY" date={$orderInfo.data.orderDate} />
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <Button onClick={onRefreshOrder} className="custom-button primary-button onlyicon">
                  <RefreshSvg />
                </Button>
              </div>
            </>
          }
        </div>
        {Object.keys($orderInfo.data).length > 0 &&
          <OrderSteps orderInfo={$orderInfo.data} />
        }
      </div>
    </>
  )
};