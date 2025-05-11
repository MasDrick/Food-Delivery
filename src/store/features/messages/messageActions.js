import { v4 as uuidv4 } from 'uuid';
import { addMessage, removeMessage } from './messageSlice';

let dispatchFn = null;

export const setDispatch = (dispatch) => {
  dispatchFn = dispatch;
};

export const showMessage = (content, type = 'info', duration = 3000, onClose = null) => {
  if (!dispatchFn) {
    console.error('Dispatch function not set. Call setDispatch first.');
    return;
  }
  
  const id = uuidv4();
  dispatchFn(addMessage({ id, content, type, duration, onClose }));
  return id;
};

export const hideMessage = (id) => {
  if (!dispatchFn) {
    console.error('Dispatch function not set. Call setDispatch first.');
    return;
  }
  
  dispatchFn(removeMessage(id));
};
