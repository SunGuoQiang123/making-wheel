const path = require('path')

module.exports = function() {
  return {
    name: 'rollup-plugin-resolve-index',
    resolveId(source, importer) {
      if(
        !path.extname(source) && (source.startsWith('.') || source.startsWith('/'))
      ) {
        const newPath = source.endsWith('/') ? `${source}index.js` : `${source}/index.js`;
        if(path.isAbsolute(source)) {
          return newPath;
        } else {
          return path.resolve(path.dirname(importer), newPath);
        }
      } else {
        return null;
      }
    }
  }
}
