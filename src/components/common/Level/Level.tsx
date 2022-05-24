import React from 'react';

const Level = () => {
  return (
    <article className='text-white px-4 lg:mx-20 flex justify-between py-6 items-center'>
      <section>Level <span className='bg-pink-400 px-2 py-px rounded-sm ml-2'>4/10</span></section>
      <button className='bg-pink-600 px-4 py-px rounded-md border-b-[3px] border-pink-900 hover:opacity-90 duration-150'>Finish</button>
    </article>
  );
};
export default Level;
