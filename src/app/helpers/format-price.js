import React from "react";

export const formatPrice = (price) => {
  const n = String(price),
    p = n.indexOf('.');

  const formatted = n.replace(
    /\d(?=(?:\d{3})+(?:\.|$))/g,
    (m, i) => p < 0 || i < p ? `${m} ` : m
  );

  return <div className="w-s-n">
    <strong>{formatted}</strong> сум
  </div>;
};

export const formatPriceProduct = (price) => {
  const n = String(price),
    p = n.indexOf('.');

  return n.replace(
    /\d(?=(?:\d{3})+(?:\.|$))/g,
    (m, i) => p < 0 || i < p ? `${m} ` : m
  );
};