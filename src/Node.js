export function Node({ node, radius, geo, onClick }) {
  const selectedId = "6640";
  if (node.data.id === selectedId) {
    console.log(geo, node);
  }
  node.hx -= geo[0];
  node.hy -= geo[1];
  const r = Math.sqrt(Math.pow(node.hx, 2) + Math.pow(node.hy, 2));
  const z = Math.cosh(Math.asinh(r));
  const [x, y] = [node.hx / (z + 1), node.hy / (z + 1)];
  return (
    <g onClick={onClick}>
      <circle
        key={node.data.data.no}
        cx={x * radius}
        cy={y * radius}
        r={r === 0 ? 30 : 3 / r} //双曲空間での距離に合わせてサイズを調整
        // fill={y === 0 ? "red" : "black"}
        fill={node.data.id === selectedId ? "green" : "black"}
        style={{ cursor: "pointer", transition: "1s" }}
      />
    </g>
  );
}
