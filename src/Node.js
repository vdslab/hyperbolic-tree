export function Node({ node, radius, onClick }) {
  const selectedId = "6640";
  return (
    <g onClick={onClick}>
      <circle
        key={node.data.data.no}
        cx={node.x * radius}
        cy={node.y * radius}
        r={node.r * 1000}
        fill={node.data.id === selectedId ? "green" : "black"}
        stroke={"black"}
        style={{ cursor: "pointer", transition: "1s" }}
      />
    </g>
  );
}
