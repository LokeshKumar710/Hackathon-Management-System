// actions/chatActions.js

export const SEND_MESSAGE = 'SEND_MESSAGE';
export const RECEIVE_MESSAGE = 'RECEIVE_MESSAGE';

// Action to send a message
export const sendMessage = (message) => ({
  type: SEND_MESSAGE,
  payload: message,
});

// Action to receive an AI message
export const receiveMessage = (message) => ({
  type: RECEIVE_MESSAGE,
  payload: message,
});
