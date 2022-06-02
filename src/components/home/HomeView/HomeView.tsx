import React, {FC, ReactNode} from 'react';
import s from './HomeView.module.css';
import {FaCoins, FaBitcoin} from 'react-icons/fa';
import {GiWoodBeam} from 'react-icons/gi';

const HomeView:React.FC = () => {
  return (
    <div className={s.homeView}>
      <header className='flex justify-between items-center py-1'>
        <section
        >344
        </section>
        <section className='grid grid-cols-2 gap-1'>
          <div className='flex items-center'>
            <FaCoins className='text-yellow-400 w-5 h-5 -mr-1 relative z-10 '/>
            <ProgressBars progress={{count: 2934, op: 'x'}} />
          </div>
          <div className='flex items-center'>
            <GiWoodBeam className='text-amber-900 w-5 h-5 -mr-1 relative z-10' />
            <ProgressBars progress={{count: 293, op: '-'}} />
          </div>
          <div className='flex items-center col-start-2'>
            <FaBitcoin className='text-red-600 w-5 h-5 -mr-1 relative z-10 '/>
            <ProgressBars progress={{count: 4589, op: '+'}} />
          </div>
        </section>
      </header>

      <Logout />
      {/* <FormLogin /> */}
      <section className='mt-8'>
        <NavBtn >+</NavBtn>
        <NavBtn >-</NavBtn>
        <NavBtn >x</NavBtn>
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

const NavBtn:React.FC<{children: ReactNode}> = ({children}) => {
  return (
    <button
      className={`bg-primary2 mt-2 col-span-4 border-primary3 px-4 text-white border-b-[6px] w-full hover:opacity-90 duration-150 rounded-xl font-medium py-1 text-5xl pb-2`}>
      {children}
    </button>
  );
};

const FormLogin = () => {
  return (
    <form className='mt-8 grid grid-cols-12 gap-x-1'>
      <input
        type="text"
        className='border col-span-8 rounded-xl border-primary py-1 px-3'
        placeholder='Name' />
      <button
        className={`bg-primary2 col-span-4 border-primary3 px-4 text-white border-b-[6px] w-full hover:opacity-90 duration-150 rounded-xl font-medium py-2`}
      >ENTRAR</button>
    </form>
  );
};

const Logout = () => {
  return (
    <article className='flex items-center justify-between mt-8'>
      <span className='text-gray2 uppercase'>Alfredo</span>
      <button
        className={`bg-danger2 text-danger border-danger3 w-40 ml-2 px-4 border-b-[6px] hover:opacity-90 duration-150 rounded-xl font-medium py-2`}
      >SALIR</button>
    </article>
  );
};
