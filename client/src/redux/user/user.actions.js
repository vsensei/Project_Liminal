import ProfileActionTypes from './user.types';

export const signInStart = (email, password) => ({
  type: ProfileActionTypes.SIGN_IN_START,
  payload: { email, password },
});

export const signInSuccess = (user) => ({
  type: ProfileActionTypes.SIGN_IN_SUCCESS,
  payload: user,
});

export const signInFailure = (e) => ({
  type: ProfileActionTypes.SIGN_IN_FAILURE,
  payload: e,
});

export const signUpStart = (
  email,
  firstname,
  lastname,
  date,
  phone,
  password
) => ({
  type: ProfileActionTypes.SIGN_UP_START,
  payload: { email, firstname, lastname, date, phone, password },
});

export const signUpSuccess = (profile) => ({
  type: ProfileActionTypes.SIGN_UP_SUCCESS,
  payload: profile,
});

export const signUpFailure = (error) => ({
  type: ProfileActionTypes.SIGN_UP_FAILURE,
  payload: error,
});
