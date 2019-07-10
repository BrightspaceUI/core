const chalk = require('chalk'),
	git = require('simple-git/promise')(),
	spawn = require('child_process');

const remote = `https://${process.env.GITHUB_RELEASE_TOKEN}@github.com/BrightspaceUI/core`;

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

	console.log(chalk.blue(`Incrementing ${incrementType} version.`));

	try {
		spawn.execSync(`npm version ${incrementType} --no-git-tag-version`);
	} catch (err) {
		console.error(chalk.red(err));
		return null;
	}

	let newVersion = require('../package.json').version;
	newVersion = `v${newVersion}`;
	console.log(chalk.blue(`New version: ${newVersion}`));

	return newVersion;

}

function commit(newVersion) {

	git.addConfig('user.name', 'BrightspaceGitHubReader');
	git.addConfig('user.email', 'brightspacegithubreader@d2l.com');
	git.addConfig('push.default', 'simple');

	console.log(chalk.blue('Committing, tagging and pushing...'));
	const commitMessage = `[skip ci] Updated version to ${newVersion}`;
	return git.commit(commitMessage, 'package.json')
		.then(() => {
			git.addTag(newVersion);
		}).then(() => {
			git.push(remote, 'master');
		}).then(() => {
			git.pushTags(remote);
		}).then(() => {
			process.env.TRAVIS_TAG = newVersion;
		});

}

console.log(chalk.yellow('Checking whether package.json version update is required...'));
console.group();

if (process.env.TRAVIS_BRANCH !== 'master' || process.env.TRAVIS_PULL_REQUEST !== 'false') {
	console.log('Pull request or not on master branch, skipping version update.');
	console.groupEnd();
	process.exit(0);
}

const incrementType = getIncrementType();
if (incrementType === 'none') {
	console.log('No [increment major/minor/patch] found in commit message, skipping version update.');
	console.groupEnd();
	process.exit(0);
}

const newVersion = updateVersion(incrementType);
if (newVersion === null) {
	console.groupEnd();
	process.exit(1);
}

commit(newVersion)
	.then(() => {
		console.groupEnd();
		console.log(chalk.green('Version updated successfully.'));
		process.exit(0);
	}).catch((err) => {
		console.error(chalk.red(err));
		console.groupEnd();
		process.exit(1);
	});
