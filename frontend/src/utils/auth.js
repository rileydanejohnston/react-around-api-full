// fix with env later
const { NODE_ENV } = process.env;

const baseUrl = NODE_ENV === 'production' ? 'https://api.around-the-us.students.nomoreparties.site' : 'http://localhost:3000';

const handleResponse = (res) => {
  if (res.ok){
    return res.json();
  }
  return Promise.reject();
}

export const signup = (email, password) => {
  return fetch(`${baseUrl}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ password, email })
  })
  .then((res) => {
    return handleResponse(res);
  });
}

export const signin = (email, password) => {
  return fetch(`${baseUrl}/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  })
  .then((res) => {
    return handleResponse(res);
  });
}

export const authorize = (token) => {
  return fetch(`${baseUrl}/users/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`
    }
  })
  .then((res) => {
    return handleResponse(res);
  })
}