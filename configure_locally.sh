echo "module.exports = {" > babel.config.js
echo "    presets: [" >> babel.config.js
echo "        '@vue/app'," >> babel.config.js
echo "    ]," >> babel.config.js
echo "    plugins: ['dynamic-import-node']," >> babel.config.js
echo "}" >> babel.config.js
