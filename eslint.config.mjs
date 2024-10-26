import globals from "globals";
import pluginJs from "@eslint/js";


export default [
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  {
    rules: {
      'camelcase': ['error'],
      'complexity': ['warn'],
      'max-depth': ['warn'],
      'max-params': ['warn', 4],
      'max-statements': ['warn', 20],
      'no-console': ['error', { allow: ['error', 'info', 'table', 'warn'] }],
      'no-eval': ['error'],
      'no-inner-declarations': ['error'],
      'no-label-var': ['error'],
      'no-labels': ['error'],
      'no-lone-blocks': ['error'],
      'no-lonely-if': ['error'],
      'no-param-reassign': ['error'],
      'no-var': ['error'],
      'no-warning-comments': ['warn'],
    }
  },
];
