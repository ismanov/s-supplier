import React, { useEffect } from "react";
import { useStore } from "effector-react";
import {Button, Popconfirm, Spin} from "antd";

import effector from "../effector";

import { openNotificationWithIcon } from "helpers/open-notification-with-icon";
import {PrintSvg} from "svgIcons/svg-icons";
import {printIframe} from "helpers/print";

const { store, effects, events } = effector;

export const OrderPowerOfAttorney = ({ orderId }) => {
  const { $powerOfAttorneyDetails, $confirmPowerOfAttorney } = useStore(store);

  useEffect(() => {
    effects.getPowerOfAttorneyDetailsEffect(orderId);
  }, []);

  useEffect(() => {
    if ($confirmPowerOfAttorney.success) {
      openNotificationWithIcon('success', 'Доверенность подтверждена');

      events.resetConfirmPowerOfAttorneyEvent();

      effects.getOrderInfoEffect({
        id: orderId
      });

      effects.getPowerOfAttorneyDetailsEffect(orderId);
    }
  }, [ $confirmPowerOfAttorney.success ]);


  const onConfirmPowerOfAttorney = () => {
    effects.confirmPowerOfAttorneyEffect({
      id: $powerOfAttorneyDetails.data.id,
      status: {
        code: "APPROVED"
      }
    })
  };

  const onPrintPowerOfAttorney = () => {
    printIframe('ifmpowerofattorney');
  };

  return (
    <div className="order-power-of-attorney">
      {$powerOfAttorneyDetails.loading && <div className="abs-loader">
        <Spin size="large"/>
      </div>
      }
      {Object.keys($powerOfAttorneyDetails.data).length > 0 &&
        <>
          <div className="order-power-of-attorney__info">
            <div className="order-power-of-attorney__info__left">
              <div className="order-power-of-attorney__item">
                Статус доверенности: <span>{$powerOfAttorneyDetails.data.status.nameRu}</span>
              </div>
            </div>
            <div className="order-power-of-attorney__info__right">
              {$powerOfAttorneyDetails.data.status.code !== "APPROVED" &&
                <Popconfirm
                  title="Вы уверены что хотите подтвердить доверенноть?"
                  onConfirm={onConfirmPowerOfAttorney}
                  okText="Да"
                  cancelText="Нет"
                >
                  <Button
                    loading={$confirmPowerOfAttorney.loading}
                    htmlType="submit"
                    className="custom-button primary-button"
                  >
                    Подтвердить
                  </Button>
                </Popconfirm>
              }
              <Button onClick={onPrintPowerOfAttorney} className="custom-button primary-button onlyicon m-l-15">
                <PrintSvg />
              </Button>
            </div>
          </div>
          <iframe id="ifmpowerofattorney" width={'100%'} height={1300} srcDoc={$powerOfAttorneyDetails.data.template} />
        </>
      }
    </div>
  );
};