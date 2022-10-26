import { calculateGeo, layoutDendrogram } from "./utils";
import { Node } from "./Node";
import { Link } from "./Link";
import { useState, useMemo } from "react";
import * as d3 from "d3";

export default function Dendrogram({ root }) {
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
  const nodes = useMemo(() => {
    const nodes = root.descendants();
    layoutDendrogram({ root, radius });
    const distanceMax = d3.max(nodes, (node) => {
      return node.h;
    });
    return nodes;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [root]);
  calculateGeo(nodes, geo);
  const hzExtent = d3.extent(nodes, (node) => {
    return node.hz;
  });
  console.log(hzExtent);

  const rScale = d3
    .scaleLinear()
    .domain([hzExtent[0], hzExtent[1] / 1000])
    .range([100, 0]);
  const links = root.links();

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
            return (
              <Link
                key={link.target.data.id}
                link={link}
                radius={radius}
              ></Link>
            );
          })} */}
          {nodes
            // .filter((node) => node.hz <= hzExtent[1] / 1000)
            .map((node) => {
              return (
                <Node
                  key={node.data.id}
                  node={node}
                  radius={radius}
                  geo={geo}
                  r={rScale(node.hz)}
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
