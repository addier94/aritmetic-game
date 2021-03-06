import React, {FC, useCallback, useMemo, useReducer} from 'react';

import {PlayerContext, playerReducer} from '.';

export interface IProgress {
  prog: number,
  endProg?: number
}

export interface IMultiplication {
  initNum: number
  secondNum: number
  result: number
}
export interface ISuccessOrError {
  title: string,
  result: string,
  resultStatus: 'success' | 'error' | 'empty'
}

export interface PlayerState {
  progress: IProgress
  isSuccessOrError: ISuccessOrError
  multiplication: IMultiplication
  result: number
}

const PLAYER_INITIAL_STATE: PlayerState = {
  progress: {prog: 0, endProg: 10},
  isSuccessOrError: {title: '', result: '', resultStatus: 'empty'},
  multiplication: {} as IMultiplication,
  result: 0,
};

export const PlayerProvider:FC<{children: React.ReactNode}> = ({children}) => {
  const [state, dispatch] = useReducer(playerReducer, PLAYER_INITIAL_STATE);
  const setNewChallenge = (multi:IMultiplication) => {
    dispatch({type: '[Player] - Set Random Multiplication', payload: multi});
  };

  const setResult = (result:number) => {
    dispatch({type: '[Player] - Set Result', payload: result});
  };

  const increaseProgress = useCallback(
      (progress: IProgress) => dispatch({type: '[Player] - Icrease Progress', payload: progress}), [dispatch, state.progress],
  );

  const successOrError = (state: ISuccessOrError) => {
    dispatch({type: '[Player] - Set Success Or Error', payload: state});
  };
  const clearAll = () => {
    dispatch({type: '[Player] - Clear all State', payload: PLAYER_INITIAL_STATE});
  };

  const value = useMemo(
      () => ({
        ...state,
        // methods
        setNewChallenge,
        setResult,
        increaseProgress,
        successOrError,
        clearAll,
      }),
      [state],
  );

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
};
