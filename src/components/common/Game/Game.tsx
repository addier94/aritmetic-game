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
  const {multiplication} = useContext(PlayerContext);
  const {initNum, result, secondNum} = multiplication;
  return (
    <div className='mt-10 text-gray font-bold text-4xl'>
      <p className='mb-8'>
        <span className='text-info2'>{`${initNum}x${secondNum}`}</span>
        <span className='mx-2'>=</span>
        <span className='text-primary3 border-b-[1px]'>{result}</span>
      </p>
      <AnswerCalc />
      <AnswerCalc />
      <AnswerCalc />
      <AnswerCalc />
      <AnswerCalc />
      <AnswerCalc />
      <AnswerCalc />
    </div>
  );
};

const AnswerCalc = () => {
  const [selected, setSelected] = useState(false);
  return (
    <div onClick={()=>setSelected(!selected)} className={`${selected ? s.answerCalcInfo : s.answerCalcGray} ${s.answerCalc}`}>
      23
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

