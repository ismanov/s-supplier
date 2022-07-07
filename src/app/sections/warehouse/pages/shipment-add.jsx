import React, { useEffect } from "react";
import { ShipmentAddForm } from "../organisms/shipment-add-form";
import { useStore } from "effector-react";
import effector from "../effector";
import userEffector from "../../user/effector";
import clientEffector from "../../clients/effector";

const { effects } = effector;
const { store: userStore, effects: userEffects } = userEffector;
const { effects: clientEffects } = clientEffector;
export const ShipmentAdd = (props) => {
  const { $userCompanyInfo } = useStore(userStore);
  useEffect(() => {
    const { tin } = $userCompanyInfo.data;
    effects.getInvoiceListEffect(tin);
    effects.getWarehouseStockItemsEffect();
    userEffects.getUserCompanyInfoEffect();
    userEffects.getBranchesItemsEffect();
    clientEffects.getClientsItemsEffect();
  }, []);
  return <ShipmentAddForm {...props} />;
};
