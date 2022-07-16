let session = {};
session.get = (key) => {
  let t = sessionStorage.getItem(key);
  try {
    return JSON.parse(t);
  } catch (err) {
    return t;
  }

};
session.set = (key, val) => {
  sessionStorage.setItem(key, val);
};
session.clear = () => {
  sessionStorage.clear();
};
export default session;