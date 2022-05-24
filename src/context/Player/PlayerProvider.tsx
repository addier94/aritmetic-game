import React, {FC, useEffect, useReducer} from 'react';

import {PlayerContext, playerReducer} from '.';
import {random} from '../../utils';

type Progress = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

interface IProgress {
  prog: Progress,
  endProg: number
}

export interface IMultiplication {
  initNum: number
  secondNum: number
  result: number
}

export interface PlayerState {
  progress: IProgress
  isSuccessOrError?: boolean
  multiplication: IMultiplication
}

const PLAYER_INITIAL_STATE: PlayerState = {
  progress: {prog: 0, endProg: 10},
  isSuccessOrError: undefined,
  multiplication: {} as IMultiplication,
};

export const PlayerProvider:FC<{children: React.ReactNode}> = ({children}) => {
  const [state, dispatch] = useReducer(playerReducer, PLAYER_INITIAL_STATE);

  // const setGame = (game:IMultiplication) => {
  //   dispatch({type: '[Player] - Set New Challenge', payload: game});
  // };

  useEffect(() => {
    dispatch({type: '[Player] - Set Random Multiplication',
      payload: {
        initNum: random.randomIntFromInterval(2, 9),
        secondNum: random.randomIntFromInterval(2, 10),
        result: 0,
      },
    });
  }, []);

  return (
    <PlayerContext.Provider value={{
      ...state,

      // methods
    }}>
      {children}
    </PlayerContext.Provider>
  );
};
