import { createAction } from '@reduxjs/toolkit'

// Dispatched by the reset button; each slice resets itself to
// initialState via `extraReducers`.
export const appReset = createAction('app/reset')
