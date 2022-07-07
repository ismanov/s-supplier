import React, { useState } from "react";

import { Button } from "antd";

import { UpdateUserBranchModal } from "../organisms/update-user-branch-modal";

export const UserEntitys = () => {
  const [ addUserBranchProps, setAddUserBranchProps ] = useState({
    visible: false,
    shouldRender: false
  });

  const onUserPasswordEdit = () => {
    setAddUserBranchProps({ visible: true, shouldRender: true })
  };

  return (
    <>
      <Button className="custom-button primary-button fullwidth medium" htmlType="submit" onClick={onUserPasswordEdit}>
        Добавить филиал
      </Button>
      {addUserBranchProps.shouldRender && <UpdateUserBranchModal
        modalProps={addUserBranchProps} setModalProps={setAddUserBranchProps}
      />}
    </>
  );
};

