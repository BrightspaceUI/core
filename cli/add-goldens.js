const git = require('simple-git/promise')();

const remote = `https://${process.env.GITHUB_RELEASE_TOKEN}@github.com/BrightspaceUI/core`;
// const branchName = process.env.TRAVIS_BRANCH;
const branchName = 'travis-commit-experiment';

function commit() {

	git.addConfig('user.name', 'BrightspaceGitHubReader');
	git.addConfig('user.email', 'brightspacegithubreader@d2l.com');
	git.addConfig('push.default', 'simple');
	git.fetch(remote, branchName);
	git.checkout(branchName);

	console.log('Committing, tagging and pushing...');
	console.log(`also branch name is ${process.env.TRAVIS_BRANCH}`);
	console.group();

	const commitMessage = '[skip ci] test commit';
	return git.commit(commitMessage, 'new-file.txt')
		.then((status) => {
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
