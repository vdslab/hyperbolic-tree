import { useState, useEffect } from "react";
import * as d3 from "d3";
import Dendrogram from "./Dendrogram";

function App() {
  const [root, setRoot] = useState(null);
  useEffect(() => {
    (async () => {
      const dataPath = "./data/visdata220905.json";
      const dataResponse = await fetch(dataPath);
      const data = await dataResponse.json();

      const stratify = d3
        .stratify()
        .id((d) => d.no)
        .parentId((d) => d.parent);
      const dataStratify = stratify(data);
      const root = d3.hierarchy(dataStratify);
      setRoot(root);
    })();
  }, []);

  if (root == null) {
    return <p>Loading...</p>;
  }
  return <Dendrogram root={root} />;
}

export default App;
