import { project } from "./utils";
import { Node } from "./Node";
import { Link } from "./Link";
import { useState, useMemo } from "react";

export default function Dendrogram({ data }) {
  const [geo, setGeo] = useState([0, 0]);
  const windowInnerWidth = window.innerWidth;
  const windowInnerHeight = window.innerHeight;
  const padding = 40;
  const drawingAreaWidth = windowInnerWidth - padding * 2;
  const drawingAreaHeight = windowInnerHeight - padding * 2;
  const radius =
    drawingAreaWidth < drawingAreaHeight
      ? drawingAreaWidth / 2
      : drawingAreaHeight / 2;
  const { nodes, links } = useMemo(() => {
    return project(data, geo, radius);
  }, [data, geo, radius]);

  return (
    <svg
      className="hyperbolic"
      viewBox={`0, 0, ${drawingAreaWidth + 10 + 10}, ${
        drawingAreaHeight + 10 + 10
      }`}
    >
      <g transform={`translate(${10}, ${10})`}>
        <g
          transform={`translate(${drawingAreaWidth / 2}, ${
            drawingAreaHeight / 2
          })`}
        >
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
