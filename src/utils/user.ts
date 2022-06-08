import {stateUserData} from '../components/home/HomeView/HomeView';
import {IUserData} from './interfaces';

export const logout = (userName:string) => {
  let allUsers:any = localStorage.getItem('user');
  allUsers = allUsers ? JSON.parse(allUsers) : null;

  if (!allUsers) return null;

  const changePropertyOfCurrentUser = allUsers.map((item:IUserData) => {
    if (item.name === userName) {
      return {...item, isActive: false};
    }
    return item;
  });
  localStorage.setItem('user', JSON.stringify(changePropertyOfCurrentUser));
};

export const isLogin = ():IUserData => {
  let allUsers:any = localStorage.getItem('user');
  allUsers = allUsers ? JSON.parse(allUsers) : undefined;

  if (!allUsers) return allUsers = {...stateUserData};

  allUsers = allUsers.find((item:IUserData) => item.isActive === true);

  if (!allUsers) return allUsers = {...stateUserData};

  return allUsers as IUserData;
};

export const setUser = (userName: string):IUserData => {
  let userData:IUserData[] = [];

  let allUsers:any = localStorage.getItem('user');
  // if array of users exist make parser of strings OR null
  allUsers = allUsers ? JSON.parse(allUsers) : null;

  if (allUsers) {
    // find if user exist
    let foundUser = allUsers.find((item:IUserData) => item.name === userName);
    foundUser = foundUser ? {...foundUser, isActive: true} : undefined;

    if (foundUser) {
      userData = allUsers.map((item:IUserData) => {
        if (item.name === userName) {
          return {...item, isActive: true};
        }
        return item;
      });
    } else {
      foundUser = {...stateUserData, name: userName, isActive: true};
      userData = allUsers;
      userData.push(foundUser);
    }
  } else {
    userData = [{...stateUserData, name: userName, isActive: true}];
  }

  localStorage.setItem('user', JSON.stringify(userData));
  return isLogin();
};

export const isValidUserName = (name:string):string[] => {
  const errosMsg:string[] = [];

  const userName = name.trim().toUpperCase();

  if (userName.length < 3) {
    errosMsg.push('Por favor nombre debe ser mayor 3 caracter');
  }
  return errosMsg;
};
