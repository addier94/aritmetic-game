import {createContext} from 'react';
import {PlayerState, IMultiplication, IProgress, ISuccessOrError} from './PlayerProvider';

interface ContextProps extends PlayerState {
  // progress?: number
  // endProgress: number
  // initialNum: number
  // secondNum: number
  // result: number
  // answerStatus?: AnswerStatus

  // methods
  setNewChallenge: (multi: IMultiplication) => void
  setResult: (result: number) => void
  increaseProgress: (progress: IProgress) => void
  successOrError: (state: ISuccessOrError) => void
}

export const PlayerContext = createContext({} as ContextProps);
