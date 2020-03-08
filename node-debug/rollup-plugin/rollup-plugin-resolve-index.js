const path = require('path')

module.exports = function(options) {
  return {
    name: 'rollup-plugin-resolve-index',
    resolveId(source, importer) {
      if(
        !path.extname(source) && (source.startsWith('.') || source.startsWith('/'))
      ) {
        const newPath = source.endsWith('/') ? `${source}index.js` : `${source}/index.js`;
        return path.resolve(path.dirname(importer), newPath);
      } else {
        return null;
      }
    }
  }
}
