import React, {useContext, useState} from 'react';
import {GiCheckMark} from 'react-icons/gi';
import {MdClose} from 'react-icons/md';
import {VscChromeClose} from 'react-icons/vsc';
import s from './Game.module.css';
import {PlayerContext} from '../../../context/Player/PlayerContext';

const Game = () => {
  const {isSuccessOrError} = useContext(PlayerContext);

  return (
    <div className={s.game}>
      <ProgressBar />
      <GameBody />
      {
        isSuccessOrError &&
      <CheckStatus msg={{title: 'Bien hecho', result: '23', resultStatus: true}}/>
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
  const [currentNum, setCurrentNum] = useState<number | undefined>(undefined);

  const {multiplication} = useContext(PlayerContext);
  const {initNum, result, secondNum} = multiplication;

  const setNum = (num:number) => {
    setCurrentNum(num);
    if ((initNum * secondNum) === num) { // Answer of Multiplication is correct

    }
  };


  return (
    <div className='mt-10 text-gray font-bold text-4xl'>
      <p className='mb-8'>
        <span className='text-info2'>{`${initNum}x${secondNum}`}</span>
        <span className='mx-2'>=</span>
        <span className='text-primary3 border-b-[1px]'>{currentNum}</span>
      </p>
      {
        generatePossibleSolutions(initNum, secondNum).map((item, i) => (
          <AnswerCalc key={i} result={item} currentNum={currentNum} setNum={setNum} />
        ))
      }
    </div>
  );
};

interface AnswerCalcProps {
  result: number
  currentNum: number | undefined
  setNum: (num:number) => void
}
const AnswerCalc:React.FC<AnswerCalcProps> = ({result, currentNum, setNum}) => {
  return (
    <div
      onClick={()=>setNum(result)}
      className={`${ result === currentNum ? s.answerCalcInfo : s.answerCalcGray} ${s.answerCalc}`}>
      {result.toString()}
    </div>
  );
};

interface CheckStatusProps {
  msg: {title: string, result: string, resultStatus: boolean},
}

const CheckStatus:React.FC<CheckStatusProps> = ({msg}) => {
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
      <div className={`${isSuccess()} ${s.checkStatus}`}>
        <article className='flex'>
          <section>
            {msg.resultStatus ? <GiCheckMark className='w-7 h-7' /> : <MdClose className='w-12 h-12' />}

          </section>
          <div>
            <h4 className='text-2xl font-medium'>Bien hecho!</h4>
            <p>El resultado 28 es correcto</p>
          </div>
        </article>
        <button className={`${isSuccess('button')} mt-4 border-b-[6px]  text-white w-full hover:opacity-90 duration-150 rounded-lg py-3`}>CONTINUAR</button>
      </div>
    </>
  );
};

const FooterBtn = () => {
  const [test, setTest] = useState(false);

  return (
    <div className='flex mt-12'>
      <button
        className={`border-2 text-gray2 mr-6 border-b-[6px] w-full hover:opacity-90 duration-150 rounded-3xl py-2 hover:bg-gray2 hover:text-gray font-bold`}
      >SALTAR</button>

      <button
        className={`${test ? 'bg-primary2 border-primary3 text-white' : 'bg-gray3 border-gray3 text-gray2 cursor-not-allowed border-none py-[19px]'} border-b-[6px] w-full hover:opacity-90 duration-150 rounded-3xl font-bold py-4`}
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
