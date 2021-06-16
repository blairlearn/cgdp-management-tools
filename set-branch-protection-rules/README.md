# Set up branch protection rules for an existing repository.

## Run

    node index.js <REPO_NAME>

Where `<REPO_NAME>` is an existing repository.

## Setup

1. Clone this repository
2. `npm install`
3. Create `config/local.json`
    1. `cp config/default.json config/local.json`
    2. Set `githubConnection.orgname` to the appropriate organization name.
    3. Set `githubConnection.apikey` to your API key.
    4. Set `user.name` to your actual name.
    5. Set `user.email` to an email address (recommend using the form `username@users.noreply.github.com`).

## Configuration

In `config/local.json`:

* Set `githubConnection.orgname` to the organization name.
* Set `githubConnection.apikey` to a valid API key.
* Each key in `rules` is the name of a property bag containing a list of restrictions to place on branches.
* Each key in `branches` is the name of a branch, paired with the named entry from `rules` to be applied to it.

See [`CreateBranchProtectionRuleInput`](https://docs.github.com/en/graphql/reference/input-objects#createbranchprotectionruleinput) for a list of restrictions which may be applied.