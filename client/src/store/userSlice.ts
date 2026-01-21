// store/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '.'

interface UserState {
  isLogin: boolean
  current?: any
   loading: boolean 
}

const initialState: UserState = {
  isLogin: false,
  current: null,
  loading: false, 
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLogin(state, action: PayloadAction<{ isLogin: boolean }>) {
      state.isLogin = action.payload.isLogin
    },
    setCurrent(state, action: PayloadAction<{ current: any }>) {
      state.current = action.payload.current
       state.loading = false
    },
    setLogout(state) {
      state.isLogin = false
      state.current = null
       state.loading = false 
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload
    },
  },
})

export const { setLogin, setLogout, setCurrent, setLoading  } = userSlice.actions
export default userSlice.reducer
