import { configureStore } from '@reduxjs/toolkit';
import projectReducer from './projectSlice';
import skillReducer from './skillSlice';
import messageReducer from './messageSlice';
import experienceReducer from './experienceSlice'; 
import bioReducer from './bioSlice';               
export const store = configureStore({
    reducer: {
        projects: projectReducer,
        skills: skillReducer,
        messages: messageReducer,
        experiences: experienceReducer,           
        bio: bioReducer                            
    },
});

export default store;