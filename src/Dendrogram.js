import { layoutDendrogram } from "./utils";
import { Node } from "./Node";
import { useState, useEffect, useMemo } from "react";
import * as d3 from "d3";

export default function Dendrogram({ root }) {
  const [, setIni] = useState(null);
  const [geo, setGeo] = useState([0, 0]);
  // const [selectedId, setSelectedId] = useState(null);
  const windowInnerWidth = window.innerWidth;
  const windowInnerHeight = window.innerHeight;
  const padding = 40;
  const drawingAreaWidth = windowInnerWidth - padding * 2;
  const drawingAreaHeight = windowInnerHeight - padding * 2;
  const radius =
    drawingAreaWidth < drawingAreaHeight
      ? drawingAreaWidth / 2
      : drawingAreaHeight / 2;
  const nodes = root.descendants();
  useEffect(() => {
    setIni("drawing");
    layoutDendrogram({ root, radius });
    const distanceMax = d3.max(nodes, (node) => {
      return node.h;
    });
    console.log(distanceMax);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // const links = root.links();

  if (root.hx === undefined) {
    return <div>drawing</div>;
  }
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
          {/* {links.map((link) => {
              const x2 = Math.cos(link.source.t) * link.source.r;
              const y2 = Math.sin(link.source.t) * link.source.r;
              const x3 = Math.cos(link.target.t) * link.target.r;
              const y3 = Math.sin(link.target.t) * link.target.r;
              const path = d3.path();
              path.moveTo(x2, y2);
              path.lineTo(x3, y3);
              return (
                <path
                  key={link.target.data.id}
                  d={path.toString()}
                  stroke="#888"
                  fill="none"
                ></path>
              );
            })} */}
          {nodes.map((node) => {
            return (
              <Node
                key={node.data.id}
                node={node}
                radius={radius}
                geo={geo}
                onClick={() => {
                  setGeo([node.hx, node.hy]);
                }}
              ></Node>
            );
          })}
        </g>
      </g>
    </svg>
  );
}
