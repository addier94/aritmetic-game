import React, {FC, ReactNode, useEffect, useState} from 'react';
import s from './HomeView.module.css';
import {FaCoins, FaBitcoin} from 'react-icons/fa';
import {GiWoodBeam} from 'react-icons/gi';
import {useNavigate} from 'react-router-dom';

const HomeView:React.FC = () => {
  const [user, setUser] = useState<IUserData | null>();

  useEffect(() => {
    setUser(isLogin());
  }, []);

  const outUser = (userName:string) => {
    logout(userName);
    setUser(null);
  };
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

      {user ? <Logout user={user} cb={outUser} /> : <FormLogin /> }


      <section className='mt-8'>
        <NavBtn goTo='/player/sum'>+</NavBtn>
        <NavBtn goTo='/player/rest'>-</NavBtn>
        <NavBtn goTo='/player/multi'>x</NavBtn>
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
}
const NavBtn:FC<NavBtnProps> = ({children, goTo}) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(goTo)}
      className={`bg-primary2 mt-2 col-span-4 border-primary3 px-4 text-white border-b-[6px] w-full hover:opacity-90 duration-150 rounded-xl font-medium py-1 text-5xl pb-2`}>
      {children}
    </button>
  );
};

const FormLogin = () => {
  const [userName, setUserName] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isValidName = isVAlidUserName(userName);

    if (!isValidName) {
      setErrorMsg('Por Favor su nombre debe ser mayor a 3 caracter');
    } else {
      setUser(isValidName);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='mt-8 grid grid-cols-12 gap-x-1'>
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
  );
};

const Logout:FC<{user: IUserData, cb: (name:string) => void}> = ({user, cb}) => {
  return (
    <article className='flex items-center justify-between mt-8'>
      <span className='text-gray2 uppercase'>{user.name}</span>
      <button
        onClick={() => cb(user.name)}
        className={`bg-danger2 text-danger border-danger3 w-40 ml-2 px-4 border-b-[6px] hover:opacity-90 duration-150 rounded-xl font-medium py-2`}
      >SALIR</button>
    </article>
  );
};

interface IUserData {
  isActive: boolean
  sum: number
  rest: number
  multi: number
  level: number
  name: string
}


const stateUserData = {
  isActive: false,
  sum: 0,
  rest: 0,
  multi: 0,
  level: 0,
  name: '',
};


const logout = (userName:string) => {
  let userData:any = localStorage.getItem('user');
  userData = userData ? JSON.parse(userData) : null;

  if (!userData) return null;

  const user = userData.find((item: IUserData) => item.name = userName);

  if (!user) return null;

  const newUserData:IUserData[] = userData.filter((item:IUserData) => item.name !== userName);


  newUserData.push({...user, isActive: false});
  localStorage.setItem('user', JSON.stringify(newUserData));
};

const isLogin = ():IUserData | null => {
  let userData:any = localStorage.getItem('user');
  userData = userData ? JSON.parse(userData) : null;

  if (!userData) return userData;

  userData = userData.find((item:IUserData) => item.isActive === true);

  return userData as IUserData;
};

const setUser = (userName: string):IUserData => {
  let userData:IUserData[] = [];

  let allUsers:any = localStorage.getItem('user');
  // if array of users exist make parser of strings OR null
  allUsers = allUsers ? JSON.parse(allUsers) : null;

  if (allUsers) {
    // find if user exist
    userData = allUsers;
    let foundUser = allUsers.find((item:IUserData) => item.name === userName);
    foundUser = foundUser ? {...foundUser, isActive: true} : undefined;

    if (!foundUser) {
      // create new user
      foundUser = {...stateUserData, name: userName, isActive: true};
      userData.push(foundUser);
      localStorage.setItem('user', JSON.stringify(userData));
    }
  }

  if (!localStorage.getItem('user')) {
    userData = localStorage.setItem('user', JSON.stringify([{...stateUserData, name: userName, isActive: true}]));
  }

  return userData as IUserData;
};

const isVAlidUserName = (name:string):string | undefined => {
  const userName = name.trim().toUpperCase();

  return userName.length < 3 ? undefined : userName;
};
