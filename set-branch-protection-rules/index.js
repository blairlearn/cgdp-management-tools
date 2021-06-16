const config = require('config');
const { graphql } = require('@octokit/graphql');

const getArgs = require('./lib/get-args');


const octoql = graphql.defaults({
    headers: {
        authorization: `token ${config.githubConnection.apikey}`
    }
});

(async () => {

    try {

        const repoList = getArgs();
        if (repoList.length < 1) {
            throw {message: "You must specify a repo name."};
        }

        const repoName = repoList[0];


        // Get the repository ID.
        const { repository } = await octoql(`
            query getRepoID( $owner: String!, $repoName: String!) {
                repository(owner: $owner, name: $repoName) {
                    id
                }
            }
            `,
            {
                owner: config.githubConnection.orgname,
                repoName: repoName
            }
        );

        // Deliberately not taking advantage of async in order to enforce ordering.
        for (const branchPattern in config.branches) {

            const ruleName = config.branches[branchPattern];
            const restictions = {
                repositoryId: repository.id,
                pattern: branchPattern,
                ...config.rules[ruleName]
            }

            // Create the protection rule.
            await octoql(
                `
                    mutation($input: CreateBranchProtectionRuleInput!) {
                        createBranchProtectionRule(input: $input) {
                            branchProtectionRule {
                                id
                            }
                        }
                    }
                `,
                {
                    input: restictions
                }
            );
        }


    } catch (error) {
        console.error(error.message);
    }

})();

