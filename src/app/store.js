import { configureStore } from "@reduxjs/toolkit";
import themeReducer from '../features/theme/themeSlice';
import sidebarReducer from '../features/sidebar/sidebarSlice';

export default configureStore({
    reducer: {
        theme: themeReducer,
        sidebar: sidebarReducer
    },
});