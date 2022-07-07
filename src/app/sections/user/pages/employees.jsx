import React, { useEffect, useState } from "react";
import { useStore } from "effector-react";
import { Link } from "react-router-dom";
import { Alert, Button, Pagination, Table, Popover } from "antd";

import effector from "../effector";

import { AddUserEmployeeModal } from "../organisms/add-user-employee-modal";
import { EditUserEmployeePasswordModal } from "../organisms/edit-user-employee-password-modal";
import { UserEmployeesFilter } from "../organisms/user-employees-filter";

import { formatPhoneNumber } from "helpers/format-phone";
import { ArrowSvg, SettingsSvg } from "svgIcons/svg-icons";
import { openNotificationWithIcon } from "helpers/open-notification-with-icon";

const { store, events, effects } = effector;

const columns = [
  {
    title: "№",
    dataIndex: "number",
    width: 50,
  },
  {
    title: "ФИО",
    dataIndex: "name",
  },
  {
    title: "Телефон",
    dataIndex: "phone",
  },
  {
    title: "Филиал",
    dataIndex: "branch",
  },
  {
    title: "Роли",
    dataIndex: "roles",
  },
  {
    title: "Статус",
    dataIndex: "status",
  },
  {
    title: "",
    dataIndex: "action",
    width: 40,
  },
];

export const Employees = (props) => {
  const {
    $addUserEmployee,
    $updateUserEmployee,
    $updateUserEmployeeStatus,
    $employeesList,
    $employeesFilterProps,
  } = useStore(store);

  const [userEmployeeEditProps, setUserEmployeeEditProps] = useState({
    visible: false,
    shouldRender: false,
    employee: null,
    isEmployeeEdit: null,
  });

  const [userEmployeePasswordEditProps, setUserEmployeePasswordEditProps] =
    useState({
      visible: false,
      shouldRender: false,
      employee: null,
    });

  const { data: employeesData, loading, error } = $employeesList;
  const {
    content: employees,
    totalElements: employeesTotal,
    size: employeesPageSize,
    number: employeesPageNumber,
  } = employeesData;

  useEffect(() => {
    effects.getEmployeesListEffect({
      ...$employeesFilterProps,
      orderBy: "id",
    });
  }, [$employeesFilterProps]);

  useEffect(() => {
    if ($addUserEmployee.success) {
      effects.getEmployeesListEffect({
        ...$employeesFilterProps,
        page: 0,
        orderBy: "id",
      });
    }

    if ($updateUserEmployee.success) {
      effects.getEmployeesListEffect({
        ...$employeesFilterProps,
        orderBy: "id",
      });
    }

    if ($updateUserEmployeeStatus.success) {
      effects.getEmployeesListEffect({
        ...$employeesFilterProps,
        orderBy: "id",
      });

      events.resetUpdateUserEmployeeStatusEvent();

      openNotificationWithIcon("success", "Статус изменен");
    }
  }, [
    $addUserEmployee.success,
    $updateUserEmployee.success,
    $updateUserEmployeeStatus.success,
  ]);

  const changePagination = (page) => {
    events.updateEmployeesFilterPropsEvent({
      page: page - 1,
    });
  };

  const onEmployeeEditClick = (employee) => {
    setUserEmployeeEditProps({
      visible: true,
      shouldRender: true,
      employee,
      isEmployeeEdit: null,
    });
  };

  const onEmployeePasswordEditClick = (employee) => {
    setUserEmployeePasswordEditProps({
      visible: true,
      shouldRender: true,
      employee,
    });
  };

  const onStatusChangeClick = (employee) => {
    effects.updateUserEmployeeStatusEffect({
      id: employee.id,
      status: employee.status.code === "ACTIVE" ? "BLOCK" : "ACTIVE",
    });
  };

  const actionsContent = (employee) => {
    return (
      <div>
        <div className="custom__popover__item">
          <Button
            className="custom-button primary-button"
            onClick={() => onEmployeeEditClick(employee)}
          >
            Редактировать
          </Button>
        </div>
        <div className="custom__popover__item">
          <Button
            className="custom-button primary-button"
            onClick={() => onEmployeePasswordEditClick(employee)}
          >
            Редактировать пароль
          </Button>
        </div>
        <div className="custom__popover__item">
          <Button
            className="custom-button primary-button"
            onClick={() => onStatusChangeClick(employee)}
            loading={$updateUserEmployeeStatus.loading}
          >
            {employee.status.code === "ACTIVE"
              ? "Заблокировать"
              : "Разблокировать"}
          </Button>
        </div>
      </div>
    );
  };

  const data = employees.map((employee, index) => {
    return {
      id: employee.id,
      key: employee.id,
      number: (
        <div className="w-s-n">
          {employeesPageSize * employeesPageNumber + index + 1}
        </div>
      ),
      name: (
        <>
          {employee.firstName} {employee.lastName} {employee.patronymic}
        </>
      ),
      phone: formatPhoneNumber(employee.login),
      branch: employee.branch.name,
      roles: employee.roles.map(
        (role, roleIndex) =>
          `${role.name}${employee.roles.length > roleIndex + 1 ? "," : ""}`
      ),
      status: employee.status.nameRu,
      action: (
        <Popover
          overlayClassName="custom__popover"
          placement="bottomRight"
          trigger="click"
          content={actionsContent(employee)}
        >
          <Button className="custom-button onlyicon b-r-30">
            <SettingsSvg />
          </Button>
        </Popover>
      ),
    };
  });

  return (
    <>
      <div className="content-h1-wr">
        <div className="content-h1-wr__left">
          <Button
            className="custom-button add-button onlyicon b-r-30 m-r-10 rotate-left"
            onClick={() => props.history.push("/user")}
          >
            <ArrowSvg />
          </Button>
          <h1>Пользователи</h1>
        </div>
        <div className="content-h1-wr__right">
          <Button
            className="custom-button primary-button"
            onClick={() => onEmployeeEditClick(null)}
          >
            Добавить пользователя
          </Button>
        </div>
      </div>
      <div className="site-content__in">
        <UserEmployeesFilter />
        {error && (
          <div className="m-b-20">
            <Alert
              message={error.data.detail || error.data.title}
              type="error"
            />
          </div>
        )}
        <div className="site-content__in__table">
          <Table
            loading={loading}
            dataSource={data}
            columns={columns}
            pagination={false}
          />
          <div className="site-content__in__table-pagination">
            <div className="site-content__in__table-total">
              Всего пользователей: {employeesTotal}
            </div>
            <Pagination
              disabled={loading}
              onChange={changePagination}
              current={
                $employeesFilterProps.page ? $employeesFilterProps.page + 1 : 1
              }
              total={employeesTotal}
              pageSize={employeesPageSize}
              showSizeChanger={false}
              hideOnSinglePage={true}
            />
          </div>
        </div>
        {userEmployeeEditProps.shouldRender && (
          <AddUserEmployeeModal
            modalProps={userEmployeeEditProps}
            setModalProps={setUserEmployeeEditProps}
          />
        )}
        {userEmployeePasswordEditProps.shouldRender && (
          <EditUserEmployeePasswordModal
            modalProps={userEmployeePasswordEditProps}
            setModalProps={setUserEmployeePasswordEditProps}
          />
        )}
      </div>
    </>
  );
};
