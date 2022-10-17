import { useState } from "react";
export function Node({ node, radius, geo, onClick }) {
  const selectedId = "6640";
  if (node.data.id === selectedId) {
    console.log(geo, node);
  }
  node.hx -= geo[0];
  node.hy -= geo[1];
  const r = Math.sqrt(Math.pow(node.hx, 2) + Math.pow(node.hy, 2));
  const z = Math.cosh(Math.asinh(r));
  const [x, y] =
    // node.r === 0
    //   ? [0, 0]
    //   : //[Math.cos(node.t) * node.r, Math.sin(node.t) * node.r];
    // [
    //   (Math.cos(node.t) * node.hx) / (node.hy + 1),
    //   (Math.sin(node.t) * node.hx) / (node.hy + 1),
    // ];
    [node.hx / (z + 1), node.hy / (z + 1)];
  return (
    <g onClick={onClick}>
      <circle
        key={node.data.data.no}
        cx={x * radius}
        cy={y * radius}
        r="6"
        // fill={y === 0 ? "red" : "black"}
        fill={node.data.id === selectedId ? "green" : "black"}
        style={{ cursor: "pointer", transition: "d 1s" }}
      />
    </g>
  );
}
