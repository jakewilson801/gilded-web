class Cache {
  constructor() {
    this.cache = {};
  }

  get(key) {
    return this.cache[key];
  }

  set(key, value) {
    this.cache[key] = value;
  }

  clear(key) {
    delete this.cache[key];
  }
}

export default new Cache();