import { createSlice } from "@reduxjs/toolkit";

export const layoutSlice = createSlice({
  name: "layout",
  initialState: {
    data: null,
    layoutMethod: "bottomup",
    logBase: 10,
    distanceScale: 100,
    radiusMin: 0.3,
    radiusMax: 0.9,
    displayThreshold: 0.9,
    center: [0, 0],
    selectedId: null,
    rootId: null,
  },
  reducers: {
    setData: (state, action) => {
      state.data = action.payload;
    },
    setLayoutMethod: (state, action) => {
      state.layoutMethod = action.payload;
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
    setSelectedId: (state, action) => {
      state.selectedId = action.payload;
    },
    setRootId: (state, action) => {
      state.rootId = action.payload;
    },
  },
});

export default layoutSlice.reducer;
