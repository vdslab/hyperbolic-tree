import * as d3 from "d3";
export function Link({ link }) {
  const t1 = Math.atan2(link.source.cy - link.cy, link.source.cx - link.cx);
  const t2 = Math.atan2(link.target.cy - link.cy, link.target.cx - link.cx);
  const path = d3.path();
  if (
    link.cx === -Infinity ||
    link.cx === Infinity ||
    link.cy === -Infinity ||
    link.cy === Infinity
  ) {
    path.moveTo(link.source.cx, link.source.cy);
    path.lineTo(link.target.cx, link.target.cy);
  } else {
    path.arc(
      link.cx,
      link.cy,
      link.r,
      t1,
      t2,
      Math.floor((t2 - t1 + 2 * Math.PI) / Math.PI) % 2 === 1,
    );
  }
  return (
    <g>
      <path
        d={path.toString()}
        stroke="black"
        fill="none"
        style={{ transition: "1s" }}
      />
    </g>
  );
}
