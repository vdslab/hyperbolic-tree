function NodeWords({ node }) {
  const d = Math.sqrt(node.xp ** 2 + node.yp ** 2);
  if (d > 0.95) {
    return;
  }
  const displayWords = Math.floor((2 * node.r * Math.PI) / 10);
  const dt = 360 / displayWords;
  return (
    <g>
      {node.data.WordScore.slice(0, displayWords).map((item, i) => {
        const left = Math.cos((Math.PI * dt * i) / 180) < 0;
        return (
          <g
            key={i}
            transform={
              left
                ? `rotate(${dt * i + 180})translate(${-node.r - 3},0)`
                : `rotate(${dt * i})translate(${node.r + 3},0)`
            }
          >
            <text
              textAnchor={left ? "end" : "start"}
              dominantBaseline="central"
              fontWeight="bold"
              fontSize="10"
            >
              {item.word}
            </text>
          </g>
        );
      })}
    </g>
  );
}

export function Node({ node, onClick }) {
  const selectedId = "6640";
  return (
    <g
      onClick={onClick}
      transform={`translate(${node.cx},${node.cy})`}
      style={{ cursor: "pointer", transition: "1s" }}
    >
      <circle
        r={node.r}
        fill={node.id === selectedId ? "green" : "black"}
        opacity="0.5"
        stroke={"black"}
      />
      <NodeWords node={node} />
    </g>
  );
}
