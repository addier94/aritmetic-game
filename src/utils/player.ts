import {random} from '.';
import {IMultiplication} from '../context/Player';
import {IUserData} from './interfaces';

export const answerItWas = (initNum:number, secondNum:number, op:string):number => {
  let itWas:number = 0;
  if (op === 'sum') itWas = initNum + secondNum;
  if (op === 'rest') itWas = initNum - secondNum;
  if (op === 'multi') itWas = initNum * secondNum;
  return itWas;
};

export const calculateAnswer = (result:number, initNum:number, secondNum:number, prog:number, op:string):Promise<number> => new Promise((resolve, reject) => {
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


export const generatePossibleSolutions = (init:number, end:number, op:string):number[] => {
  if (op === 'multi') return possibleAnswersMulti(init, end);
  if (op === 'sum') return answersSumOrRest(init, end, op);
  return answersSumOrRest(init, end, op);
};

export const possibleAnswersMulti = (init:number, end:number):number[] => {
  const arr:number[] = [init * end, (init - 1) * end, (init + 1) * end, (end-1) * init, (end+1) * init];

  const result:number[] = [];

  for (let i = 0; i<5; i++) {
    const numRandom = random.randomIntFromInterval(0, (arr.length - 1));

    result.push(arr[numRandom]);
    arr.splice(numRandom, 1);
  }

  return result;
};


export const answersSumOrRest = (init:number, end:number, op:string):number[] => {
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


export const newChallenge = (op:string):IMultiplication => {
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

export const generateNewRest = () => {
  const initNum = random.randomIntFromInterval(3, 19);
  let secondNum = random.randomIntFromInterval(3, 19);

  do {
    secondNum -=2;
  }
  while (secondNum >= initNum);

  return {initNum, secondNum, result: 0};
};
export const generateNewSum = () => {
  return {
    initNum: random.randomIntFromInterval(2, 20),
    secondNum: random.randomIntFromInterval(2, 20),
    result: 0,
  };
};

export const incrementUserLevel = (op:string) => {
  const allUsers:IUserData[] = getAllUsers();

  let userUpdate:IUserData[] = [];

  switch (op) {
    case 'sum':
      userUpdate = allUsers.map((user:IUserData) => {
        if (user.isActive === true) {
          return {...user, sum: user.sum+10, level: user.level+1};
        }
        return user;
      });
      break;
    case 'rest':
      userUpdate = allUsers.map((user:IUserData) => {
        if (user.isActive === true) {
          return {...user, rest: user.rest+10, level: user.level+1};
        }
        return user;
      });
      break;
    case 'multi':
      userUpdate = allUsers.map((user:IUserData) => {
        if (user.isActive === true) {
          return {...user, multi: user.multi+10, level: user.level+1};
        }
        return user;
      });
      break;
  }
  localStorage.setItem('user', JSON.stringify(userUpdate));
};


const getAllUsers = ():IUserData[] => {
  let allUsers:any = localStorage.getItem('user');
  allUsers = allUsers ? JSON.parse(allUsers) : undefined;

  return allUsers as IUserData[];
};
