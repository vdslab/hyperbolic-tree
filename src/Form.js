import { useDispatch, useSelector } from "react-redux";
import { layoutSlice } from "./store/layoutSlice";

export default function Form() {
  const dispatch = useDispatch();
  const distanceScale = useSelector((state) => state.layout.distanceScale);
  const logBase = useSelector((state) => state.layout.logBase);
  const radiusMin = useSelector((state) => state.layout.radiusMin);
  const radiusMax = useSelector((state) => state.layout.radiusMax);
  const displayThreshold = useSelector(
    (state) => state.layout.displayThreshold,
  );
  return (
    <div className="box has-background-grey-light">
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
          <label className="label">distance scale</label>
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
          <label className="label">log base</label>
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
          <label className="label">radius min</label>
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
          <label className="label">radius max</label>
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
          <label className="label">display threshold</label>
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
  );
}
