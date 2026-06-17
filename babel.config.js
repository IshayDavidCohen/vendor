module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      importMetaTransform,
    ],
  };
};

function importMetaTransform() {
  return {
    visitor: {
      MetaProperty(path) {
        // import.meta.env.X  →  (process.env && process.env.X)
        // import.meta.env    →  (process.env || {})
        // import.meta        →  ({})
        const { parent } = path;
        if (
          parent.type === 'MemberExpression' &&
          parent.property.name === 'env' &&
          parent.object === path.node
        ) {
          path.parentPath.replaceWithSourceString('(process.env || {})');
        } else {
          path.replaceWithSourceString('({})');
        }
      },
    },
  };
}
