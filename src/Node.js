export function Node({ node, radius, geo, onClick, r }) {
  const selectedId = "6640";
  // console.log(node.hz, r);
  return (
    <g onClick={onClick}>
      <circle
        key={node.data.data.no}
        cx={node.x * radius}
        cy={node.y * radius}
        r={10} //双曲空間での距離に合わせてサイズを調整
        // fill={y === 0 ? "red" : "black"}
        fill={node.data.id === selectedId ? "green" : "black"}
        stroke={"black"}
        style={{ cursor: "pointer", transition: "1s" }}
      />
    </g>
  );
}
