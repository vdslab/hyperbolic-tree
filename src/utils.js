import * as d3 from "d3";

function calculateAngle(node) {
  if (node.t) {
    return node.t;
  }
  if (node.children) {
    let s = 0;
    for (const child of node.children) {
      s += calculateAngle(child);
    }
    node.t = s / node.children.length;
  } else {
    node.t = (node.startAngle + node.endAngle) / 2;
  }
  return node.t;
}

export function layoutDendrogram({ root, radius }) {
  const pie = d3
    .pie()
    .sortValues(() => 0)
    .padAngle(Math.PI / 180)
    .value((node) => node.leafCount);
  for (const item of pie(root.leaves())) {
    item.data.startAngle = item.startAngle;
    item.data.endAngle = item.endAngle;
    item.data.padAngle = item.padAngle;
  }
  calculateAngle(root);
  for (const node of root) {
    if (node.children) {
      node.r =
        (root.data.data.distance - node.data.data.distance) /
        root.data.data.distance;
    } else {
      node.r = 1;
    }
    node.r = Math.tanh(((2 / ((1 - node.r) ^ 2)) ^ 2) * node.r);
    // node.r = ((2 / ((1 - node.r) ^ 2)) ^ 2) * node.r;
    // console.log(node.r, Math.asinh(node.r));
    // node.r = Math.atanh(node.r);
    // node.r = 1 / ((Math.cos(Math.asin(node.r)) + 1) / Math.sin(node.r));
    node.r *= radius;
  }
}
