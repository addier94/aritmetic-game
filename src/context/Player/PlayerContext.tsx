import {createContext} from 'react';
import {PlayerState} from './PlayerProvider';

interface ContextProps extends PlayerState {
  // progress?: number
  // endProgress: number
  // initialNum: number
  // secondNum: number
  // result: number
  // answerStatus?: AnswerStatus

  // methods
}

export const PlayerContext = createContext({} as ContextProps);
