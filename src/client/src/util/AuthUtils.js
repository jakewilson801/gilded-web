class AuthUtils {
  static isLoggedIn() {
    return localStorage.getItem('fb_info')!== '{}';
  }
}

export default AuthUtils;