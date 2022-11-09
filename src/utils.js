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

function aggregateCategory(node, categories) {
  node.categories = {};
  for (const category of categories) {
    node.categories[category] = 0;
  }
  if (node.children) {
    for (const child of node.children) {
      aggregateCategory(child, categories);
      for (const category of categories) {
        node.categories[category] += child.categories[category];
      }
    }
  } else {
    node.categories[node.data.data.category] += 1;
  }
}

export function aggregateWords(node) {
  if (node.children) {
    const words = new Set();
    const childrenWords = node.children.map((child) => {
      const childWords = {};
      for (const item of aggregateWords(child)) {
        words.add(item.word);
        childWords[item.word] = item.score;
      }
      return childWords;
    });
    const minWordScore = {};
    for (const word of words) {
      minWordScore[word] = childrenWords.every((childWord) => word in childWord)
        ? d3.min(childrenWords, (childWords) => childWords[word])
        : 0;
    }
    for (const child of node.children) {
      child.data.data.WordScore = child.data.data.TopicScore.map((item) => {
        return {
          word: item.word,
          score: item.score - minWordScore[item.word],
        };
      }).filter((item) => item.score > 0);
    }
    node.data.data.TopicScore = [];
    for (const word of words) {
      if (minWordScore[word] > 0) {
        node.data.data.TopicScore.push({
          word,
          score: node.children.length * minWordScore[word],
        });
      }
    }
    node.data.data.TopicScore.sort((item1, item2) => item2.score - item1.score);
    return node.data.data.TopicScore;
  } else {
    return node.data.data.TopicScore;
  }
}

export function project(data, [x0, y0], radius) {
  const nodes = {};
  for (const node of data.nodes) {
    const [x, y] = rotate([node.x, node.y], [x0, y0]);

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
      t,
      x: node.x,
      y: node.y,
      xp: x,
      yp: y,
      dp: Math.sqrt(x * x + y * y),
      categories: node.categories,
      data: node.data,
      r: radius * r,
      cx: radius * cx,
      cy: radius * cy,
      isVisible: node.isVisible,
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
      const { r, cx, cy } = projectedCircle(hr, [x0, y0]);
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
  { distanceScale, logBase, radiusMin, radiusMax, rootId, layoutMethod },
) {
  const stratify = d3
    .stratify()
    .id((d) => d.no)
    .parentId((d) => d.parent);
  const dataStratify = stratify(data);
  const originalRoot = d3.hierarchy(dataStratify);
  const root =
    rootId == null
      ? originalRoot
      : originalRoot.descendants().find((node) => node.data.id === rootId);

  const hdScale = d3
    .scaleLinear()
    .domain(d3.extent(root.descendants(), (node) => node.data.data.distance))
    .range([10, 0]);
  const hrScale = d3
    .scaleSqrt()
    .domain([0, root.descendants().length])
    .range([radiusMin, radiusMax]);
  for (const node of root) {
    node.hd = hdScale(node.data.data.distance);
    node.hr = hrScale(node.descendants().length);
  }

  if (layoutMethod === "bottomup") {
    bottomUpLayout(root);
  } else {
    topDownLayout(root);
  }

  root.isVisible = true;
  if (root.children) {
    for (const node of root.children) {
      checkNodeVisibility(node, root);
    }
  }

  const categories = [...new Set(data.map((item) => item.category))].filter(
    (category) => category,
  );
  categories.sort();
  aggregateCategory(root, categories);

  const categoryColor = d3.scaleOrdinal(d3.schemeCategory10);
  return {
    nodes: root.descendants().map((node) => {
      return {
        id: node.data.id,
        x: node.x,
        y: node.y,
        hr: node.hr,
        categories: node.categories,
        data: node.data.data,
        isVisible: node.isVisible,
      };
    }),
    links: root.links().map((link) => {
      return {
        source: link.source.data.id,
        target: link.target.data.id,
      };
    }),
    categories: categories.map((category) => {
      return {
        label: category,
        color: categoryColor(category),
      };
    }),
  };
}

function bottomUpLayout(root) {
  const pie = d3
    .pie()
    .sortValues(() => 0)
    .padAngle(2 * Math.PI)
    .value((node) => node.leafCount);
  for (const item of pie(root.leaves())) {
    item.data.startAngle = item.startAngle;
    item.data.endAngle = item.endAngle;
    item.data.padAngle = item.padAngle;
  }
  calculateAngle(root);
  for (const node of root) {
    const d = Math.tanh(node.hd / 2);
    node.x = d * Math.cos(node.t);
    node.y = d * Math.sin(node.t);
  }
}

function topDownLayout(root) {
  root.x = 0;
  root.y = 0;
  if (root.children) {
    const dt = (2 * Math.PI) / root.children.length;
    root.children.forEach((node, i) => {
      const t = dt * i;
      const d = Math.tanh(node.hd / 2);
      node.x = d * Math.cos(t);
      node.y = d * Math.sin(t);
      recursiveLayout(node, root);
    });
  }
}

function recursiveLayout(node, root) {
  if (!node.children) {
    return;
  }
  const childAngle = Math.PI;
  const dt = childAngle / (node.children.length - 1);
  const [xo, yo] = rotate([root.x, root.y], [node.x, node.y]);
  const to = Math.atan2(-yo, -xo);
  node.children.forEach((child, i) => {
    const { r: r2, cx, cy } = projectedCircle(child.hd, [node.x, node.y]);
    const r1 = Math.sqrt(cx * cx + cy * cy);
    const t = dt * i - childAngle / 2;
    const d =
      Math.sqrt(r2 * r2 - r1 * r1 * Math.cos(Math.PI / 2 - t) ** 2) -
      r1 * Math.sin(Math.PI / 2 - t);
    [child.x, child.y] = rotateInverse(
      [d * Math.cos(t + to), d * Math.sin(t + to)],
      [node.x, node.y],
    );
    recursiveLayout(child, root);
  });
}

/**
 * rotation about (x0, y0)
 */
function rotate([x, y], [x0, y0]) {
  const dx = x - x0;
  const dy = y - y0;
  const dr = 1 - x0 * x - y0 * y;
  const di = y0 * x - x0 * y;
  const d = dr * dr + di * di;
  return [(dr * dx + di * dy) / d, (dr * dy - di * dx) / d];
}

/**
 * inverse rotation about (x0, y0)
 */
function rotateInverse([x, y], [x0, y0]) {
  const dx = -x - x0;
  const dy = -y - y0;
  const dr = -1 - x0 * x - y0 * y;
  const di = y0 * x - x0 * y;
  const d = dr * dr + di * di;
  return [(dr * dx + di * dy) / d, (dr * dy - di * dx) / d];
}

function projectedCircle(hr, [x0, y0]) {
  const x = -x0;
  const y = -y0;
  const hd = 2 * Math.atanh(Math.sqrt(x ** 2 + y ** 2));
  const t = Math.atan2(y, x);
  const dNear = Math.tanh((hd - hr) / 2);
  const dFar = Math.tanh((hd + hr) / 2);
  return {
    r: (dFar - dNear) / 2,
    cx: (Math.cos(t) * (dNear + dFar)) / 2,
    cy: (Math.sin(t) * (dNear + dFar)) / 2,
  };
}

function checkNodeVisibility(node, root) {
  if (node.children) {
    if (root.hr + node.hr <= node.hd - root.hd) {
      node.isVisible = true;
      root = node;
    }
    for (const child of node.children) {
      checkNodeVisibility(child, root);
    }
  } else {
    node.isVisible = true;
  }
}
