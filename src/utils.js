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

function calculateR(d) {
  //双曲空間での半径を指定
  const hr = 0.1;
  const [hr1, hr2] = [d - hr, d + hr];
  const [hr1hz, hr2hz] = [Math.sqrt(1 + hr1 ** 2), Math.sqrt(1 + hr2 ** 2)];
  const [dr1, dr2] = [(hr1hz + 1) / hr1, (hr2hz + 1) / hr2];
  const [r1, r2] = [1 / dr1, 1 / dr2];
  return Math.abs((r1 + r2) / 2 - r1);
}
export function calculateGeo(nodes, geo) {
  for (const node of nodes) {
    node.hx -= geo[0];
    node.hy -= geo[1];
    const d = Math.sqrt(node.hx ** 2 + node.hy ** 2);
    const hz = Math.sqrt(1 + d ** 2);
    const dx = (hz + 1) / node.hx;
    const dy = (hz + 1) / node.hy;

    [node.x, node.y, node.r] = [1 / dx, 1 / dy, calculateR(d)];
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
      node.d =
        (root.data.data.distance - node.data.data.distance) /
        root.data.data.distance;
    } else {
      node.d = 0.9;
    }
    //双曲空間にdistanceをx軸にして貼り付ける
    node.d *= 50;
    node.h = Math.sqrt(1 + node.d ** 2);
    [node.hx, node.hy] = [node.d * Math.cos(node.t), node.d * Math.sin(node.t)];
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
