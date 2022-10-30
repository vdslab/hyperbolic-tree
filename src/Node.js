export function Node({ node, onClick }) {
  const selectedId = "6640";
  return (
    <g onClick={onClick}>
      <circle
        cx={node.cx}
        cy={node.cy}
        r={node.r}
        fill={node.id === selectedId ? "green" : "black"}
        opacity="0.5"
        stroke={"black"}
        style={{ cursor: "pointer", transition: "1s" }}
      />
    </g>
  );
}
