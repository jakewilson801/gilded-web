class APIClient {
  static getMe(cb, errorCb) {
    fetch(`/api/v1/user/me?token=${localStorage.jwt}`)
      .then(d => d.json())
      .then(() => cb())
      .catch((err) => errorCb());
  }
}

export default APIClient;