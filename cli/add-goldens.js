const git = require('simple-git/promise')();

const remote = `https://${process.env.GITHUB_RELEASE_TOKEN}@github.com/BrightspaceUI/core`;
// const branchName = process.env.TRAVIS_BRANCH;
const branchName = 'travis-commit-experiment';

function commit() {

	git.addConfig('user.name', 'BrightspaceGitHubReader');
	git.addConfig('user.email', 'brightspacegithubreader@d2l.com');
	git.addConfig('push.default', 'simple');

	console.log('Committing, tagging and pushing...');
	console.log(`also branch name is ${process.env.TRAVIS_BRANCH}`);
	console.group();

	return git.fetch(remote, branchName)
		.then(() => {
			console.log('Fetched branch...');
			return git.checkout(branchName);
		}).then(() => {
			console.log(`Checked out branch... ${process.env.TRAVIS_BRANCH}`);
			const commitMessage = '[skip ci] test commit';
			return git.commit(commitMessage, 'new-file.txt');
		}).then((status) => {
			console.log(status);
			console.log('Committed. Pushing...');
			return git.push(remote, branchName);
		});
}

commit()
	.then(() => {
		console.groupEnd();
		console.log('Committed successfully.');
		process.exit(0);
	}).catch((err) => {
		console.error(err);
		console.groupEnd();
		process.exit(1);
	});
