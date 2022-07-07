import React, { useEffect } from "react";
import { useStore } from "effector-react";
import { Button, Spin } from "antd";

import effector from "../effector";

import { ClientInfo } from "../organisms/client-info";
import { ClientDetails } from "../organisms/client-details";

import { ArrowSvg } from "svgIcons/svg-icons";


const { store, events, effects } = effector;

export const ClientPage = (props) => {
  const { history, match } = props;

  const { $currentClient } = useStore(store);

  useEffect(() => {
    effects.getCurrentClientEffect(match.params.id);

    return () => {
      events.resetCurrentClientPageEvent();
    }
  }, []);

  return (
    <>
      {$currentClient.loading &&
        <div className="site-content__loader">
          <Spin size="large"/>
        </div>
      }
      {$currentClient.data &&
      <>
        <div className="content-h1-wr">
          <div className="content-h1-wr__left">
            <Button className="custom-button add-button onlyicon b-r-30 m-r-10 rotate-left" onClick={() => history.push('/clients/list')}>
              <ArrowSvg />
            </Button>
            <h1>{$currentClient.data.businessType.nameRu} "{$currentClient.data.name}"</h1>
          </div>
        </div>
        <div className="content-cart">
          <div className="content-cart__left">
            <ClientInfo currentClient={$currentClient.data} />
          </div>
          <div className="content-cart__right">
            <ClientDetails clientId={match.params.id} />
          </div>
        </div>
      </>
      }
    </>
  )
};