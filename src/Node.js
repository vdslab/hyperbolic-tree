import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { layoutSlice } from "./store/layoutSlice";
import * as d3 from "d3";

function NodePie({ node, categories }) {
  const arcs = useMemo(() => {
    const pie = d3
      .pie()
      .value((category) => node.categories[category.label])
      .sort(() => 0);
    return pie(categories);
  }, [node.categories, categories]);
  const arc = d3.arc();
  return (
    <g>
      {arcs.map((item, i) => {
        return (
          <g key={i}>
            <path
              d={arc({
                innerRadius: 0,
                outerRadius: node.r,
                startAngle: item.startAngle,
                endAngle: item.endAngle,
              })}
              fill={item.data.color}
              stroke="#444"
            />
          </g>
        );
      })}
    </g>
  );
}

function NodeWords({ node }) {
  const displayThreshold = useSelector(
    (state) => state.layout.displayThreshold,
  );
  const d = Math.sqrt(node.xp ** 2 + node.yp ** 2);
  if (d > displayThreshold) {
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

export function Node({ node, categories }) {
  const dispatch = useDispatch();
  return (
    <g
      onClick={() => {
        dispatch(layoutSlice.actions.setCenter([node.x, node.y]));
        dispatch(layoutSlice.actions.setSelectedId(node.id));
      }}
      transform={`translate(${node.cx},${node.cy})`}
      style={{ cursor: "pointer", transition: "1s" }}
    >
      <NodePie node={node} categories={categories} />
      <NodeWords node={node} />
    </g>
  );
}
