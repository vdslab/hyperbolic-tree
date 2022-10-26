import * as d3 from "d3";
export function Link({ link, radius }) {
  const poincareR = 3;
  const displayR = poincareR * radius;
  const [x1, y1] = [radius * link.source.x, radius * link.source.y];
  const [x2, y2] = [radius * link.target.x, radius * link.target.y];
  const b1 = (x1 * x1 + y1 * y1 + displayR * displayR) / 2;
  const b2 = (x2 * x2 + y2 * y2 + displayR * displayR) / 2;
  const d = x1 * y2 - y1 * x2;
  const cx = (link.cx = (y2 * b1 - y1 * b2) / d);
  const cy = (link.cy = (x1 * b2 - x2 * b1) / d);
  link.r = Math.sqrt(cx * cx + cy * cy - displayR * displayR);
  link.x1 = x1;
  link.y1 = y1;
  link.x2 = x2;
  link.y2 = y2;
  const t1 = Math.atan2(link.y1 - cy, link.x1 - cx);
  const t2 = Math.atan2(link.y2 - cy, link.x2 - cx);
  const path = d3.path();
  if (link.cx === -Infinity || link.cx === Infinity) {
    path.moveTo(x1, y1);
    path.lineTo(x2, y2);
  } else {
    path.arc(
      cx,
      cy,
      link.r,
      t1,
      t2,
      Math.floor((t2 - t1 + 2 * Math.PI) / Math.PI) % 2 === 1
    );
  }
  return (
    <g>
      <path
        d={path.toString()}
        stroke="black"
        fill="none"
        style={{ transition: "1s" }}
      ></path>
    </g>
  );
}
