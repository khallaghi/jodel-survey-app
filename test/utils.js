
function updateDeeply(obj, key, value) {
  Object.keys(obj).forEach(function (_key) {
    // Note that Object.keys() works on arrays as well.
    if (_key === key) {
      obj[_key] = value;
    } else if (typeof obj[_key] === 'object' || Array.isArray(obj[_key])) {
      // Make recursive call.
      updateDeeply(obj[_key], key, value);
    }
  });
}


export const deepReplace = (body, keyArray, replaceWith) => {
  for(const key of keyArray)
    updateDeeply(body, key, replaceWith)
}
