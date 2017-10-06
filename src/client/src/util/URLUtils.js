class URLUtils {
  static getParameterByName(name) {
    let match = new RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
  }
}

export default URLUtils;