import { layoutDendrogram, project } from "./utils";
import { layoutSlice } from "./store/layoutSlice";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as d3 from "d3";

function drawDendrogram(args) {
  const {
    canvas,
    padding,
    drawingAreaWidth,
    drawingAreaHeight,
    radius,
    links,
    nodes,
    contour,
    categories,
    displayThreshold,
  } = args;
  const ctx = canvas.getContext("2d");
  const arc = d3.arc().context(ctx);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.scale(devicePixelRatio, devicePixelRatio);
  ctx.translate(padding, padding);
  ctx.save();
  ctx.translate(drawingAreaWidth / 2 + radius, 0);
  categories.forEach((item, i) => {
    const itemHeight = 20;
    ctx.save();
    ctx.translate(0, itemHeight * i + itemHeight / 2);
    ctx.fillStyle = item.color;
    ctx.fillRect(2, -8, 16, 16);
    ctx.strokeStyle = "#444";
    ctx.strokeRect(2, -8, 16, 16);
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.font = '700 12px "System UI"';
    ctx.fillStyle = "#000";
    ctx.fillText(item.label, 24, 0);
    ctx.restore();
  });
  ctx.restore();
  ctx.save();
  ctx.translate(drawingAreaWidth / 2, drawingAreaHeight / 2);
  ctx.beginPath();
  ctx.ellipse(0, 0, radius, radius, 0, 0, 2 * Math.PI);
  ctx.strokeStyle = "#888";
  ctx.stroke();
  for (const item of contour) {
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(item.cx, item.cy, item.r, item.r, 0, 0, 2 * Math.PI);
    ctx.strokeStyle = "#888";
    ctx.stroke();
    ctx.restore();
  }
  for (const link of links) {
    if (
      Math.hypot(
        link.source.cx - link.target.cx,
        link.source.cy - link.target.cy
      ) >= 5
    ) {
      ctx.save();
      ctx.beginPath();
      const t1 = Math.atan2(link.source.cy - link.cy, link.source.cx - link.cx);
      const t2 = Math.atan2(link.target.cy - link.cy, link.target.cx - link.cx);
      if (link.r > 1000 || Number.isNaN(link.r)) {
        ctx.moveTo(link.source.cx, link.source.cy);
        ctx.lineTo(link.target.cx, link.target.cy);
      } else {
        ctx.arc(
          link.cx,
          link.cy,
          link.r,
          t1,
          t2,
          Math.floor((t2 - t1 + 2 * Math.PI) / Math.PI) % 2 === 1
        );
      }
      ctx.strokeStyle = "#000";
      ctx.stroke();
      ctx.restore();
    }
  }
  for (const node of nodes) {
    if (node.isVisible) {
      if (node.r >= 2) {
        ctx.save();
        ctx.translate(node.cx, node.cy);
        const pie = d3
          .pie()
          .value((category) => node.categories[category.label])
          .sort(() => 0);
        for (const item of pie(categories)) {
          ctx.beginPath();
          arc({
            innerRadius: 0,
            outerRadius: node.r,
            startAngle: item.startAngle,
            endAngle: item.endAngle,
          });
          ctx.fillStyle = item.data.color;
          ctx.fill();
          ctx.strokeStyle = "#444";
          ctx.stroke();
        }
        if (node.dp <= displayThreshold) {
          if (node.data.distance === 0) {
            const left = Math.cos(node.t) < 0;
            const title = node.data.name;
            const maxLength = 30;

            ctx.textAlign = left ? "right" : "left";
            ctx.textBasseline = "middle";
            ctx.font = `700 10px "System UI"`;
            ctx.fillText(
              title.length >= maxLength
                ? `${title.slice(0, maxLength)}…`
                : title,
              left ? -node.r - 1 : node.r + 1,
              -1
            );
          } else {
            const displayWords = Math.floor((2 * node.r * Math.PI) / 10);
            const dtDegree = 360 / displayWords;
            const dt = (Math.PI * dtDegree) / 180;
            const scoreMax = d3.max(node.data.keywords, (item) => item.score);
            node.data.keywords.slice(0, displayWords).forEach((item, i) => {
              const left = Math.cos(dt * i) < 0;
              ctx.save();
              ctx.beginPath();
              arc({
                startAngle: dt * i - dt / 2 + Math.PI / 2,
                endAngle: dt * i + dt / 2 + Math.PI / 2,
                innerRadius: node.r,
                outerRadius: node.r * (1 + 0.5 * (item.score / scoreMax)),
              });
              ctx.fillStyle = "#ffffcc";
              ctx.fill();
              ctx.strokeStyle = "#444";
              ctx.stroke();

              ctx.rotate(left ? dt * i + Math.PI : dt * i);
              ctx.textAlign = left ? "right" : "left";
              ctx.textBaseline = "middle";
              ctx.font = `700 10px "System UI"`;
              ctx.fillStyle = "#000";
              ctx.fillText(item.word, left ? -node.r - 3 : node.r + 3, 0);
              ctx.restore();
            });
          }
        }
        ctx.restore();
      }
    }
  }
  ctx.restore();
  ctx.restore();
}

export default function Dendrogram() {
  const dispatch = useDispatch();
  const canvasRef = useRef();
  const data = useSelector((state) => state.layout.data);
  const layoutMethod = useSelector((state) => state.layout.layoutMethod);
  const distanceScale = useSelector((state) => state.layout.distanceScale);
  const logBase = useSelector((state) => state.layout.logBase);
  const radiusMin = useSelector((state) => state.layout.radiusMin);
  const radiusMax = useSelector((state) => state.layout.radiusMax);
  const geo = useSelector((state) => state.layout.center);
  const rootId = useSelector((state) => state.layout.rootId);
  const displayThreshold = useSelector(
    (state) => state.layout.displayThreshold
  );
  const [clickable, setClickable] = useState(false);

  const windowInnerWidth = window.innerWidth;
  const windowInnerHeight = window.innerHeight;
  const padding = 100;
  const drawingAreaWidth = windowInnerWidth - padding * 2;
  const drawingAreaHeight = windowInnerHeight - padding * 2;
  const radius =
    drawingAreaWidth < drawingAreaHeight
      ? drawingAreaWidth / 2
      : drawingAreaHeight / 2;
  const { devicePixelRatio } = window;

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
      layoutMethod,
    });
  }, [
    data,
    distanceScale,
    logBase,
    radiusMin,
    radiusMax,
    rootId,
    layoutMethod,
  ]);
  const { nodes, links, contour } = useMemo(() => {
    if (graph == null) {
      return {};
    }
    return project(graph, geo, radius);
  }, [graph, geo, radius]);

  useEffect(() => {
    if (data == null) {
      return;
    }
    drawDendrogram({
      canvas: canvasRef.current,
      padding,
      drawingAreaWidth,
      drawingAreaHeight,
      radius,
      links,
      nodes,
      contour,
      categories: graph.categories,
      displayThreshold,
    });
  }, [
    contour,
    data,
    devicePixelRatio,
    displayThreshold,
    drawingAreaHeight,
    drawingAreaWidth,
    graph?.categories,
    links,
    nodes,
    radius,
  ]);

  if (data == null) {
    return;
  }

  return (
    <canvas
      ref={canvasRef}
      className={clickable ? "is-clickable" : ""}
      width={devicePixelRatio * (drawingAreaWidth + padding * 2)}
      height={devicePixelRatio * (drawingAreaHeight + padding * 2)}
      style={{
        width: ` ${drawingAreaWidth + padding * 2}px`,
        height: `${drawingAreaHeight + padding * 2}px`,
      }}
      onClick={(event) => {
        const x = event.clientX - padding - drawingAreaWidth / 2;
        const y = event.clientY - padding - drawingAreaHeight / 2;
        for (const node of nodes) {
          if (Math.hypot(node.cx - x, node.cy - y) <= node.r + 5) {
            const [x0, y0] = geo;
            dispatch(layoutSlice.actions.setSelectedId(node.id));
            let start;
            function update(timestamp) {
              if (!start) {
                start = timestamp;
              }
              const elapsed = timestamp - start;

              const t = d3.easeCubic(Math.min(1, elapsed / 500));
              dispatch(
                layoutSlice.actions.setCenter([
                  t * node.x + (1 - t) * x0,
                  t * node.y + (1 - t) * y0,
                ])
              );
              if (t < 1) {
                requestAnimationFrame(update);
              }
            }
            requestAnimationFrame(update);
            return;
          }
        }
      }}
      onMouseMove={(event) => {
        const x = event.clientX - padding - drawingAreaWidth / 2;
        const y = event.clientY - padding - drawingAreaHeight / 2;
        for (const node of nodes) {
          if (Math.hypot(node.cx - x, node.cy - y) <= node.r + 5) {
            setClickable(true);
            return;
          }
        }
        setClickable(false);
      }}
    />
  );
}
