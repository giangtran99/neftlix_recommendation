module.exports = plop => {
  const helpers = require('handlebars-helpers')();
  plop.setHelper(helpers);

  plop.setGenerator('page', {
    description: 'Create a page',
    prompts: [
      {
        type: 'input',
        name: 'pageName',
        message: 'What is your page name?',
      },
      {
        type: 'confirm',
        name: 'hasCreateModelAndService',
        message: 'Do you want create model and service?'
      },
      {
        type: 'input',
        name: 'api',
        message: 'What is your api path?',
      },
      {
        type: 'confirm',
        name: 'hasAppendIndex',
        message: 'Do you want inject models with your index?'
      }
    ],
    actions: function (data) {
      // const fs = require('fs');
      const pathDataModel = plop.getDestBasePath() + '/plop-templates/data/' + data.pageName + '.json';
      const dataModel = require(pathDataModel);
      // console.log('dataModel', dataModel);
      data.columns = dataModel;

      var actions = [
        {
          type: 'add',
          path: 'src/views/{{pascalCase pageName}}/List/index.js',
          templateFile: 'plop-templates/views/index.js.hbs',
          skipIfExists: false,
          force: true
          /* data: {
            columns: [
              {
                dataIndex: 'name1',
                valueType: 'string'
              }
            ]
          } */
        },
        {
          type: 'add',
					path: 'src/views/{{pascalCase pageName}}/List/TableList.less',
          templateFile:
            'plop-templates/views/TableList.less.hbs',
          skipIfExists: true,
          force: true
        },
      ]
      if (data.hasCreateModelAndService) {
        actions = actions.concat([
          {
            type: 'add',
						path: 'src/models/{{camelCase pageName}}.js',
            templateFile:
              'plop-templates/models/models.js.hbs',
            skipIfExists: false,
            force: true
          },
          {
            type: 'add',
						path: 'src/services/{{camelCase pageName}}.js',
            templateFile:
              'plop-templates/services/services.js.hbs',
            skipIfExists: false,
            force: true
          },
        ])
      }
      if (data.hasAppendIndex) {
        actions = actions.concat([
          {
            // Adds an index.js file if it does not already exist
            type: 'add',
						path: 'src/index.js',
            templateFile: 'plop-templates/app.js.hbs',
            // If index.js already exists in this location, skip this action
            skipIfExists: true,
          },
          {
            type: 'append',
						path: 'src/index.js',
            pattern: `/* PLOP_INJECT_IMPORT */`,
            template: `import model{{pascalCase pageName}} from './models/{{camelCase pageName}}';`,
          },
          {
            type: 'append',
						path: 'src/index.js',
            pattern: `/* PLOP_INJECT_EXPORT */`,
            template: `app.model(model{{pascalCase pageName}});`,
          },
          {
            // Adds an index.js file if it does not already exist
            type: 'add',
						path: 'src/routes.js',
            templateFile: 'plop-templates/routes.js.hbs',
            // If index.js already exists in this location, skip this action
            skipIfExists: true,
          },
          {
            type: 'append',
						path: 'src/routes.js',
            pattern: `/* PLOP_INJECT_LIST */`,
            template: `{ path: '/endow/{{camelCase pageName}}', name: '{{pascalCase pageName}}', component: React.lazy(() => import('./views/{{pascalCase pageName}}/List')), exact: true },`,
          },
          {
            type: 'append',
						path: 'src/routes.js',
            pattern: `/* PLOP_INJECT_CRUD */`,
            template: `{ path: '/endow/{{camelCase pageName}}/:id', name: '{{pascalCase pageName}} Crud', component: React.lazy(() => import('./views/{{pascalCase pageName}}/Crud')) },`,
          },
        ])
      }
      return actions;
    },
  })

  plop.setGenerator('crud', {
    description: 'Create a crud page',
    prompts: [
      {
        type: 'input',
        name: 'pageName',
        message: 'What is your page name?',
      },
      {
        type: 'input',
        name: 'api',
        message: 'What is your api crud path?',
      },
    ],
    actions: [
      function (data) {
        console.log("data", data);
        // const fs = require('fs');
        const pathDataModel = plop.getDestBasePath() + '/plop-templates/data/' + data.pageName + '.json';
        let dataModel = require(pathDataModel);
        dataModel = dataModel.filter(col => col.hideInForm !== true);
        let dataForm = dataModel.reduce((acc, col) => {
          for (let index = 0; index < acc.length; index++) {
            const element = acc[index];
            if (Object.keys(element).includes(col.formPattern.card)) {
              element[col.formPattern.card].push({ [col.formPattern.row]: { [col.formPattern.col]: col } })
              return acc;
            }
          }
          return [
            ...acc,
            { [col.formPattern.card]: [{ [col.formPattern.row]: { [col.formPattern.col]: col } }] }
          ]
        }, [])

        let iCard = 0;
        for (let card of dataForm) {
          let dataRows = Object.values(card)[0];
          dataRows = dataRows.reduce((accRows, row) => {
            for (let idx = 0; idx < accRows.length; idx++) {
              const eRow = accRows[idx];
              if (Object.keys(eRow).includes(Object.keys(row)[0])) {
                eRow[Object.keys(row)[0]].push(Object.values(row)[0])
                return accRows;
              }
            }
            return [
              ...accRows,
              { [Object.keys(row)[0]]: [Object.values(row)[0]] }
            ]
          }, []);
          let iRow = 0;
          for (let row of dataRows) {
            let dataCols = Object.values(row)[0];

            let iCol = 0;
            for (let col of dataCols) {
              dataCols[iCol] = { title: Object.keys(col)[0], col: Object.values(col)[0] }
              iCol++;
            }
            dataRows[iRow] = { title: Object.keys(row)[0], cols: dataCols }
            iRow++;
          }
          dataForm[iCard] = { title: Object.keys(card)[0], rows: dataRows }
          iCard++;
        }

        const fieldLabels = dataModel.reduce((acc, cur) => {
          return {
            ...acc,
            [cur.dataIndex]: cur.title
          }
        }, {})
        data.dataForm = dataForm;
        data.fieldLabels = fieldLabels;
        return data;
      },
      {
        type: 'add',
				path: 'src/views/{{pascalCase pageName}}/Crud/index.js',
        templateFile: 'plop-templates/crud/index.js.hbs',
        skipIfExists: true,
      },
      {
        type: 'add',
				path: 'src/views/{{pascalCase pageName}}/Crud/style.less',
        templateFile: 'plop-templates/crud/style.less.hbs',
        skipIfExists: true,
      },
    ]
  })

  plop.setGenerator('select', {
    description: 'Create a select component',
    prompts: [
      {
        type: 'input',
        name: 'pageName',
        message: 'What is your page name?',
      },
      {
        type: 'input',
        name: 'key',
        message: 'What is your key field?',
      },
      {
        type: 'input',
        name: 'value',
        message: 'What is your value field?',
      },
    ],
    actions: [
      function (data) {
        console.log("data", data);
        // const fs = require('fs');
        return data;
      },
      {
        type: 'add',
				path: 'src/components/Select/{{pascalCase pageName}}/index.js',
        templateFile: 'plop-templates/select/index.js.hbs',
        skipIfExists: true,
      },
    ]
  })

  plop.setGenerator('models', {
    description: 'Create a models and services component',
    prompts: [
      {
        type: 'input',
        name: 'pageName',
        message: 'What is your model and service name?',
      },
      {
        type: 'input',
        name: 'api',
        message: 'What is your api path?',
      },
      {
        type: 'confirm',
        name: 'hasAppendIndex',
        message: 'Do you want inject models with your index?'
      }
    ],
    actions: function (data) {
      var actions = [
        {
          type: 'add',
					path: 'src/models/{{camelCase pageName}}.js',
          templateFile:
            'plop-templates/models/models.js.hbs',
          skipIfExists: true,
        },
        {
          type: 'add',
					path: 'src/services/{{camelCase pageName}}.js',
          templateFile:
            'plop-templates/services/services.js.hbs',
          skipIfExists: true,
        },
      ];
      if (data.hasAppendIndex) {
        actions = actions.concat([
          {
            type: 'add',
						path: 'src/index.js',
            templateFile: 'plop-templates/app.js.hbs',
            skipIfExists: true,
          },
          {
            type: 'append',
						path: 'src/index.js',
            pattern: `/* PLOP_INJECT_IMPORT */`,
            template: `import model{{pascalCase pageName}} from './models/{{camelCase pageName}}';`,
            /* skip(data) {
              // console.log('skip -> data', data);
              if (!data.toppings.includes('mushroom')) {
                // Skip this action
                return 'Skipped replacing mushrooms';
              } else {
                // Continue with this action
                return;
              }
            },
            transform(fileContents, data) {
              console.log('transform -> fileContents', fileContents);
              return fileContents.replace(/partners/g, 'pepperoni');
            } */
          },
          {
            type: 'append',
						path: 'src/index.js',
            pattern: `/* PLOP_INJECT_EXPORT */`,
            template: `app.model(model{{pascalCase pageName}});`,
          },
        ]);
      }
      return actions;
    }
  })

}
