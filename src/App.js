import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Dendrogram from "./Dendrogram";
import Form from "./Form";
import { layoutSlice } from "./store/layoutSlice";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      const dataPath = "./data/visdata220905.json";
      const dataResponse = await fetch(dataPath);
      const data = await dataResponse.json();
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
    </div>
  );
}

export default App;
