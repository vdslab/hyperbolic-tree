import { createSlice } from "@reduxjs/toolkit";

export const layoutSlice = createSlice({
  name: "layout",
  initialState: {
    data: null,
    logBase: 2,
    distanceScale: 100,
    radiusMin: 0.1,
    radiusMax: 0.3,
    displayThreshold: 0.9,
    center: [0, 0],
  },
  reducers: {
    setData: (state, action) => {
      state.data = action.payload;
    },
    setLogBase: (state, action) => {
      state.logBase = action.payload;
    },
    setDistanceScale: (state, action) => {
      state.distanceScale = action.payload;
    },
    setRadiusMin: (state, action) => {
      state.radiusMin = action.payload;
    },
    setRadiusMax: (state, action) => {
      state.radiusMax = action.payload;
    },
    setDisplayThreshold: (state, action) => {
      state.displayThreshold = action.payload;
    },
    setCenter: (state, action) => {
      state.center = action.payload;
    },
  },
});

export default layoutSlice.reducer;
