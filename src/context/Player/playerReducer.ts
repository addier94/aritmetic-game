import {PlayerState} from '.';
import {IMultiplication} from './PlayerProvider';


type PlayerActionType =
  | {type: '[Player] - Set Random Multiplication', payload: IMultiplication}

// always return state, can't be mutate something like( state.modal = true)
export const playerReducer = (state: PlayerState, action: PlayerActionType):PlayerState => {
  switch (action.type) {
    case '[Player] - Set Random Multiplication':
      return {
        ...state,
        multiplication: action.payload,
      };

    default:
      return state;
  }
};
