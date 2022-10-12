import { useState, useEffect } from "react";
import * as d3 from "d3";

function CollapsibleTree() {
  // ステートの設定
  const [data, setData] = useState(null);
  // const [root, setRoot] = useState(null);

  // データの読み込み
  useEffect(() => {
    (async () => {
      const dataPath = "./data/test_data.json";
      const dataResponse = await fetch(dataPath);
      const data = await dataResponse.json();
      setData(data);
      console.log(data);
      // hierarchy用データへの変換
      // setRoot(d3.hierarchy(data));
    })();
  }, []);

  // データがnullの場合の処理
  if (data == null) {
    return <p>Loading...</p>;
  }

  // hierarchy用データへの変換
  // setRoot(d3.hierarchy(data));

  const root = d3.hierarchy(data);

  // 初期段階での描画は1階目までのノードとリンクに限定する
  root.descendants().forEach((d, i) => {
    d._children = d.children;
    // if (d.depth >= 1) {
    //   d.children = null;
    // }
  });

  // ブラウザのウインドウサイズを取得
  const windowInnerWidth = window.innerWidth;
  const windowInnerHeight = window.innerHeight;

  // CollapsibleTreeの描画領域を設定
  const padding = 40;
  const drawingAreaWidth = windowInnerWidth - padding * 2;
  const drawingAreaHeight = windowInnerHeight - padding * 2;

  // ツリーレイアウトの座標の計算
  const tree = d3.tree().size([drawingAreaWidth, drawingAreaHeight]);
  tree(root);

  const nodes = root.descendants();
  console.log(nodes);
  const links = root.links();

  return (
    <svg
      width={windowInnerWidth}
      height={windowInnerHeight}
      viewBox={"0, 0, " + windowInnerWidth + ", " + windowInnerHeight}
      xmlns="http://www.w3.org/2000/svg"
    >
      {links.map((d, i) => {
        const sourceX = d.source.x;
        const sourceY = d.source.y;
        const targetX = d.target.x;
        const targetY = d.target.y;
        const sourceXCorr =
          (sourceY / drawingAreaHeight) * drawingAreaWidth + padding;
        const sourceYCorr =
          (sourceX / drawingAreaWidth) * drawingAreaHeight + padding;
        const targetXCorr =
          (targetY / drawingAreaHeight) * drawingAreaWidth + padding;
        const targetYCorr =
          (targetX / drawingAreaWidth) * drawingAreaHeight + padding;
        const id = i;
        return (
          <g key={id}>
            <path
              d={
                "M " +
                sourceXCorr +
                ", " +
                sourceYCorr +
                " C " +
                Math.abs(sourceXCorr + targetXCorr) / 2 +
                ", " +
                sourceYCorr +
                " " +
                Math.abs(sourceXCorr + targetXCorr) / 2 +
                ", " +
                targetYCorr +
                " " +
                targetXCorr +
                ", " +
                targetYCorr
              }
              stroke="#888888"
              fill="transparent"
            />
          </g>
        );
      })}

      {nodes.map((d, i) => {
        // ノード名の取得
        const nodeName = d.data.name;

        const x = d.x;
        const y = d.y;
        // ツリーの座標を縦型から横型に変換
        const xCorr = (y / drawingAreaHeight) * drawingAreaWidth + padding;
        const yCorr = (x / drawingAreaWidth) * drawingAreaHeight + padding;
        const id = i;
        return (
          <g key={id}>
            <circle
              cx={xCorr}
              cy={yCorr}
              r={10}
              fill="#888888"
              onClick={() => {
                d.children = d.children ? null : d._children;
                root.descendants().forEach((d2, i) => {
                  if (d2.data.name === d.data.name) {
                    d2.data.children = d.children;
                    // console.log(d2.data.children);
                  }
                });
                console.log(data);
                setData(data);
                // <CollapsibleTree data={data} />;
              }}
            />
            <title>{nodeName}</title>
          </g>
        );
      })}
    </svg>
  );
}

function App() {
  return <CollapsibleTree />;
}

export default App;
