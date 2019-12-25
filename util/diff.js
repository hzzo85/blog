function calcDiff(holder, key, newObj, oldObj) {
  if (newObj === oldObj || newObj === undefined) {
    return
  }

  if (newObj == null || oldObj == null || typeof newObj !== typeof oldObj) {
    holder[key] = newObj
  } else if (Array.isArray(newObj) && Array.isArray(oldObj)) {
    if (newObj.length === oldObj.length) {
      for (var i = 0, len = newObj.length; i < len; ++i) {
        calcDiff(holder, key + '[' + i + ']', newObj[i], oldObj[i])
      }
    } else {
      holder[key] = newObj
    }
  } else if (typeof newObj === 'object' && typeof oldObj === 'object') {
    var newKeys = Object.keys(newObj)
    var oldKeys = Object.keys(oldObj)

    if (newKeys.length !== oldKeys.length) {
      holder[key] = newObj
    } else {
      var allKeysSet = Object.create(null)
      for (var i = 0, len = newKeys.length; i < len; ++i) {
        allKeysSet[newKeys[i]] = true
        allKeysSet[oldKeys[i]] = true
      }
      if (Object.keys(allKeysSet).length !== newKeys.length) {
        holder[key] = newObj
      } else {
        for (var i = 0, len = newKeys.length; i < len; ++i) {
          var k = newKeys[i]
          calcDiff(holder, key + '.' + k, newObj[k], oldObj[k])
        }
      }
    }
  } else if (newObj !== oldObj) {
    holder[key] = newObj
  }
}

function diff(newObj, oldObj) {
  var keys = Object.keys(newObj)
  var diffResult = {}
  for (var i = 0, len = keys.length; i < len; ++i) {
    var k = keys[i]
    var oldKeyPath = k.split('.')
    var oldValue = oldObj[oldKeyPath[0]]
    for (var j = 1, jlen = oldKeyPath.length; j < jlen && oldValue !== undefined; ++j) {
      oldValue = oldValue[oldKeyPath[j]]
    }
    calcDiff(diffResult, k, newObj[k], oldValue)
  }
  return diffResult
}

export {
  diff
}