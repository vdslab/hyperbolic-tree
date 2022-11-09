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
    (state) => state.layout.displayThreshold
  );
  if (node.dp > displayThreshold) {
    return;
  }
  if (node.data.distance === 0) {
    const left = Math.cos(node.t) < 0;
    const title = node.data.Title;
    const maxLength = 30;
    return (
      <text
        x={left ? -node.r - 1 : node.r + 1}
        y="-1"
        textAnchor={left ? "end" : "start"}
        dominantBaseline="central"
        fontWeight="bold"
        fontSize="10"
      >
        {title.length >= maxLength ? `${title.slice(0, maxLength)}…` : title}
      </text>
    );
  }
  const displayWords = Math.floor((2 * node.r * Math.PI) / 10);
  const dtDegree = 360 / displayWords;
  const dt = (Math.PI * dtDegree) / 180;
  const arc = d3.arc();
  const scoreMax = d3.max(node.data.WordScore, (item) => item.score);
  return (
    <g>
      {node.data.WordScore.slice(0, displayWords).map((item, i) => {
        const left = Math.cos(dt * i) < 0;
        return (
          <g key={i}>
            <path
              d={arc({
                startAngle: dt * i - dt / 2 + Math.PI / 2,
                endAngle: dt * i + dt / 2 + Math.PI / 2,
                innerRadius: node.r,
                outerRadius: node.r * (1 + 0.5 * (item.score / scoreMax)),
              })}
              fill="#ffffcc"
              stroke="#444"
            />
            <text
              transform={
                left
                  ? `rotate(${dtDegree * i + 180})`
                  : `rotate(${dtDegree * i})`
              }
              x={left ? -node.r - 3 : node.r + 3}
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
      <title>{node.data.Title + "\n" + node.data.Abstract}</title>
      <NodePie node={node} categories={categories} />
      <NodeWords node={node} />
    </g>
  );
}
