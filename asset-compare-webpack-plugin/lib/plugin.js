const _ = require('lodash');

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
      benchmark_branch: 'master',//The branch to benchmark asset sizes against
      current_branch: env.TRAVIS_BRANCH
    });
    console.log(env);

    //add check for env.travis
  }

  computeCurrentAssetSizes(stats) {
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

  apply(compiler) {
    var afterCompilation = (stats, callback) => {
      stats = stats.toJson();

      //if a pr does not exist against the current branch, exit
      if(stats.errors.length) {
        return;
      }

      let current_assets = this.computeCurrentAssetSizes(stats),
        base_assets;

      if(this.current_branch === this.benchmark_branch) {
        //update stats
      } else {
        base_assets = []//get base assets here
        //compare
        //update comment
      }
    }

    //if env.TRAVIS === 'true'
    if(true) {
      if (compiler.hooks) {
        const pluginOptions = {
          name: 'AssetComparePlugin',
          stage: Infinity
        };
        compiler.hooks.done.tapAsync(pluginOptions, afterCompilation);
      } else {
        console.warn('Asset Compare Plugin is only supported with webpack4 !!');
      }
    }
  }
}

module.exports = AssetComparePlugin;