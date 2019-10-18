const _ = require('underscore');
const fs = require('fs');
class MergeAtom {
  constructor(options = {}) {
    this.options = options;
  }
  apply(compiler) {
    compiler.hooks.emit.tapAsync('MergeAtom', (compilation, callback) => {
      let assets = compilation.assets;
      let aCssKeys = Object.keys(assets).filter(
        val => val.indexOf('-ATOMCSS.json') >= 0
      );
      // 删除输出的js文件，因为打包出来是用不到的
      _.each(assets, (val, key) => {
        if (key.indexOf('-ATOMCSS.js') >= 0) {
          delete compilation.assets[key];
        }
      });
      let aAtomList = [];
      aCssKeys.forEach(key => {
        let asset = assets[key];
        let content = asset.source();
        aAtomList = [...aAtomList, ...JSON.parse(content)];
        // 删除生成的匹配到的json文件
        delete compilation.assets[key];
      });
      try {
        this.output(aAtomList);
        callback();
        console.log('success....', new Date().toLocaleString());
      } catch (error) {
        callback();
        console.log('Error...', new Date().toLocaleString());
      }
    });
  }
  output(aAtomList) {
    const { unit = 'px', ratio, filePath } = this.options;
    let sStyleString = '';
    aAtomList = _.uniq(aAtomList);

    const oMap = {
      // padding
      p: `padding:$${unit}`,
      pl: `padding-left:$${unit}`,
      pr: `padding-right:$${unit}`,
      pt: `padding-top:$${unit}`,
      pb: `padding-bottom:$${unit}`,
      px: `padding-left:$${unit};padding-right:$${unit}`,
      py: `padding-top:$${unit};padding-bottom:$${unit}`,
      // margin
      m: `margin:$${unit}`,
      ml: `margin-left:$${unit}`,
      mr: `margin-right:$${unit}`,
      mt: `margin-top:$${unit}`,
      mb: `margin-bottom:$${unit}`,
      mx: `margin-left:$${unit};margin-right:$${unit}`,
      my: `margin-top:$${unit};margin-bottom:$${unit}`,
      // top/left/right/bottom
      t: `top:$${unit}`,
      l: `left:$${unit}`,
      b: `bottom:$${unit}`,
      r: `right:$${unit}`,
      // width/height
      w: `width:$${unit}`,
      h: `height:$${unit}`,
      lh: `line-height:$${unit}`,
      fw: 'font-weight:$',
      rounded: `border-radius:$${unit}`,
      fs: `font-size:$${unit}`,
      // width:100%;height:100%
      wp: 'width:$%',
      hp: 'height:$%'
    };
    // 匹配生成css
    _.each(aAtomList, sValue => {
      let aValue = sValue.split('-');
      if (aValue[0]) {
        let sMapValue = oMap[aValue[0]]
          ? `.${val}{${oMap[aValue[0]].replace(
              /\$/g,
              ratio ? aValue[1] * ratio : aValue[1]
            )}}`
          : '';
        sStyleString += sMapValue;
      }
    });
    // 生成css文件
    fs.writeFileSync(filePath, sStyleString, {
      encoding: 'utf8'
    });
  }
}
module.exports = MergeAtom;
