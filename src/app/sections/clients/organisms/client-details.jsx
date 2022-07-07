import React from "react";
import { Tabs } from "antd";

import { ClientOrders } from "../templates/client-orders";

const { TabPane } = Tabs;

export const ClientDetails = ({ clientId }) => {
  return (
    <Tabs>
      <TabPane tab="Заказы" key="1">
        <ClientOrders clientId={clientId} />
      </TabPane>
    </Tabs>
  )
};