export function parseJson(jsonStr) {
  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    return jsonStr;
  }
}

export function formatJson(json) {
  try {
    if (typeof (json) == 'string') {
      console.log("isString");
      return json.toString();
    } else {
      return JSON.stringify(json);
    }
  } catch (e) {
    return json;
  }
}
