const getHashedValues = () => {
  var alphb_arr = ["a"],
    ab = "";
  var alph_obj = {};
  for (var i = 0; i <= 25; i++) {
    let a = alphb_arr[i].charCodeAt(0);
    alph_obj[String.fromCharCode(a)] = "";
    if (alphb_arr.length % 5 === 0) {
      ab += "|";
    }
    alphb_arr.push(String.fromCharCode(a + 1));
    ab += alphb_arr[i] + ",";
  }
  alph_obj["z"] = "";

  let kk = ab.split("|");
  kk[0] += ab[ab.length - 2];
  kk[3] += ab[ab.length - 4];
  kk.pop();
  for (var i = 0; i < kk.length - 1; i += 2) {
    let a = kk[i + 1];
    kk[i + 1] = kk[i];
    kk[i] = a;
  }
  let km = "";
  kk.map((item) => {
    for (var i = 0; i < item.length; i++) {
      if (item[i] !== ",") {
        km += item[i];
      }
    }
    return null;
  });
  let iterator = 0;
  for (const key in alph_obj) {
    alph_obj[key] = km[iterator];
    alph_obj[key.toUpperCase()] = km[iterator++].toUpperCase();
  }
  alph_obj[" "] = "$";
  return alph_obj;
};

const reversedString = (res, st, ed) => {
  let arr = [];
  for (var i = st; i < ed; i++) {
    arr.push(res[i]);
  }
  arr.reverse();
  return arr.join("");
};

const initiateReverseSequence = (encodedString) => {
  let k = getIndex(encodedString.length);
  let result =
    reversedString(encodedString, 0, k + 1) +
    reversedString(encodedString, k + 1, encodedString.length);
  result = reversedString(encodedString, 0, encodedString.length);
  return result;
};

// const counterReverseSequence = (encodedString, k) => {
//   let result = reversedString(encodedString, 0, encodedString.length);
//   result =
//     reversedString(encodedString, 0, k + 1) +
//     reversedString(encodedString, k + 1, encodedString.length);
//   return result;
// };

const encodeData = (target) => {
  let hash = getHashedValues(),
    retStr = "";
  for (var i = 0; i < target.length; i++) {
    let s = target[i];
    if (s in hash) {
      retStr += hash[s];
    }else{
        retStr += s;
    }
  }
  return initiateReverseSequence(retStr);
};

const decodeData = (encodedData) => {
  let hash = {},
    retStr = "",
    alph_obj = getHashedValues();
  encodedData = initiateReverseSequence(encodedData);
  for (const key in alph_obj) {
    hash[alph_obj[key]] = key;
  }
  for (var i = 0; i < encodedData.length; i++) {
    let s = encodedData[i];
    if (s in hash) {
      retStr += hash[s];
    }else{
        retStr += s;
    }
  }
  return retStr;
};

const getIndex = (len) => {
  let k = Math.sqrt(len) + Math.log(len);
  k = Math.ceil(k) % len;
  return k;
};

const encodeAsync = (string) =>{
    return new Promise((resolve, reject)=>{
        resolve(encodeData(string));
    });
} 

const decodeAsync = (string) =>{
    return new Promise((resolve, reject)=>{
        resolve(decodeData(string));
    });
}

const encodeSync = (string) =>{
    return encodeData(string);
}

const decodeSync = (string) =>{
    return decodeData(string);
}

let value = "multiverse";
console.log(encodeSync(value));

module.exports={
    encodeAsync,
    decodeAsync,
    encodeSync,
    decodeSync,
}

