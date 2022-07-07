import React from "react";

function Show(props) {
  if (props.if) return props.children;
  return null
}

export default Show;