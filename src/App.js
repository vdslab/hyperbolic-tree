import { useState, useEffect } from "react";
import Dendrogram from "./Dendrogram";
import { layoutDendrogram } from "./utils";

function App() {
  const [data, setData] = useState(null);
  useEffect(() => {
    (async () => {
      const dataPath = "./data/visdata220905.json";
      const dataResponse = await fetch(dataPath);
      const data = await dataResponse.json();
      setData(layoutDendrogram(data));
    })();
  }, []);

  if (data == null) {
    return <p>Loading...</p>;
  }
  return <Dendrogram data={data} />;
}

export default App;
