export const getStorage = (key, initial) => {
  if (localStorage.getItem(key) === null) {
    return initial;
  } else {
    return JSON.parse(localStorage.getItem(key));
  }
};

export const setStorage = (key, value) => {
  let item = getStorage(key, value);
  item = value;
  localStorage.setItem(key, JSON.stringify(item));
};
