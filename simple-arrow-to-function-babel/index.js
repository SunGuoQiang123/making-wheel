module.exports = function({types: t}) {
  return {
    name: 'ArrowFunctionToExpression',
    visitor: {
      ArrowFunctionExpression(path) {
        let bodyStatement;
        if(t.isBlockStatement(path.node.body)) {
          bodyStatement = path.node.body;
          const thisPaths = [];
          path.traverse({
            ThisExpression(path) {
              thisPaths.push(path);
              path.skip();
            }
          });
          if(thisPaths.length > 0) {
            const parentPath = path.findParent(path => path.isFunction() && !path.isArrowFunctionExpression() || path.isProgram());
            const declaration = t.variableDeclaration('let', [
              t.variableDeclarator(t.identifier('_this'), t.ThisExpression())
            ]);
            if(parentPath.isProgram()) {
              parentPath.unshiftContainer('body', declaration);
            } else {
              parentPath.get('body').unshiftContainer('body', declaration);
            }
          }
        } else {
          bodyStatement = t.blockStatement([t.returnStatement(path.node.body)]);
        }
        const fnExpression = t.functionExpression(null, path.node.params, bodyStatement);
        path.replaceWith(fnExpression);
      }
    }
  };
};
