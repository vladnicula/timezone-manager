import { NORMAL_USER, MANAGER_USER } from './Users';

const TIMEZONE_ONE = {
  name: 'timezone1',
  city: 'city1',
  offset: 1,
};

const TIMEZONE_TWO = {
  name: 'timezone2',
  city: 'city2',
  offset: -1.5,
};

const TIMEZONE_THREE = {
  name: 'timezone3',
  city: 'city3',
  offset: 13,
};

export default function (createdUserRecords) {
  const normalUserId = createdUserRecords.find(({ username }) => (NORMAL_USER.username === username))._id;
  const managegrUserId = createdUserRecords.find(({ username }) => (MANAGER_USER.username === username))._id;

  TIMEZONE_ONE.userId = normalUserId;
  TIMEZONE_TWO.userId = normalUserId;

  TIMEZONE_THREE.userId = managegrUserId;

  return [TIMEZONE_ONE, TIMEZONE_TWO, TIMEZONE_THREE];
}
