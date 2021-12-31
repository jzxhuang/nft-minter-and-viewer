module.exports = {
  semi: false,
  singleQuote: false, // use double quotes for strings like in C#
  printWidth: 120,
  tabWidth: 2,
  endOfLine: "auto",
  // import order config: https://www.npmjs.com/package/@trivago/prettier-plugin-sort-imports
  importOrder: ["^@/(.*)$", "^[./](?!.*[.]s?css$).*$", ".*[.](s?css)$"],
  importOrderSeparation: true, // adds new line between each import declaration group
  importOrderSortSpecifiers: true, // sorts each specifier within a single import
}
