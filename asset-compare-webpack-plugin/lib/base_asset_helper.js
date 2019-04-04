let getBaseAssetHelpers = (gist_id, git_access_token) => {
  let octokit = new Octokit({
    auth: git_access_token
  });

  let getBaseAssetData = () => {

  };

  let updateBaseAssetData = () => {

  };
};

const _ = require('lodash');
const Octokit = require('@octokit/rest');

class BaseAssetHelper {
  constructor(opts) {
    _.assign(this, {
      gist_id: opts.gist_id,
      octokit: new Octokit({
        auth: opts.github_access_token
      }),
      log: opts.log
    });
  }

  getContent() {
    return this.octokit.gists.get({
      gist_id: this.gist_id
    })
    .then((response) => {
      return JSON.parse(response.data.files['webpack-build-sizes.json'].content);
    })
    .catch((err) => {
      this.log(err, 'warning');
    })
  }

  updateContent(new_content) {
    return this.octokit.gists.update({
      gist_id: this.gist_id,
      description: "Update base branch asset sizes",
      files: {
        "webpack-build-sizes.json": {
          content: JSON.stringify(new_content)
        }
      }
    })
    .then(response => response)
    .catch((err) => {
      this.log(err, 'warning');
    })
  }

}
module.exports = BaseAssetHelper;