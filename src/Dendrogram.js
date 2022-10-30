import { project } from "./utils";
import { Node } from "./Node";
import { Link } from "./Link";
import { useState, useMemo } from "react";

export default function Dendrogram({ data }) {
  const [geo, setGeo] = useState([0, 0]);
  const windowInnerWidth = window.innerWidth;
  const windowInnerHeight = window.innerHeight;
  const padding = 100;
  const drawingAreaWidth = windowInnerWidth - padding * 2;
  const drawingAreaHeight = windowInnerHeight - padding * 2;
  const radius =
    drawingAreaWidth < drawingAreaHeight
      ? drawingAreaWidth / 2
      : drawingAreaHeight / 2;
  const { nodes, links, contour } = useMemo(() => {
    return project(data, geo, radius);
  }, [data, geo, radius]);

  return (
    <svg
      className="hyperbolic"
      viewBox={`0, 0, ${drawingAreaWidth + padding * 2}, ${
        drawingAreaHeight + padding * 2
      }`}
    >
      <g transform={`translate(${padding}, ${padding})`}>
        <g
          transform={`translate(${drawingAreaWidth / 2}, ${
            drawingAreaHeight / 2
          })`}
        >
          <g>
            <circle r={radius} fill="none" stroke="#888" />
          </g>
          <g>
            {contour.map((item, i) => {
              return (
                <g key={i}>
                  <circle
                    cx={item.cx}
                    cy={item.cy}
                    r={item.r}
                    fill="none"
                    stroke="#888"
                  />
                </g>
              );
            })}
          </g>
          <g>
            {links.map((link) => {
              return (
                <Link key={`${link.source.id}:${link.target.id}`} link={link} />
              );
            })}
          </g>
          <g>
            {nodes.map((node) => {
              return (
                <Node
                  key={node.id}
                  node={node}
                  onClick={() => {
                    setGeo([node.x, node.y]);
                  }}
                />
              );
            })}
          </g>
        </g>
      </g>
    </svg>
  );
}
