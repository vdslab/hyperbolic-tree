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

export function project(data, [x0, y0], radius) {
  const nodes = {};
  for (const node of data.nodes) {
    // rotate around (x0, y0)
    const dx = node.x - x0;
    const dy = node.y - y0;
    const dr = 1 - x0 * node.x - y0 * node.y;
    const di = y0 * node.x - x0 * node.y;
    const d = dr * dr + di * di;
    const x = (dr * dx + di * dy) / d;
    const y = (dr * dy - di * dx) / d;

    // calculate circle geometry
    const hd = 2 * Math.atanh(Math.sqrt(x ** 2 + y ** 2));
    const t = Math.atan2(y, x);
    const dNear = Math.tanh((hd - node.hr) / 2);
    const dFar = Math.tanh((hd + node.hr) / 2);
    const r = (dFar - dNear) / 2;
    const cx = (Math.cos(t) * (dNear + dFar)) / 2;
    const cy = (Math.sin(t) * (dNear + dFar)) / 2;

    nodes[node.id] = {
      id: node.id,
      x: node.x,
      y: node.y,
      xp: x,
      yp: y,
      data: node.data,
      r: radius * r,
      cx: radius * cx,
      cy: radius * cy,
    };
  }
  return {
    nodes: data.nodes.map((node) => nodes[node.id]),
    links: data.links.map((link) => {
      const source = nodes[link.source];
      const target = nodes[link.target];
      const [x1, y1] = [source.cx, source.cy];
      const [x2, y2] = [target.cx, target.cy];
      const b1 = (x1 ** 2 + y1 ** 2 + radius ** 2) / 2;
      const b2 = (x2 ** 2 + y2 ** 2 + radius ** 2) / 2;
      const d = x1 * y2 - y1 * x2;
      const cx = (y2 * b1 - y1 * b2) / d;
      const cy = (x1 * b2 - x2 * b1) / d;
      return {
        source,
        target,
        cx,
        cy,
        r: Math.sqrt(cx ** 2 + cy ** 2 - radius ** 2),
      };
    }),
    contour: [...Array(10)].map((_, i) => {
      const r0 = 1 - 0.5 ** (i + 1) - 1e-3;
      const hr = 2 * Math.atanh(r0);

      const x = -x0;
      const y = -y0;
      const hd = 2 * Math.atanh(Math.sqrt(x ** 2 + y ** 2));
      const t = Math.atan2(y, x);
      const dNear = Math.tanh((hd - hr) / 2);
      const dFar = Math.tanh((hd + hr) / 2);
      const r = (dFar - dNear) / 2;
      const cx = (Math.cos(t) * (dNear + dFar)) / 2;
      const cy = (Math.sin(t) * (dNear + dFar)) / 2;

      return {
        hr,
        r: radius * r,
        cx: radius * cx,
        cy: radius * cy,
      };
    }),
  };
}

export function layoutDendrogram(
  data,
  { distanceScale, logBase, radiusMin, radiusMax },
) {
  const stratify = d3
    .stratify()
    .id((d) => d.no)
    .parentId((d) => d.parent);
  const dataStratify = stratify(data);
  const root = d3.hierarchy(dataStratify);
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
  const hrScale = d3
    .scaleSqrt()
    .domain([0, root.descendants().length])
    .range([radiusMin, radiusMax]);
  for (const node of root) {
    // log scale distance
    const hd0 =
      (root.data.data.distance - node.data.data.distance) * distanceScale;
    const hd = Math.log(hd0 + 1) / Math.log(logBase);
    node.hr = hrScale(node.descendants().length);
    // project to disk
    const d = Math.tanh(hd / 2);
    node.x = d * Math.cos(node.t);
    node.y = d * Math.sin(node.t);
  }
  return {
    nodes: root.descendants().map((node) => {
      return {
        id: node.data.id,
        x: node.x,
        y: node.y,
        hr: node.hr,
        data: node.data.data,
      };
    }),
    links: root.links().map((link) => {
      return {
        source: link.source.data.id,
        target: link.target.data.id,
      };
    }),
  };
}
