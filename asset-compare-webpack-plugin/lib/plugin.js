const _ = require('lodash');
const BaseAssetHelper = require('./base_asset_helper');

//Remove this later
_.assign(process.env, {
  TRAVIS: 'true',
  TRAVIS_REPO_SLUG: 'supriya-raj/hello-world',
  TRAVIS_BRANCH: 'master'
});
//

const IGNORE_EXTENSIONS = /^(gz|map|jpe?g|png|gif|svg|woff2?|ico|ttf|eot|json)$/i;
const env = process.env;

var shouldIgnoreFile = function(str) {
  str = str.replace(/\?.*/, '');
  var split = str.split('.');
  var ext = split.pop();
  return IGNORE_EXTENSIONS.test(ext);
};
var getDisplayableFileSize = function(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

class AssetComparePlugin {
  constructor(opts) {
    _.assign(this, {
      github_access_token: null,
      user: null,
      repo: null,
      current_branch: null,
      base_branch: 'master',//The branch to benchmark asset sizes against
      gist_id: null,
      compilation: null
    });

    if(env.TRAVIS === 'true') {
      let repo_slug = env.TRAVIS_REPO_SLUG.split('/'),
        user = repo_slug[0],
        repo = repo_slug.slice(1).join('/');

      _.assign(this, {
        current_branch: env.TRAVIS_BRANCH,
        user,
        repo,
        github_access_token: env.GITHUB_ACCESS_TOKEN
      })
    }

    _.assign(this, opts);
  }

  log(message, type = 'info') {
    let _logger = console.log;
    //compilation instance available
    if(this.compilation) {
      if(type === 'warning') {
        _logger = compilation.warnings.push;
      } else if(type === 'error') {
        _logger = compilation.errors.push;
      }
    } else if(type === 'warning') {
      _logger = console.warn;
    } else if(type === 'error') {
      _logger = console.error;
    }

    _logger('Asset Compare Plugin:'+ message);
  }

  _computeCurrentAssetSizes(stats) {
    return stats.assets.reduce((assets, asset) => {
      if(!shouldIgnoreFile(asset.name)) {
        assets.push({
          name: asset.chunkNames.join(' ') || asset.name,
          display_size: getDisplayableFileSize(asset.size),
          size: asset.size
        });
      };
      return assets;
    }, []);
  }

  _afterCompilation(stats, callback) {
    this.compilation = stats.compilation;
    stats = stats.toJson();

    if(stats.errors.length) {
      this.log('There are errors present in your compilation. Aborting!', 'warning');
      return;
    }

    let current_assets,
      base_assets,
      base_asset_helper = new BaseAssetHelper({
        github_access_token: this.github_access_token,
        gist_id: this.gist_id,
        log: this.log.bind(this)
      }),
      current_asset_helper = null;
        //       user: this.user,
        // repo: this.repo,
        // github_access_token: this.github_access_token,
        // branch: this.base_branch,
        // log: this.log

    current_assets = this._computeCurrentAssetSizes(stats);

    if(this.current_branch === this.base_branch) {
      base_asset_helper.updateContent(current_assets).then(callback);
    } else {
      base_assets = []//get base assets here
      //compare
      //update comment
    }
  }

  apply(compiler) {
    if(env.TRAVIS !== 'true') {
      //exit silently
      return;
    }

    if(!this.user || !this.repo || !this.current_branch || !this.github_access_token || !this.gist_id){
      this.log("One or more required github parameters are missing. Aborting!", "warning");
      return;
    };

    if (compiler.hooks) {
      const pluginOptions = {
        name: 'AssetComparePlugin',
        stage: Infinity
      };
      compiler.hooks.done.tapAsync(pluginOptions, this._afterCompilation.bind(this));
    } else {
      this.log('Asset Compare Plugin is only supported with webpack4 !!', 'warning');
    }
  }
}

module.exports = AssetComparePlugin;