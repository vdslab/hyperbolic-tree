import { layoutDendrogram, project } from "./utils";
import { Node } from "./Node";
import { Link } from "./Link";
import { useMemo } from "react";
import { useSelector } from "react-redux";

export default function Dendrogram() {
  const data = useSelector((state) => state.layout.data);
  const distanceScale = useSelector((state) => state.layout.distanceScale);
  const logBase = useSelector((state) => state.layout.logBase);
  const radiusMin = useSelector((state) => state.layout.radiusMin);
  const radiusMax = useSelector((state) => state.layout.radiusMax);
  const geo = useSelector((state) => state.layout.center);
  const rootId = useSelector((state) => state.layout.rootId);

  const windowInnerWidth = window.innerWidth;
  const windowInnerHeight = window.innerHeight;
  const padding = 100;
  const drawingAreaWidth = windowInnerWidth - padding * 2;
  const drawingAreaHeight = windowInnerHeight - padding * 2;
  const radius =
    drawingAreaWidth < drawingAreaHeight
      ? drawingAreaWidth / 2
      : drawingAreaHeight / 2;

  const graph = useMemo(() => {
    if (data == null) {
      return null;
    }
    return layoutDendrogram(data, {
      distanceScale,
      logBase,
      radiusMin,
      radiusMax,
      rootId,
    });
  }, [data, distanceScale, logBase, radiusMin, radiusMax, rootId]);
  const { nodes, links, contour } = useMemo(() => {
    if (graph == null) {
      return {};
    }
    return project(graph, geo, radius);
  }, [graph, geo, radius]);

  if (data == null) {
    return;
  }

  return (
    <svg
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
              return <Node key={node.id} node={node} />;
            })}
          </g>
        </g>
      </g>
    </svg>
  );
}
