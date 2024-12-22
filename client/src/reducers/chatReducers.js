// reducers/chatReducer.js
const initialState = {
    chatHistory: [], // Ensuring chatHistory starts as an empty array
  };
  
  const chatReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SEND_MESSAGE':
        return {
          ...state,
          chatHistory: [...state.chatHistory, { type: 'user', content: action.payload }],
        };
      case 'RECEIVE_MESSAGE':
        return {
          ...state,
          chatHistory: [...state.chatHistory, { type: 'answer', content: action.payload }],
        };
      default:
        return state;
    }
  };
  
  export { chatReducer };
  