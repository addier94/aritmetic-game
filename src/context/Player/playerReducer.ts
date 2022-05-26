import {PlayerState} from '.';
import {IMultiplication, IProgress, ISuccessOrError} from './PlayerProvider';


type PlayerActionType =
  | {type: '[Player] - Set Random Multiplication', payload: IMultiplication}
  | {type: '[Player] - Set Result', payload:number}
  | {type: '[Player] - Icrease Progress', payload:IProgress}
  | {type: '[Player] - Set Success Or Error', payload: ISuccessOrError}

// always return state, can't be mutate something like( state.modal = true)
export const playerReducer = (state: PlayerState, action: PlayerActionType):PlayerState => {
  switch (action.type) {
    case '[Player] - Set Random Multiplication':
      return {
        ...state,
        multiplication: action.payload,
      };

    case '[Player] - Set Result':
      return {
        ...state,
        result: action.payload,
      };

    case '[Player] - Icrease Progress':
      return {
        ...state,
        progress: action.payload,
      };

    case '[Player] - Set Success Or Error':
      return {
        ...state,
        isSuccessOrError: action.payload,
      };

    default:
      return state;
  }
};
