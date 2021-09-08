const { defaults } = require('lodash');
const path = require('path');

const defaultOptions = {
  itemsFromCompilation: compilation => Object.keys(compilation.assets),
  output: '../fxmanifest.lua',
};

function ResourceManifestPlugin(options) {
  defaults(this, options, defaultOptions);
}

const pluginName = 'fivem-fx-plugin';

ResourceManifestPlugin.prototype.apply = function(compiler) {
  const { itemsFromCompilation, output } = this;
  compiler.hooks.emit.tap(pluginName, compilation => {
    const assets = itemsFromCompilation(compilation);
    const result = format(
      assets,
      compilation.options.output.path.split('\\').pop(),
    );
    compilation.assets[output] = {
      source: () => Buffer.from(result),
      size: () => Buffer.byteLength(result),
    };
  });
};

function format(assets, path) {
  return `
fx_version 'cerulean'

author 'ReactCore Framework Project | Roswell (Roswell#0002)'
description 'ReactCore |'
version '1.0.0.0'
url 'https://www.reactcorefw.com'

game 'gta5'

ui_page 'ui/${path}/index.html'

files {
  ${assets.map(asset => `'ui/${path}/${asset}'`).join(`,
  `)}
}`;
}

module.exports = ResourceManifestPlugin;
