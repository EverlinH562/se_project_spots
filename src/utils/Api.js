class Api {
    constructor(options) {
      // constructor body
    }
  
    getInitialCards() {
        return fetch("https://around-api.en.tripleten-services.com/v1/cards", {
            headers: {
              authorization: "cf121c58-428e-431e-bc88-d7d5cfc3881a",
            },
          })
            .then(res => res.json());
    }
  
    // other methods for working with the API
  }
  
  export default Api;