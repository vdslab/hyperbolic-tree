import { layoutDendrogram } from "./utils";

export default function Dendrogram({ root }) {
  const windowInnerWidth = window.innerWidth;
  const windowInnerHeight = window.innerHeight;
  const padding = 40;
  const drawingAreaWidth = windowInnerWidth - padding * 2;
  const drawingAreaHeight = windowInnerHeight - padding * 2;
  const radius =
    drawingAreaWidth < drawingAreaHeight
      ? drawingAreaWidth / 2
      : drawingAreaHeight / 2;
  layoutDendrogram({ root, radius });
  const nodes = root.descendants();
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
            const [x, y] =
              node.r === 0
                ? [0, 0]
                : [Math.cos(node.t) * node.r, Math.sin(node.t) * node.r];
            return (
              <circle
                key={node.data.data.no}
                cx={x}
                cy={y}
                r="6"
                fill={y === 0 ? "green" : "black"}
              />
            );
          })}
        </g>
      </g>
    </svg>
  );
}
