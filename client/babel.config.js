module.exports = (api) => {
  api.cache(true);
  const presets = [
    [
      "@babel/preset-env",
      // {
      //   corejs: "3.2.1",
      //   modules: false,
      //   useBuiltIns: "usage"
      // }
    ],
    "@babel/preset-react",
    "@babel/preset-typescript"
  ];

  const plugins = [
    "@babel/plugin-proposal-numeric-separator",
    "@babel/plugin-proposal-optional-chaining",
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-syntax-dynamic-import",
    [
      "@babel/plugin-proposal-decorators",
      {
        decoratorsBeforeExport: true
      }
    ],
    "@babel/plugin-proposal-object-rest-spread",
    "@babel/plugin-proposal-nullish-coalescing-operator",
    "react-intl-auto",
    ["import", {
      "libraryName": "antd",
      "style": true // 或者 "css"
    }],
    [
      "component",
      {
        "libraryName": "hundun-ui-library-react",
        "libDir": "dist/components",
        "libraryDirectory": "components",
        "style": false
      },
      "hundun-ui-library-react"
    ]
  ];


  return {
    ignore:[],
    plugins,
    presets
  };
};
