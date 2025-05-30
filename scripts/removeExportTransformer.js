const ts = require("typescript");

module.exports = function(program) {
  return {
    before: [
      function(context) {
        const visit = (node) => {
          if (ts.isExportAssignment(node) && node.isExportEquals) {
            return undefined;
          }
          return ts.visitEachChild(node, visit, context);
        };

        return (sourceFile) => ts.visitEachChild(sourceFile, visit, context);
      }
    ]
  };
};