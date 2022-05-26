import React, {useContext, useEffect} from 'react';
import {GiCheckMark} from 'react-icons/gi';
import {MdClose} from 'react-icons/md';
import {VscChromeClose} from 'react-icons/vsc';
import s from './Game.module.css';
import {PlayerContext} from '../../../context/Player/PlayerContext';
import {random} from '../../../utils';
import {IMultiplication} from '../../../context/Player/PlayerProvider';

const Game = () => {
  const {isSuccessOrError: {result, resultStatus, title}} = useContext(PlayerContext);
  let isSuccess:boolean = false;
  if (resultStatus === 'success') {
    isSuccess = true;
  } else if (resultStatus === 'error') {
    isSuccess = false;
  }
  return (
    <div className={s.game}>
      <ProgressBar />
      <GameBody />
      {
        resultStatus !== 'empty' &&
      <CheckStatus msg={{title, result, resultStatus: isSuccess}}/>
      }
      <FooterBtn />
    </div>
  );
};

export default Game;

const ProgressBar = () => {
  const {progress} = useContext(PlayerContext);
  const {endProg, prog} = progress;
  return (
    <div className={s.progresBar}>
      <VscChromeClose className='w-8 h-8 cursor-pointer duration-300 hover:text-gray' />
      <div>
        <section style={{width: `${prog}0%`}}></section>
      </div>
      <section>{prog + '/'+ endProg}</section>
    </div>
  );
};

const GameBody = () => {
  const {multiplication, result, setResult, setNewChallenge} = useContext(PlayerContext);
  const {initNum, secondNum} = multiplication;

  const setNum = (num:number) => {
    setResult(num);
  };

  useEffect(() => {
    setNewChallenge(newChallenge());
  }, []);

  return (
    <div className='mt-10 text-gray font-bold text-4xl'>
      <p className='mb-8'>
        <span className='text-info2'>{`${initNum}x${secondNum}`}</span>
        <span className='mx-2'>=</span>
        <span className='text-primary3 border-b-[1px]'>{result}</span>
      </p>
      {
        generatePossibleSolutions(initNum, secondNum).map((item, i) => (
          <AnswerCalc key={i} current={item} result={result} setNum={setNum} />
        ))
      }
    </div>
  );
};

interface AnswerCalcProps {
  current: number
  result: number | undefined
  setNum: (num:number) => void
}
const AnswerCalc:React.FC<AnswerCalcProps> = ({current, result, setNum}) => {
  return (
    <div
      onClick={()=>setNum(current)}
      className={`${ current === result ? s.answerCalcInfo : s.answerCalcGray} ${s.answerCalc}`}>
      {current.toString()}
    </div>
  );
};

interface CheckStatusProps {
  msg: {title: string, result: string, resultStatus: boolean},
}

const CheckStatus:React.FC<CheckStatusProps> = ({msg}) => {
  const {setNewChallenge, successOrError, setResult} = useContext(PlayerContext);

  const nextChallenge = () => {
    successOrError({resultStatus: 'empty', result: '', title: ''});
    setNewChallenge(newChallenge());
    setResult(0);
  };
  const isSuccess = (type:string = 'banner') => {
    if (type === 'banner') {
      return msg.resultStatus ?
      'bg-primary text-primary2' : 'bg-danger text-danger2';
    };
    if (type === 'button') {
      return msg.resultStatus ?
      'bg-primary2 border-primary3' : 'bg-danger2 border-danger3';
    };
  };

  return (
    <>
      <div className='absolute inset-0 w-full h-full' style={{background: 'rgba(0,0,0,0.6)'}} />
      <div className={`${isSuccess()} ${s.checkStatus} relative z-50`}>
        <article className='flex'>
          <section>
            {msg.resultStatus ? <GiCheckMark className='w-7 h-7' /> : <MdClose className='w-12 h-12' />}

          </section>
          <div>
            <h4 className='text-2xl font-medium'>{msg.title}</h4>
            <p>{msg.result}</p>
          </div>
        </article>
        <button
          onClick={() => nextChallenge()}
          className={`${isSuccess('button')} mt-4 border-b-[6px]  text-white w-full hover:opacity-90 duration-150 rounded-lg py-3`}>CONTINUAR</button>
      </div>
    </>
  );
};

const FooterBtn = () => {
  const {setNewChallenge, multiplication, result, progress, successOrError, increaseProgress, setResult} = useContext(PlayerContext);

  const {initNum, secondNum} = multiplication;
  const {prog} = progress;

  const otherChallenge = () => {
    setNewChallenge(newChallenge());
    setResult(0);
  };

  const calculateMult = () => {
    if (result === 0 ) return;
    if ((initNum * secondNum) === result) {
      let progress = 0;
      prog < 10 ? progress = prog + 1 : progress = prog;
      increaseProgress({prog: progress, endProg: 10});
      successOrError({title: 'Bien hecho', result: result.toString() + ' es correcto', resultStatus: 'success'});
    } else {
      successOrError(
          {title: 'Error',
            result: `El resultado era: ${(initNum * secondNum).toString()} `,
            resultStatus: 'error'});
    }
  };

  return (
    <div className='flex mt-12'>
      <button
        onClick={() => otherChallenge()}
        className={`border-2 text-gray2 mr-6 border-b-[6px] w-full hover:opacity-90 duration-150 rounded-3xl py-2 hover:bg-gray2 hover:text-gray font-bold`}
      >SALTAR</button>

      <button
        onClick={() => calculateMult()}
        className={`${result > 0 ? 'bg-primary2 border-primary3 text-white' : 'bg-gray3 border-gray3 text-gray2 cursor-not-allowed border-none py-[19px]'} border-b-[6px] w-full hover:opacity-90 duration-150 rounded-3xl font-bold py-4`}
      >CONTINUAR</button>
    </div>
  );
};


const generatePossibleSolutions = (init:number, end:number):number[] => {
  const initArr:number[] = [];
  const endArr:number[] = [];
  const result:number[] = [];

  initArr.push(init-1, init, init+1);
  endArr.push(end-1, end+1);

  for (const item of initArr) {
    result.push(item * end);
  }

  for (const item of endArr) {
    result.push(item * init);
  }

  return result;
};


const newChallenge = ():IMultiplication => {
  return {
    initNum: random.randomIntFromInterval(2, 9),
    secondNum: random.randomIntFromInterval(2, 10),
    result: 0,
  };
};
