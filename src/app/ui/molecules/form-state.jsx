import React from "react";

import { Alert, Spin } from "antd";

export const FormState = ({ error, loading }) => {
  return (
    <div>
      {error && <div className="m-b-20">
        <Alert message={error.detail || error.title} type="error"/>
      </div>}
      {loading && <div className="abs-loader">
        <Spin size="large"/>
      </div>}
    </div>
  )
};