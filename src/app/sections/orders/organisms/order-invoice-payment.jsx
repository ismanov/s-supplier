import React, { useEffect } from "react";
import { useStore } from "effector-react";
import { Button, Spin, Tooltip } from "antd";

import effector from "../effector";

import { printIframe } from "helpers/print";
import { PrintSvg } from "svgIcons/svg-icons";

const { store, effects, events } = effector;

export const OrderInvoicePayment = ({ orderId }) => {
  const { $invoicePaymentDetails } = useStore(store);

  useEffect(() => {
    effects.getInvoicePaymentDetailsEffect(orderId);
  }, []);

  const onPrintInvoicePayment = () => {
    printIframe('ifminvoicepayment');
  };

  return (
    <div className="order-invoice-payment">
      {$invoicePaymentDetails.loading && <div className="abs-loader">
        <Spin size="large"/>
      </div>
      }
      {Object.keys($invoicePaymentDetails.data).length > 0 &&
        <>
          <div className="order-invoice-payment__info">
            <div className="order-invoice-payment__info__left">
              <div className="order-invoice-payment__item">
                Статус счета на оплату: <span>{$invoicePaymentDetails.data.status.nameRu}</span>
              </div>
              {$invoicePaymentDetails.data.document &&
                <div className="order-invoice-payment__item">
                  <a href={$invoicePaymentDetails.data.document.path} target="_blank">Посмотреть прикрепленный файл</a>
                </div>
              }
            </div>
            <div className="order-invoice-payment__info__right">
              <Tooltip placement="topRight" title="Распечатать">
                <Button onClick={onPrintInvoicePayment} className="custom-button primary-button onlyicon">
                  <PrintSvg />
                </Button>
              </Tooltip>
            </div>
          </div>
          <iframe id="ifminvoicepayment" width={'100%'} height={700} srcDoc={$invoicePaymentDetails.data.template} />
        </>
      }
    </div>
  )
};