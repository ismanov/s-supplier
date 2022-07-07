import React, { useState, useEffect } from "react";
import { useStore } from "effector-react";
import {Alert, Button, Popconfirm, Spin} from "antd";

import effector from "../effector";

import { InvoiceForm } from "../atoms/invoice-form";
import { openNotificationWithIcon } from "helpers/open-notification-with-icon";
import { PrintSvg } from "svgIcons/svg-icons";
import { printIframe } from "helpers/print";

const { store, effects, events } = effector;

const checkProductsCode = (arr) => {
  const productsWithoutCode = [];

  arr.forEach((product, index) => {
    if (!product.product.vatBarcode) {
      productsWithoutCode.push(index);
    }
  });

  return !!productsWithoutCode.length;
};

export const OrderInvoice = ({ orderId }) => {
  const { $invoiceDetails, $sendProductsToXfiles, $orderInfo } = useStore(store);

  const [ editMode, setEditMode ] = useState(false);

  const hasProductsWithoutCode = checkProductsCode($orderInfo.data.orderItems);

  useEffect(() => {
    effects.getInvoiceDetailsEffect(orderId);
  }, []);

  useEffect(() => {
    if ($sendProductsToXfiles.success) {
      openNotificationWithIcon('success', 'Счет фактура отправлена в X-Files');

      setEditMode(false);

      events.resetSendProductsToXfilesEvent();

      effects.getOrderInfoEffect({
        id: orderId
      });

      effects.getInvoiceDetailsEffect(orderId);
    }
  }, [$sendProductsToXfiles.success]);


  const onPrintInvoice = () => {
    printIframe('ifminvoice');
  };

  const onSendToXfiles = () => {
    const productsData = $orderInfo.data.orderItems.map((product) => {
      return {
        barcode: product.barcode,
        vatBarcode: product.product.vatBarcode,
        id: product.product.id,
        name: product.product.name
      }
    });

    const data = {
      products: productsData,
      invoiceId: $invoiceDetails.data.id
    };

    effects.sendProductsToXfilesEffect(data);
  };

  return (
    <div className="order-invoice">
      {$sendProductsToXfiles.error &&
        <div className="m-b-15">
          <Alert message={$sendProductsToXfiles.error.detail || $sendProductsToXfiles.error.title} type="error"/>
        </div>
      }
      {($invoiceDetails.loading || $sendProductsToXfiles.loading) && <div className="abs-loader">
        <Spin size="large"/>
      </div>
      }
      {Object.keys($invoiceDetails.data).length > 0 &&
        <>
          <div className="order-invoice__info">
            <div className="order-invoice__info__left">
              <div className="order-invoice__item">
                Статус счет фактуры: <span>{$invoiceDetails.data.status.nameRu}</span>
              </div>
            </div>
            <div className="order-invoice__info__right">
              {($invoiceDetails.data.status.code === "CREATED"
                || $invoiceDetails.data.status.code === "XFILE_REJECTED"
                || $invoiceDetails.data.status.code === "XFILE_AGENT_REJECTED"
                || $invoiceDetails.data.status.code === "XFILE_CANCELLED"
              ) &&
                <>
                  {hasProductsWithoutCode ?
                    <Button
                      disabled={editMode}
                      onClick={() => setEditMode(true)}
                      className="custom-button primary-button"
                    >
                      Отправить в X-FILE
                    </Button>
                    :
                    <Popconfirm
                      title="Вы уверены что хотите отправить счет фактуру в X-Files ?"
                      onConfirm={onSendToXfiles}
                      okText="Да"
                      cancelText="Нет"
                    >
                      <Button className="custom-button primary-button">
                        Отправить в X-FILE
                      </Button>
                    </Popconfirm>
                  }
                </>
              }
              <Button onClick={onPrintInvoice} className="custom-button primary-button onlyicon m-l-15">
                <PrintSvg />
              </Button>
            </div>
          </div>
          {editMode ?
            <InvoiceForm invoiceId={$invoiceDetails.data.id} setEditMode={setEditMode} />
            :
            <iframe id="ifminvoice" width={'100%'} height={700} srcDoc={$invoiceDetails.data.template}/>
          }
        </>
      }
    </div>
  )
};