const _ = require('underscore');
const glob = require('glob');
module.exports = {
  getEntry: name => {
    const aFilePath = glob.sync(`**/*.${name}`, {});
    const oEntryPath = {};
    _.each(aFilePath, (sValue, nIdx) => {
      oEntryPath[`${nIdx}-ATOMCSS`] = './' + sValue;
    });
    return oEntryPath;
  }
};
