class Api {
  constructor(settings) {
    this._baseUrl = settings.baseUrl;
    this._headers = settings.headers;
  }

  _handleResponse(res) {
    if (res.ok){
      return res.json();
    }
    return Promise.reject();
  }

  getUserInfo() {
    return fetch(`${this._baseUrl}/users/me`, {
      headers: this._headers
    })
      .then((res) => {
        return this._handleResponse(res);
      });
  }

  getCards() {
    return fetch(`${this._baseUrl}/cards`, {
      headers: this._headers
    })
      .then((res) => {
        return this._handleResponse(res);
      });
  }

  updateProfile({ name, about }) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        name,
        about
      })
    })
    .then((res) => {
      return this._handleResponse(res);
    })
  }

  addCard(name, link) {
    return fetch(`${this._baseUrl}/cards`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({
        name,
        link
      })
    })
    .then((res) => {
      return this._handleResponse(res);
    })
  }

  deleteCard(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}`, {
      method: "DELETE",
      headers: this._headers
    })
    .then((res) => {
      return this._handleResponse(res);
    })
  }

  addLike(cardId) {
    return fetch(`${this._baseUrl}/cards/likes/${cardId}`, {
      method: "PUT",
      headers: this._headers
    })
    .then((res) => {
      return this._handleResponse(res);
    })
  }

  removeLike(cardId) {
    return fetch(`${this._baseUrl}/cards/likes/${cardId}`, {
      method: "DELETE",
      headers: this._headers
    })
    .then((res) => {
      return this._handleResponse(res);
    })
  }

  changeLikeStatus(cardId, isLiked) {
    if (isLiked){
      return this.addLike(cardId);
    }
    else {
      return this.removeLike(cardId);
    }
  }

  updateProfilePic(avatar) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        avatar
      })
    })
    .then((res) => {
      return this._handleResponse(res);
    })
  }
}

const api = new Api({
  baseUrl: "https://around.nomoreparties.co/v1/group-10",
  headers: {
      authorization: "2a32e80d-c23f-4ed9-9cf5-671c417d0702",
      "Content-Type": "application/json"
    }
});

export default api;