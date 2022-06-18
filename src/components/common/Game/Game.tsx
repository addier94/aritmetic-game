import React, {FC, useContext, useEffect, useState} from 'react';
import {GiCheckMark} from 'react-icons/gi';
import {MdClose} from 'react-icons/md';
import {VscChromeClose} from 'react-icons/vsc';
import s from './Game.module.css';
import {PlayerContext} from '../../../context/Player/PlayerContext';
import {useNavigate, useParams} from 'react-router-dom';
import {TiEquals} from 'react-icons/ti';
import {TiPlus} from 'react-icons/ti';
import {TiMinus} from 'react-icons/ti';
import {answerItWas, calculateAnswer, generatePossibleSolutions, incrementUserLevel, newChallenge} from '../../../utils/player';
import useSound from 'use-sound';
// @ts-ignore
import btnsound from '../../../btnsound.wav';
// @ts-ignore
import successsound from '../../../success.wav';
// @ts-ignore
import errorsound from '../../../error.wav';
// @ts-ignore
import successful from '../../../successful.mp3';

const Game = () => {
  const navigate = useNavigate();
  const {isSuccessOrError: {result, resultStatus, title}} = useContext(PlayerContext);

  const {op='anything'} = useParams();

  useEffect(() => {
    const allOp = ['sum', 'rest', 'multi'].includes(op);
    if (!allOp) navigate('/');
  }, []);

  let isSuccess:boolean = false;
  if (resultStatus === 'success') {
    isSuccess = true;
  } else if (resultStatus === 'error') {
    isSuccess = false;
  }
  return (
    <div className={s.game}>
      <ProgressBar />
      <GameBody op={op} />
      {
        resultStatus !== 'empty' &&
      <CheckStatus msg={{title, result, resultStatus: isSuccess, op}}/>
      }
      <FooterBtn op={op} />
    </div>
  );
};

export default Game;

const ProgressBar = () => {
  const navigate = useNavigate();
  const {progress, clearAll} = useContext(PlayerContext);
  const {endProg, prog} = progress;

  const goBackAndReset = () => {
    clearAll();
    navigate('/');
  };
  return (
    <div className={s.progresBar}>
      <VscChromeClose
        onClick={() => goBackAndReset()}
        className='w-8 h-8 cursor-pointer duration-300 hover:text-gray' />
      <div>
        <section style={{width: `${prog}0%`}}></section>
      </div>
      <section>{prog + '/'+ endProg}</section>
    </div>
  );
};

const GameBody:FC<{op:string}> = ({op}) => {
  const [playSoundOnClick] = useSound(btnsound);
  const [solutions, setSolutions] = useState<number[]>();
  const {multiplication, result, setResult, setNewChallenge} = useContext(PlayerContext);
  const {initNum, secondNum} = multiplication;

  const setNum = (num:number) => {
    setResult(num);
    playSoundOnClick();
  };

  useEffect(() => {
    setNewChallenge(newChallenge(op));
  }, []);
  useEffect(() => {
    if (initNum) {
      setSolutions(generatePossibleSolutions(initNum, secondNum, op));
    }
  }, [initNum]);

  return (
    <div className='mt-10 text-gray font-bold'>
      <p className='mb-8 text-7xl flex justify-center'>
        <span className='text-info2'>{initNum}</span>
        {op === 'multi' && <TiPlus className='rotate-45' />}
        {op === 'rest' && <TiMinus />}
        {op === 'sum' && <TiPlus />}
        <span className='text-info2'>{secondNum}</span>
        <TiEquals />
        <span className='text-primary3 border-b-[1px]'>{result}</span>
      </p>
      {
        solutions &&
        solutions.map((item, i) => (
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
  msg: {title: string, result: string, resultStatus: boolean, op:string},
}

const CheckStatus:React.FC<CheckStatusProps> = ({msg}) => {
  const [playSoundSuccessful] = useSound(successful);
  const navigate = useNavigate();
  const {setNewChallenge, successOrError, setResult, progress: {prog}, clearAll} = useContext(PlayerContext);


  const nextChallenge = () => {
    if (prog === 10) {
      clearAll();
      incrementUserLevel(msg.op);
      playSoundSuccessful();
      navigate('/');
    }
    successOrError({resultStatus: 'empty', result: '', title: ''});
    setNewChallenge(newChallenge(msg.op));
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

const FooterBtn:FC<{op:string}> = ({op}) => {
  const [playSoundSuccess] = useSound(successsound);
  const [playSoundError] = useSound(errorsound);

  const {setNewChallenge, multiplication, result, progress, successOrError, increaseProgress, setResult} = useContext(PlayerContext);

  const {initNum, secondNum} = multiplication;
  const {prog} = progress;

  const otherChallenge = () => {
    setNewChallenge(newChallenge(op));
    setResult(0);
  };

  const calculateMult = () => {
    if (result === 0 ) return;

    calculateAnswer(result, initNum, secondNum, prog, op)
        .then((item) => {
          increaseProgress({prog: item, endProg: 10});
          successOrError({title: 'Bien hecho', result: result.toString() + ' es correcto', resultStatus: 'success'});
          playSoundSuccess();
        })
        .catch((item) => {
          playSoundError();
          successOrError(
              {title: 'Error',
                result: `El resultado era: ${answerItWas(initNum, secondNum, op).toString()} `,
                resultStatus: 'error'});
        });
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


