import React, { useState, useEffect } from "react";
import { Tabs } from "antd";
import { useStore } from "effector-react";

import effector from "../../../screens/main/effector";

import { OrderDetails } from "./order-details";
import { OrderContract } from "./order-contract";
import { OrderInvoicePayment } from "./order-invoice-payment";
import { OrderPowerOfAttorney } from "./order-power-of-attorney";
import { OrderInvoice } from "./order-invoice";

const { store, events, effects } = effector;

const { TabPane } = Tabs;

export const OrderSteps = ({ orderInfo }) => {
  const { $currentUser } = useStore(store);

  const { roles } = $currentUser.data;

  const [ step, setStep ] = useState(null);

  useEffect(() => {
    switch (orderInfo.status.code) {
      case "WAITING_FOR_CONTRACT_ATTACHMENT":
        setStep({
          defaultStep: 2,
          currentStep: 2
        });
        break;
      case "CONTRACT_ATTACHED":
        setStep({
          defaultStep: 2,
          currentStep: 2
        });
        break;
      case "CONTRACT_REJECTED":
        setStep({
          defaultStep: 2,
          currentStep: 2
        });
        break;
      case "WAITING_FOR_INVOICE_PAYMENT_APPROVE":
        setStep({
          defaultStep: 3,
          currentStep: 3
        });
        break;
      case "WAITING_FOR_FILLING_POWER_OF_ATTORNEY":
        setStep({
          defaultStep: 3,
          currentStep: 3
        });
        break;
      case "WAITING_FOR_POWER_OF_ATTORNEY_APPROVE":
        setStep({
          defaultStep: 4,
          currentStep: 4
        });
        break;
      case "WAITING_FOR_CONFIRM_PRODUCT_RECEIVE":
        setStep({
          defaultStep: 4,
          currentStep: 4
        });
        break;
      case "XFILE_REJECTED":
      case "XFILE_AGENT_REJECTED":
      case "XFILE_CANCELLED":
      case "XFILE_DRAFT":
      case "XFILE_PENDING":
        setStep({
          defaultStep: 5,
          currentStep: 5
        });
        break;
      case "XFILE_AGENT_ACCEPTED":
      case "XFILE_ACCEPTED":
        setStep({
          defaultStep: 5,
          currentStep: 1
        });
        break;
      case "COMPLETED_AND_GOOD_RECEIVED":
        setStep({
          defaultStep: 5,
          currentStep: 1
        });
        break;
      default:
        setStep({
          defaultStep: 1,
          currentStep: 1
        });
    }
  }, [orderInfo]);

  const onChangeTab = (selectedStep) => {
    setStep({
      defaultStep: step.defaultStep,
      currentStep: selectedStep
    });
  };

  return (
    <>
      {step &&
        <Tabs className="order-details__tabs" onChange={onChangeTab} activeKey={(roles.includes("ROLE_BUSINESS_OWNER") || roles.includes("ROLE_BRANCH_ADMIN") || roles.includes("ROLE_AGENT")) ? step.currentStep.toString() : "1"}>
          {(roles.includes("ROLE_BUSINESS_OWNER") || roles.includes("ROLE_BRANCH_ADMIN") || roles.includes("ROLE_AGENT")) ?
           <>
             <TabPane tab="Заказ" key="1">
               <OrderDetails orderInfo={orderInfo} />
             </TabPane>
             <TabPane disabled={step.defaultStep < 2} tab={<div>Договор</div>} key="2">
               <OrderContract orderInfo={orderInfo} />
             </TabPane>
             <TabPane disabled={step.defaultStep < 3} tab="Счет на оплату" key="3">
               <OrderInvoicePayment orderId={orderInfo.id} />
             </TabPane>
             <TabPane disabled={step.defaultStep < 4} tab="Доверенность" key="4">
               <OrderPowerOfAttorney orderId={orderInfo.id} />
             </TabPane>
             <TabPane disabled={step.defaultStep < 5} tab="Счет фактура" key="5">
               <OrderInvoice orderId={orderInfo.id} />
             </TabPane>
           </>
            :
            <TabPane tab="Доверенность" key="1">
              {step.defaultStep < 4 ?
                <div>Доверенность не создана</div>
                :
                <OrderPowerOfAttorney orderId={orderInfo.id} />
              }
            </TabPane>
          }
        </Tabs>
      }
    </>
  )
};