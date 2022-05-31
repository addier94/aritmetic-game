import React from 'react';
import s from './HomeView.module.css';
import {FaCoins} from 'react-icons/fa';
import {BiErrorAlt} from 'react-icons/bi';
import {GiWoodBeam} from 'react-icons/gi';

const HomeView:React.FC = () => {
  return (
    <div className={s.homeView}>
      <header className='flex justify-between items-center px-3 py-1 lg:mx-16'>
        <section
        >344
        </section>
        <section className='grid grid-cols-2 gap-1'>
          <div className='flex items-center'>
            <FaCoins className='text-yellow-400 w-5 h-5 -mr-1 relative z-10 '/>
            <ProgressBars />
          </div>
          <div className='flex items-center'>
            <GiWoodBeam className='text-amber-900 w-5 h-5 -mr-1 relative z-10' />
            <ProgressBars />
          </div>
          <div className='flex items-center col-start-2'>
            <BiErrorAlt className='text-red-600 w-5 h-5 -mr-1 relative z-10 '/>
            <ProgressBars />
          </div>
        </section>
      </header>
    </div>
  );
};

export default HomeView;

const ProgressBars = () => {
  return (
    <article
    >
      <div
        className='absolute top-0 left-0 bg-yellow-400 h-full'
        style={{width: '40%'}}>
      </div>
      <span className='absolute inset-0 leading-[12px]'>2838</span>
    </article>
  );
};
