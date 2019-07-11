const git = require('simple-git/promise')(),
	spawn = require('child_process');

const remote = `https://${process.env.GITHUB_RELEASE_TOKEN}@github.com/BrightspaceUI/core`;
const branchName = process.env.TRAVIS_BRANCH;

function getIncrementType() {

	const commitMessage = process.env.TRAVIS_COMMIT_MESSAGE;

	let incrementType = 'none';
	if (commitMessage.indexOf('[increment patch]') > -1) {
		incrementType = 'patch';
	} else if (commitMessage.indexOf('[increment minor]') > -1) {
		incrementType = 'minor';
	} else if (commitMessage.indexOf('[increment major]') > -1) {
		incrementType = 'major';
	}

	return incrementType;

}

function updateVersion(incrementType) {

	console.log(`Incrementing ${incrementType} version.`);

	try {
		spawn.execSync(`npm version ${incrementType} --no-git-tag-version`);
	} catch (err) {
		console.error(err);
		return null;
	}

	let newVersion = require('../package.json').version;
	newVersion = `v${newVersion}`;
	console.log(`New version: ${newVersion}`);

	return newVersion;

}

function commit(newVersion) {

	git.addConfig('user.name', 'BrightspaceGitHubReader');
	git.addConfig('user.email', 'brightspacegithubreader@d2l.com');
	git.addConfig('push.default', 'simple');
	git.checkout(branchName);

	console.log('Committing, tagging and pushing...');
	console.group();

	const commitMessage = `[skip ci] Updated version to ${newVersion}`;
	return git.commit(commitMessage, 'package.json')
		.then((status) => {
			console.log(status);
			console.log('Committed. Tagging...');
			return git.addTag(newVersion);
		}).then(() => {
			console.log('Tagged. Pushing...');
			return git.push(remote, branchName);
		}).then(() => {
			console.log('Pushed. Pushing tags...');
			return git.pushTags(remote);
		});

}

console.log('Checking whether package.json version update is required...');
console.group();

const incrementType = getIncrementType();
if (incrementType === 'none') {
	console.log('No [increment major/minor/patch] found in commit message, skipping version update.');
	console.groupEnd();
	process.exit(1);
}

const newVersion = updateVersion(incrementType);
if (newVersion === null) {
	console.groupEnd();
	process.exit(1);
}

commit(newVersion)
	.then(() => {
		console.groupEnd();
		console.groupEnd();
		console.log('Version updated successfully.');
		process.exit(0);
	}).catch((err) => {
		console.error(err);
		console.groupEnd();
		process.exit(1);
	});
