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

export function calculateGeo(nodes, geo) {
  for (const node of nodes) {
    node.hx -= geo[0];
    node.hy -= geo[1];
    const r = Math.sqrt(Math.pow(node.hx, 2) + Math.pow(node.hy, 2));
    node.hz = Math.cosh(Math.asinh(r));
    [node.x, node.y] = [node.hx / (node.hz + 1), node.hy / (node.hz + 1)];
  }
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
      node.r = 0.9;
    }
    //双曲空間での広がり方に対応(H=(2 / ((1 - R) ^ 2)) ^ 2) * R)
    // node.h = ((2 / ((1 - node.r) ^ 2)) ^ 2) * node.r * 10;
    node.h = (2 / (1 - node.r ** 2)) ** 2 * node.r;
    //双曲空間の傾き
    // node.A = Math.tanh(node.h);
    //双曲空間の座標
    [node.hx, node.hy, node.hz] = [
      Math.sinh(node.h) * Math.cos(node.t),
      Math.sinh(node.h) * Math.sin(node.t),
      Math.cosh(node.h),
    ];
  }
}

// export function initialDistanceThreshold(searchParams, root) {
//   if (searchParams.has("distanceThreshold")) {
//     const distanceThreshold = +searchParams.get("distanceThreshold");
//     if (distanceThreshold > 0) {
//       return distanceThreshold;
//     }
//   }
//   return distanceBinarySearch(root);
// }
