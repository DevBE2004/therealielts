// store/pageSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";
import { PageCommonType } from "@/components/admin/custom-page/type";

interface PageState {
  data: PageCommonType | null; // dữ liệu của page
  loading: boolean;
  error: string | null;
}

const initialState: PageState = {
  data: null,
  loading: false,
  error: null,
};

const pageSlice = createSlice({
  name: "page",
  initialState,
  reducers: {
    updatePage(state, action: PayloadAction<any>) {
      state.data = { ...state.data, ...action.payload }; // merge data
    },

    resetPage() {
      return initialState; // reset toàn bộ state
    },

    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const { updatePage, resetPage, setLoading, setError } =
  pageSlice.actions;
export default pageSlice.reducer;

// Selector (tuỳ chọn)
export const selectPage = (state: RootState) => state.page;
