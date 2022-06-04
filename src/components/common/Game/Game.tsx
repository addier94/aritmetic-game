import React, {FC, useContext, useEffect, useState} from 'react';
import {GiCheckMark} from 'react-icons/gi';
import {MdClose} from 'react-icons/md';
import {VscChromeClose} from 'react-icons/vsc';
import s from './Game.module.css';
import {PlayerContext} from '../../../context/Player/PlayerContext';
import {random} from '../../../utils';
import {IMultiplication} from '../../../context/Player/PlayerProvider';
import {useNavigate, useParams} from 'react-router-dom';
import {TiEquals} from 'react-icons/ti';
import {TiPlus} from 'react-icons/ti';
import {TiMinus} from 'react-icons/ti';

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
  const {progress} = useContext(PlayerContext);
  const {endProg, prog} = progress;
  return (
    <div className={s.progresBar}>
      <VscChromeClose
        onClick={() => navigate('/')}
        className='w-8 h-8 cursor-pointer duration-300 hover:text-gray' />
      <div>
        <section style={{width: `${prog}0%`}}></section>
      </div>
      <section>{prog + '/'+ endProg}</section>
    </div>
  );
};

const GameBody:FC<{op:string}> = ({op}) => {
  const [solutions, setSolutions] = useState<number[]>();
  const {multiplication, result, setResult, setNewChallenge} = useContext(PlayerContext);
  const {initNum, secondNum} = multiplication;

  const setNum = (num:number) => {
    setResult(num);
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
  const {setNewChallenge, successOrError, setResult} = useContext(PlayerContext);

  const nextChallenge = () => {
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
        })
        .catch((item) => {
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

const answerItWas = (initNum:number, secondNum:number, op:string):number => {
  let itWas:number = 0;
  if (op === 'sum') itWas = initNum + secondNum;
  if (op === 'rest') itWas = initNum - secondNum;
  if (op === 'multi') itWas = initNum * secondNum;
  return itWas;
};

const calculateAnswer = (result:number, initNum:number, secondNum:number, prog:number, op:string):Promise<number> => new Promise((resolve, reject) => {
  let progress:number = 0;

  if ( (initNum * secondNum) === result && op === 'multi') {
    prog < 10 ? progress = prog + 1 : progress = prog;
    resolve(progress);
  }
  if ( (initNum - secondNum) === result && op === 'rest') {
    prog < 10 ? progress = prog + 1 : progress = prog;
    resolve(progress);
  }
  if ((initNum + secondNum) === result && op === 'sum') {
    prog < 10 ? progress = prog + 1 : progress = prog;
    resolve(progress);
  }
  reject(progress);
});


const generatePossibleSolutions = (init:number, end:number, op:string):number[] => {
  console.log(init, end, op);
  if (op === 'multi') return possibleAnswersMulti(init, end);
  if (op === 'sum') return answersSumOrRest(init, end, op);
  return answersSumOrRest(init, end, op);
};

const possibleAnswersMulti = (init:number, end:number):number[] => {
  const arr:number[] = [init * end, (init - 1) * end, (init + 1) * end, (end-1) * init, (end+1) * init];

  const result:number[] = [];

  for (let i = 0; i<5; i++) {
    const numRandom = random.randomIntFromInterval(0, (arr.length - 1));

    result.push(arr[numRandom]);
    arr.splice(numRandom, 1);
  }

  return result;
};


const answersSumOrRest = (init:number, end:number, op:string):number[] => {
  const result:number[] = [];
  let res:number = 0;

  if (op === 'sum') res = init + end;
  if (op === 'rest') res = init - end;

  const randomInit = res - 2; // range of number generate between randomEnd
  const randomEnd = res + 2;

  let i:number = 0;

  do {
    const numRandom = random.randomIntFromInterval(randomInit, randomEnd);

    i = result.length;

    if (!result.includes(numRandom)) result.push(numRandom);
  } while (i < 5);

  return result;
};


const newChallenge = (op:string):IMultiplication => {
  if (op === 'multi') return generateNewMulti();
  if (op === 'sum') return generateNewSum();
  return generateNewRest();
};

const generateNewMulti = () => {
  return {
    initNum: random.randomIntFromInterval(2, 9),
    secondNum: random.randomIntFromInterval(2, 10),
    result: 0,
  };
};

const generateNewRest = () => {
  const initNum = random.randomIntFromInterval(3, 19);
  let secondNum = random.randomIntFromInterval(3, 19);

  do {
    secondNum -=2;
  }
  while (secondNum >= initNum);

  return {initNum, secondNum, result: 0};
};
const generateNewSum = () => {
  return {
    initNum: random.randomIntFromInterval(2, 20),
    secondNum: random.randomIntFromInterval(2, 20),
    result: 0,
  };
};
