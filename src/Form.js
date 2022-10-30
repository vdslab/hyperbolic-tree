import { useDispatch, useSelector } from "react-redux";
import { layoutSlice } from "./store/layoutSlice";

export default function Form() {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.layout.data);
  const distanceScale = useSelector((state) => state.layout.distanceScale);
  const logBase = useSelector((state) => state.layout.logBase);
  const radiusMin = useSelector((state) => state.layout.radiusMin);
  const radiusMax = useSelector((state) => state.layout.radiusMax);
  const displayThreshold = useSelector(
    (state) => state.layout.displayThreshold,
  );
  const selectedId = useSelector((state) => state.layout.selectedId);
  return (
    <div className="box has-background-grey-light p-2">
      <div className="block">
        <h3 className="title is-5 mb-2">Layout Parameters</h3>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            dispatch(
              layoutSlice.actions.setDistanceScale(
                +event.target.elements.distanceScale.value,
              ),
            );
            dispatch(
              layoutSlice.actions.setLogBase(
                +event.target.elements.logBase.value,
              ),
            );
            dispatch(
              layoutSlice.actions.setRadiusMin(
                +event.target.elements.radiusMin.value,
              ),
            );
            dispatch(
              layoutSlice.actions.setRadiusMax(
                +event.target.elements.radiusMax.value,
              ),
            );
            dispatch(
              layoutSlice.actions.setDisplayThreshold(
                +event.target.elements.displayThreshold.value,
              ),
            );
          }}
        >
          <div className="field">
            <label className="label">Distance Scale</label>
            <div className="control">
              <input
                className="input"
                name="distanceScale"
                type="number"
                step="10"
                defaultValue={distanceScale}
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Log Base</label>
            <div className="control">
              <input
                className="input"
                name="logBase"
                type="number"
                defaultValue={logBase}
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Radius Min</label>
            <div className="control">
              <input
                className="input"
                name="radiusMin"
                type="number"
                step="0.1"
                defaultValue={radiusMin}
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Radius Max</label>
            <div className="control">
              <input
                className="input"
                name="radiusMax"
                type="number"
                step="0.1"
                defaultValue={radiusMax}
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Display Threshold</label>
            <div className="control">
              <input
                className="input"
                name="displayThreshold"
                type="number"
                step="0.1"
                defaultValue={displayThreshold}
              />
            </div>
          </div>
          <div className="field">
            <div className="control">
              <button type="submit" className="button is-fullwidth">
                Update
              </button>
            </div>
          </div>
        </form>
      </div>
      <div className="block">
        <h3 className="title is-5 mb-2">Filter</h3>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            dispatch(
              layoutSlice.actions.setRootId(
                event.target.elements.rootId.value || null,
              ),
            );
            dispatch(layoutSlice.actions.setCenter([0, 0]));
          }}
        >
          <div className="field">
            <label className="label">Root Node ID</label>
            <div className="control">
              <div className="select is-fullwidth">
                <select
                  name="rootId"
                  value={selectedId || ""}
                  onChange={(event) => {
                    dispatch(
                      layoutSlice.actions.setSelectedId(event.target.value),
                    );
                  }}
                >
                  <option key="none" value=""></option>
                  {data &&
                    data.map((item) => {
                      return (
                        <option key={item.no} value={item.no}>
                          {item.no}
                        </option>
                      );
                    })}
                </select>
              </div>
            </div>
          </div>
          <div className="field">
            <div className="control">
              <button type="submit" className="button is-fullwidth">
                Apply
              </button>
            </div>
          </div>
          <div className="field">
            <div className="control">
              <button
                className="button is-fullwidth"
                onClick={(event) => {
                  event.preventDefault();
                  dispatch(layoutSlice.actions.setSelectedId(null));
                  dispatch(layoutSlice.actions.setRootId(null));
                  dispatch(layoutSlice.actions.setCenter([0, 0]));
                }}
              >
                Clear
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
