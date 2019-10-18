const _ = require('underscore');
module.exports = function(sSource) {
  // 保证唯一命名
  let sId = generateGuuId();
  let aCssList = _.uniq(
    sSource.match(
      /(p|pl|pr|pt|pb|ptb|py|plr|px|m|ml|mr|mt|mb|mtb|my|mlr|mx|w|h|l|t|b|r|fs|lh|fw|wp|hp|rounded)-[0-9]+/gm
    )
  );
  this.emitFile(`${sId}-ATOMCSS.json`, JSON.stringify(aCssList));
  return '';
};
function generateGuuId() {
  var d = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(
    c
  ) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
}
