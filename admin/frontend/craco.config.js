const CracoAntDesignPlugin = require("craco-antd");
// const CracoLessPlugin = require('craco-less');
const lessToJS = require('less-vars-to-js');
const fs = require('fs');
const path = require('path');
const defaultSetting = require('./src/defaultSettings');
const themeVariables = lessToJS(
  fs.readFileSync(
    path.resolve(__dirname, './src/theme.less'),
    'utf8'
  )
);

module.exports = {
  babel: {
    // plugins: [
    //   ['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }],
    //   /* ['babel-plugin-import-less', {
    //     library: 'antd', // import module
    //     module: 'es/[dash]',
    //     style: 'style'
    //   }
    //   ], */
    // ],
  },
  plugins: [
    {
      plugin: CracoAntDesignPlugin,
      options: {

        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              ...themeVariables,
              '@menu-collapsed-width': defaultSetting.collapsedWidth
            },
            javascriptEnabled: true
          }
        },
        cssLoaderOptions: {
          modules: {
            getLocalIdent: (context, localIdentName, localName) => {
              if (
                context.resourcePath.includes('node_modules') ||
                context.resourcePath.includes('ant.design.pro.less') ||
                context.resourcePath.includes('global.less')
              ) {
                return localName;
              }
              const match = context.resourcePath.match(/src(.*)/);
              // console.log("cdfsfdsfdfd match:", match)
              if (match && match[1]) {
                const antdProPath = match[1].replace('.less', '');
                const arr = antdProPath
                  .split('/')
                  .map(a => a.replace(/([A-Z])/g, '-$1'))
                  .map(a => a.replace(/\\/, '-').toLowerCase());
                // console.log("cdfsfdsfdfd arr: ", arr)
                return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
              }
              return localName;
            },
          },
        }
      }
    },
  ],
  /* webpack: {
    configure: (config, { env, paths }) => {
      config.module.rules.push({
        test: /\.svg$/,
        use: ["@svgr/webpack"]
      });
      return config;
    }
  } */
};
