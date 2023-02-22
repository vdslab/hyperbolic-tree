import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Dendrogram from "./Dendrogram";
import Form from "./Form";
import BasicTable from "./Table";
import { layoutSlice } from "./store/layoutSlice";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      const dataPath = "./data/jsons/tdb/230208/T2V_CC_230222.json";
      const dataResponse = await fetch(dataPath);
      const data = await dataResponse.json();
      for (const node of data) {
        // node.category = node.topic;
        node.keywords.sort((a, b) => b.score - a.score);
      }
      dispatch(layoutSlice.actions.setData(data));
    })();
  }, [dispatch]);

  return (
    <div>
      <div className="dendrogram">
        <Dendrogram />
      </div>
      <div className="form">
        <Form />
      </div>
      {/* <div className="basicTable">
        <BasicTable />
      </div> */}
    </div>
  );
}

export default App;
