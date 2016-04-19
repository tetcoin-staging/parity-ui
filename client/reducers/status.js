
import { handleActions } from 'redux-actions';

const initialState = {
  error: false,
  noOfErrors: 0,
  name: 'My node',
  bestBlock: 'loading...',
  hashrate: 'loading...',
  peers: 0,
  version: 'Parity//v1.1.0-unstable-393099e-20160322/x86_64-linux-gnu/rustc1.8.0-beta.1'
};

export default handleActions({
  error (state, action) {
    return {
      ...state,
      error: action.payload.toString(),
      noOfErrors: state.noOfErrors + 1
    };
  },

  'update blockNumber' (state, action) {
    return {
      ...resetError(state),
      bestBlock: `${action.payload}`
    };
  },

  'update hashrate' (state, action) {
    return {
      ...resetError(state),
      hashrate: `${action.payload}`
    };
  },

  'update peerCount' (state, action) {
    return {
      ...state,
      peers: action.payload
    };
  },

  'update version' (state, action) {
    return {
      ...resetError(state),
      version: action.payload
    };
  }
}, initialState);

function resetError (state) {
  return {
    ...state,
    error: false,
    noOfErrors: 0
  };
}
