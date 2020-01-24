const SET_MOVIES = 'SET_MOVIES';
const SET_FILTER = 'SET_FILTER';
const SET_USER = 'SET_USER';
const SET_REGISTRATION = 'SET_REGISTRATION';

function setMovies(value) {
  return { type: SET_MOVIES, value };
}

function setRegistration(value) {
  return { type: SET_REGISTRATION, value };
}

function setFilter(value) {
  return { type: SET_FILTER, value };
}

function setUser(value) {
  return { type: SET_USER, value };
}


export {
  SET_MOVIES,
  SET_FILTER,
  SET_USER,
  SET_REGISTRATION,

  setMovies,
  setRegistration,
  setFilter,
  setUser
}