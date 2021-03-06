var utils = require('./utils');
var path = require('path');
var findEntryPoints = require('./findEntryPoints');

module.exports = function (entries) {
  var entryKeys = Object.keys(entries);

  return Promise.all(entryKeys.map(function (entryKey) {
    return findEntryPoints(entryKey, path.resolve('node_modules', entryKey));
  }))
    .then(function (entryPointsList) {
      return entryPointsList.reduce(function (entryPoints, entryPointList, index) {
        var directEntryPath = path.resolve('node_modules', entryKeys[index], entries[entryKeys[index]]);

        if (entryPointList.indexOf(directEntryPath) === -1) {
          entryPointList.push(directEntryPath);
        }

        return entryPoints.concat(entryPointList);
      }, [])
    })
    .then(function (entryPoints) {
      return entryPoints.reduce(function (allEntryPoints, entryPoint) {
        if (allEntryPoints.indexOf(entryPoint) === -1) {
          return allEntryPoints.concat(entryPoint);
        }

        return allEntryPoints;
      }, []);
    })
}
