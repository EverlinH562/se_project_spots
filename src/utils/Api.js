class Api {
    constructor({ baseUrl, headers }) {
        this._baseUrl = baseUrl;
        this._headers = headers;
    }

    getAppInfo() {
        return Promise.all([this.getInitialCards(), this.getUserInfo()]);
    }
  
    getInitialCards() {
        return fetch(`${this._baseUrl}/cards`, {
            headers: this._headers,
        })
        .then((res) => {
            if (res.ok) {
                return res.json()
            }
            Promise.reject(`Error: ${res.status}`);
        });
    }

    createCard({name, link}){
      return fetch(`${this._baseUrl}/cards`, { 
        method: "POST",
        headers: this._headers,
        body: JSON.stringify({
          name: name,
          link: link,
        }),
    })
    .then((res) => {
        if (res.ok) {
            return res.json()
        }
        Promise.reject(`Error: ${res.status}`);
    });
    }

    getUserInfo(){
      return fetch(`${this._baseUrl}/users/me`, { 
        headers: this._headers,
    })
    .then((res) => {
        if (res.ok) {
            return res.json()
        }
        Promise.reject(`Error: ${res.status}`);
    });
    }

    editUserInfo({ name, about }) {
      return fetch(`${this._baseUrl}/users/me`, {
        method: "PATCH",
        headers: this._headers,
        body: JSON.stringify({
          name,
          about,
        }),
      }).then((res) => {
        if (res.ok) {
            return res.json()
        }
        Promise.reject(`Error: ${res.status}`);
    });
    }

    editAvatarInfo(avatar) {
      return fetch(`${this._baseUrl}/users/me/avatar`, {
        method: "PATCH",
        headers: this._headers,
        body: JSON.stringify({
          avatar, 
        }),
      }).then((res) => {
        if (res.ok) {
            return res.json()
        }
        Promise.reject(`Error: ${res.status}`);
    });
    }

    deleteCard(cardId) {
      return fetch(`${this._baseUrl}/cards/${cardId}`, {
        method: "DELETE",
        headers: this._headers,
      }).then((res) => {
        if (res.ok) {
          return res.json();
        }
        return Promise.reject(`Error: ${res.status}`);
      });
    }

    handleLikeStatus(cardId, isLiked) {
      return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
        method: isLiked ? "DELETE": "PUT",
        headers: this._headers,
      }).then((res) => {
        if (res.ok) {
          return res.json();
        }
         Promise.reject(`Error: ${res.status}`);
      });
    }

    
}

export default Api;

