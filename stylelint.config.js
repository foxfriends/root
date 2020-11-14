module.exports = {
  'extends': 'stylelint-config-standard',
  'rules': {
    'color-hex-case': 'upper',
    'color-hex-length': null,
    'color-no-invalid-hex': true,
    'comment-whitespace-inside': "always",
    'declaration-colon-space-after': 'always-single-line',
    'declaration-colon-space-before': 'never',
    'declaration-bang-space-after': 'never',
    'declaration-bang-space-before': 'always',
    'declaration-block-trailing-semicolon': 'always',
    'indentation': 2,
    'max-empty-lines': 1,
    'no-extra-semicolons': true,
    'no-descending-specificity': null,
    'no-eol-whitespace': true,
    'at-rule-no-unknown': true,
    'selector-pseudo-class-no-unknown': [
      true,
      { ignorePseudoClasses: ['global'] },
    ],
  },
};
