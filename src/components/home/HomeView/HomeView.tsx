import React, {Dispatch, FC, ReactNode, SetStateAction, useEffect, useState} from 'react';
import s from './HomeView.module.css';
import {FaCoins, FaBitcoin} from 'react-icons/fa';
import {GiWoodBeam} from 'react-icons/gi';
import {useNavigate} from 'react-router-dom';
import {IUserData} from '../../../utils/interfaces';
import {isLogin, setUser, isValidUserName, logout} from '../../../utils/user';

export const stateUserData:IUserData = {
  isActive: false,
  sum: 0,
  rest: 0,
  multi: 0,
  level: 0,
  name: '',
};

const HomeView = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<IUserData>({...stateUserData});
  const {isActive, level, multi, name, rest, sum} = userData;

  useEffect(() => {
    setUserData(isLogin());
  }, []);

  const outUser = (userName:string) => {
    logout(userName);
    setUserData({...stateUserData});
  };

  const canGo = (goTo:string) => {
    if (!isActive) return;
    navigate(goTo);
  };
  return (
    <div className={s.homeView}>
      <header className='flex justify-between items-center py-1'>
        <section
        >{level}
        </section>
        <section className='grid grid-cols-2 gap-1'>
          <div className='flex items-center'>
            <FaCoins className='text-yellow-400 w-5 h-5 -mr-1 relative z-10 '/>
            <ProgressBars progress={{count: multi, op: 'x'}} />
          </div>
          <div className='flex items-center'>
            <GiWoodBeam className='text-amber-900 w-5 h-5 -mr-1 relative z-10' />
            <ProgressBars progress={{count: rest, op: '-'}} />
          </div>
          <div className='flex items-center col-start-2'>
            <FaBitcoin className='text-red-600 w-5 h-5 -mr-1 relative z-10 '/>
            <ProgressBars progress={{count: sum, op: '+'}} />
          </div>
        </section>
      </header>

      {isActive ? <Logout userName={name} cb={outUser} /> : <FormLogin setUserData={setUserData} /> }

      <section className='mt-8'>
        {!isActive &&
      <p className='text-sm mx-2 text-red-700'>Por favor añade tu nombre para continuar</p>
        }
        <NavBtn goTo='/player/sum' canGo={canGo}>+</NavBtn>
        <NavBtn goTo='/player/rest' canGo={canGo}>-</NavBtn>
        <NavBtn goTo='/player/multi' canGo={canGo}>x</NavBtn>
      </section>
    </div>
  );
};

export default HomeView;

interface ProgressBarsProps {
  progress: {count: number, op: string}
}
const ProgressBars:FC<ProgressBarsProps> = ({progress}) => {
  return (
    <article
    >
      <div
        className='absolute top-0 left-0 bg-yellow-400 h-full'
        style={{width: `${progress.count / 100}%`}}>
      </div>
      <span className='absolute inset-0 leading-[12px]'>{progress.count + progress.op}</span>
    </article>
  );
};

interface NavBtnProps {
  children: ReactNode
  goTo: string
  canGo: (goTo: string) => void
}
const NavBtn:FC<NavBtnProps> = ({children, goTo, canGo}) => {
  return (
    <button
      onClick={() => canGo(goTo)}
      className={`bg-primary2 mt-2 col-span-4 border-primary3 px-4 text-white border-b-[6px] w-full hover:opacity-90 duration-150 rounded-xl font-medium py-1 text-5xl pb-2`}>
      {children}
    </button>
  );
};

const FormLogin:FC<{setUserData: Dispatch<SetStateAction<IUserData>>}> = ({setUserData}) => {
  const [userName, setUserName] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState('');


  const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isValidName = isValidUserName(userName);

    if (isValidName.length > 0) {
      setErrorMsg(isValidName[0]);
    } else {
      setUserData(setUser(userName.trim().toUpperCase()));
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className='mt-16 grid grid-cols-12 gap-x-1'>
        <input
          type="text"
          className='border col-span-8 rounded-xl border-primary py-1 px-3'
          placeholder='Name'
          onChange={(event) => setUserName(event.target.value)}
        />
        <button
          className={`bg-primary2 col-span-4 border-primary3 px-4 text-white border-b-[6px] w-full hover:opacity-90 duration-150 rounded-xl font-medium py-2`}
        >ENTRAR</button>
      </form>
      <p className='text-sm text-red-700 '>{errorMsg}</p>
    </>
  );
};

const Logout:FC<{userName: string, cb: (name:string) => void}> = ({userName, cb}) => {
  return (
    <article className='flex items-center justify-between mt-8'>
      <span className='text-gray2 uppercase'>{userName}</span>
      <button
        onClick={() => cb(userName)}
        className={`bg-danger2 text-danger border-danger3 w-40 ml-2 px-4 border-b-[6px] hover:opacity-90 duration-150 rounded-xl font-medium py-2`}
      >SALIR</button>
    </article>
  );
};


