module.exports = {
	root: true,
	env: {
		node: true,
		es6: true
	},
	"extends": [
		"eslint:recommended",
	],
	rules: {
		"indent": [
			"warn",
			"tab",
			{
				"SwitchCase": 1
			}
		],
		"quotes": ["off", "double"],
		"semi": [
			"error",
			"always"
		],
		"no-var": [
			"error"
		],
		"no-console": [
			"off"
		],
		"no-unused-vars": [
			"warn"
		],
		"no-mixed-spaces-and-tabs": [
			"warn"
		],
		"space-before-function-paren": [
			"warn",
			{
				"anonymous": "never",
				"named": "never",
				"asyncArrow": "always"
			}
		],
		"object-curly-spacing": [
			"warn",
			"always"
		]
	},
	parserOptions: {
		parser: "babel-eslint",
		sourceType: "module",
		// ecmaVersion: 9
	}
};
