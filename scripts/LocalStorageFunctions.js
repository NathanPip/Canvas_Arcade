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

export const getGlobalHighscore = async (gameName) => {
  try {
    const response = await fetch(`http://localhost:5001/highscore/${gameName}`);
    const gameObject = await response.json();
    const highscore = gameObject[0].highscore_value;
    return highscore;
  } catch (err) {
    console.log(err);
  }
}

export const updateGlobalHighscore = async (gameName, value) => {
  try {
    const body = { value }
    const response = await fetch(`http://localhost:5001/highscore/${gameName}`, {
      method: "PUT",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(body)
    });
    const gameObject = await response.json();
    console.log(gameObject);
    const highscore = gameObject[0].highscore_value;
    return highscore;
  } catch (err) {
    console.log(err);
  }
}
