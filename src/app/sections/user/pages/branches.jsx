import React, { useEffect, useState } from "react";
import { useStore } from "effector-react";
import { Alert, Button, Pagination, Popover, Table } from "antd";

import effector from "../effector";

import { UpdateUserBranchModal } from "../organisms/update-user-branch-modal";
import { ChangeUserBranchStatusModal } from "../organisms/change-user-branch-status-modal";
import { UserBranchesFilter } from "../organisms/user-branches-filter";

import { ArrowSvg, SettingsSvg } from "svgIcons/svg-icons";
import { formatPhoneNumber } from "helpers/format-phone";

const { store, events, effects } = effector;

const columns = [
  {
    title: '№',
    dataIndex: 'number',
    width: 50
  },
  {
    title: 'Название',
    dataIndex: 'name'
  },
  {
    title: "Телефон",
    dataIndex: "phone"
  },
  {
    title: "Адрес",
    dataIndex: "address"
  },
  {
    title: "Ответственное лицо",
    dataIndex: "owner"
  },
  {
    title: "Статус",
    dataIndex: "status"
  },
  {
    title: "",
    dataIndex: "action",
    width: 70
  }
];

export const Branches = (props) => {
  const { $addUserBranch, $updateUserBranch, $changeUserBranchStatus, $branchesList, $branchesFilterProps } = useStore(store);

  const [ userBranchEditProps, setUserBranchEditProps ] = useState({
    visible: false,
    shouldRender: false,
    branch: null
  });

  const [ userBranchStatusChangeProps, setUserBranchStatusChangeProps ] = useState({
    visible: false,
    shouldRender: false,
    branchId: null
  });

  const { data: branchesData, loading, error } = $branchesList;
  const { content: branches, totalElements: branchesTotal, size: branchesPageSize, number: branchesPageNumber } = branchesData;


  useEffect(() => {
    effects.getBranchesListEffect({
      ...$branchesFilterProps,
    });

  }, [$branchesFilterProps]);


  useEffect(() => {
    if ($updateUserBranch.success || $addUserBranch.success || $changeUserBranchStatus.success) {
      effects.getBranchesListEffect({
        ...$branchesFilterProps,
      });
    }
  }, [$updateUserBranch.success, $addUserBranch.success, $changeUserBranchStatus.success]);


  const changePagination = (page) => {
    events.updateBranchesFilterPropsEvent({
      page: page - 1
    })
  };

  const onBranchEditClick = (branch) => {
    setUserBranchEditProps({ visible: true, shouldRender: true, branch })
  };

  const onBranchStatusChangeClick = (branch) => {
    setUserBranchStatusChangeProps({ visible: true, shouldRender: true, branch })
  };

  const actionsContent = (branch) => {
    return (
      <div>
        <div className="custom__popover__item">
          <Button className="custom-button primary-button" onClick={() => onBranchEditClick(branch)}>
            Редактировать
          </Button>
        </div>
        <div className="custom__popover__item">
          <Button className="custom-button primary-button" onClick={() => onBranchStatusChangeClick(branch)}>
            Изменить статус
          </Button>
        </div>
      </div>
    )
  };

  const data = branches.map((branch, index) => {
    return {
      id: branch.id,
      key: branch.id,
      number: (<div className="w-s-n">{(branchesPageSize * branchesPageNumber) + index + 1}</div>),
      name: branch.name,
      street: branch.address ? branch.address.street : "",
      phone: formatPhoneNumber(branch.phone),
      owner: branch.owner ? <>{branch.owner.lastName} {branch.owner.firstName} <br /> {formatPhoneNumber(branch.owner.login)}</> : "",
      status: branch.status.nameRu,
      action: <Popover
        overlayClassName="custom__popover"
        placement="bottomRight"
        trigger="click"
        content={actionsContent(branch)}
      >
        <Button className="custom-button onlyicon b-r-30">
          <SettingsSvg />
        </Button>
      </Popover>
    }
  });

  return (
    <>
      <div className="content-h1-wr">
        <div className="content-h1-wr__left">
          <Button className="custom-button add-button onlyicon b-r-30 m-r-10 rotate-left" onClick={() => props.history.push('/user')}>
            <ArrowSvg />
          </Button>
          <h1>Филиалы</h1>
        </div>
        <div className="content-h1-wr__right">
          <Button className="custom-button primary-button" onClick={() => onBranchEditClick(null)}>
            Добавить филиал
          </Button>
        </div>
      </div>
      <div className="site-content__in">
        <UserBranchesFilter />
        {error && <div className="m-b-20">
          <Alert message={error.data.detail || error.data.title} type="error"/>
        </div>}
        <div className="site-content__in__table">
          <Table
            loading={loading}
            dataSource={data}
            columns={columns}
            pagination={false}
          />
          <div className="site-content__in__table-pagination">
            <div className="site-content__in__table-total">Всего филиалов: {branchesTotal}</div>
            <Pagination
              disabled={loading}
              onChange={changePagination}
              current={$branchesFilterProps.page ? $branchesFilterProps.page + 1 : 1}
              total={branchesTotal}
              pageSize={branchesPageSize}
              showSizeChanger={false}
              hideOnSinglePage={true}
            />
          </div>
        </div>
        {userBranchEditProps.shouldRender && <UpdateUserBranchModal
          modalProps={userBranchEditProps} setModalProps={setUserBranchEditProps}
        />}
        {userBranchStatusChangeProps.shouldRender && <ChangeUserBranchStatusModal
          modalProps={userBranchStatusChangeProps} setModalProps={setUserBranchStatusChangeProps}
        />}
      </div>
    </>
  )
};