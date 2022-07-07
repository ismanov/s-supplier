import React, { useEffect } from "react";
import { useStore } from "effector-react";
import { Button, Spin } from "antd";

import effector from "../effector";

import { EmployeeInfo } from "../organisms/employee-info";

import { ArrowSvg } from "svgIcons/svg-icons";

const { store, events, effects } = effector;

export const EmployeePage = (props) => {
  const { history, match } = props;

  const { $currentEmployee, $updateUserEmployee } = useStore(store);

  useEffect(() => {
    effects.getCurrentEmployeeEffect(match.params.id);

    return () => {
      events.resetCurrentEmployeeEvent();
    }
  }, []);

  useEffect(() => {
    if ($updateUserEmployee.success) {
      effects.getCurrentEmployeeEffect(match.params.id);
    }
  }, [$updateUserEmployee.success]);

  return (
    <>
      {$currentEmployee.loading &&
        <div className="site-content__loader">
          <Spin size="large"/>
        </div>
      }
      {$currentEmployee.data &&
        <>
          <div className="content-h1-wr">
            <div className="content-h1-wr__left">
              <Button className="custom-button add-button onlyicon b-r-30 m-r-10 rotate-left" onClick={() => history.push('/user/employees')}>
                <ArrowSvg />
              </Button>
              <h1>{$currentEmployee.data.firstName} {$currentEmployee.data.lastName} {$currentEmployee.data.patronymic}</h1>
            </div>
          </div>
          <div className="content-cart">
            <div className="content-cart__left">
              <EmployeeInfo currentEmployee={$currentEmployee.data} />
            </div>
            <div className="content-cart__right">

            </div>
          </div>
        </>
      }
    </>
  )
};