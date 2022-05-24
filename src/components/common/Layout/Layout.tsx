import React from 'react';

const Layout:React.FC<{children:React.ReactNode}> = ({children}) => {
  return (
    <div className='h-screen bg-black'>
      {children}
    </div>
  );
};

export default Layout;
