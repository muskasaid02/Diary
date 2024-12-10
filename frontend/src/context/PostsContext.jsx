import { createContext, useReducer } from 'react';

export const PostsContext = createContext();

export const postsReducer = (state, action) => {
    switch (action.type) {
        case 'SET_POSTS':
            return {
                ...state,
                posts: action.payload
            };
        case 'CREATE_POST':
            return {
                posts: [action.payload, ...state.posts]
            };
        case 'DELETE_POST':
            return {
                ...state,
                posts: state.posts.filter(post => post._id !== action.payload)
            };
            case 'UPDATE_POST':
                console.log('Current posts:', state.posts);  // Debug log
                console.log('Update payload:', action.payload);  // Debug log
                const newState = {
                    ...state,
                    posts: state.posts.map(post => 
                        post._id === action.payload._id ? action.payload : post
                    )
                };
                console.log('New posts state:', newState.posts);  // Debug log
                return newState;
        default:
            //return state;
    }
};

export const PostsContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(postsReducer, {
        posts: null
    });

    return (
        <PostsContext.Provider value={{ ...state, dispatch }}>
            {children}
        </PostsContext.Provider>
    );
};