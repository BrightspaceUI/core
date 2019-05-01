const AWS = require('aws-sdk');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

let _s3Config = {
	bucket: 'visualdiff.gaudi.d2l',
	key: 'S3',
	target: 'visualdiff.gaudi.d2l/screenshots',
	region: 'ca-central-1',
	creds: {
		accessKeyId: process.env['S3ID'],
		secretAccessKey: process.env['S3KEY']
	}
};

class S3Helper {

	constructor(name, config, isCI) {
		if (config) _s3Config = Object.assign(_s3Config, config);
		if (isCI) this.currentConfig = Object.assign({}, _s3Config, { target: `${_s3Config.target}/${name}/${this.getTimestamp('-', '.')}`});
		if (isCI) this.goldenConfig = Object.assign({}, _s3Config, { target: `${_s3Config.target}/${name}/golden`});
		//if (isCI) this.goldenConfig = Object.assign({}, _s3Config, { target: `${_s3Config.target}/${name}/golden.macos`});
	}

	getCurrentObjectUrl(name) {
		return this.getObjectUrl(name, this.currentConfig);
	}

	getGoldenObjectUrl(name) {
		return this.getObjectUrl(name, this.goldenConfig);
	}

	getObjectUrl(name, config) {
		return `https://s3.${config.region}.amazonaws.com/${config.target}/${name}`;
	}

	deleteCurrentFile(filePath) {
		return this.deleteFile(filePath, this.currentConfig);
	}

	deleteGoldenFile(filePath) {
		return this.deleteFile(filePath, this.goldenConfig);
	}

	deleteFile(filePath, config) {
		const promise = new Promise((resolve, reject) => {

			const s3 = new AWS.S3({
				apiVersion: 'latest',
				accessKeyId: config.creds.accessKeyId,
				secretAccessKey: config.creds.secretAccessKey,
				region: config.region
			});

			const params = {Bucket: config.target, Key: path.basename(filePath)};

			s3.deleteObject(params, function(err, data) {
				if (err) {
					if (err.code === 'NoSuchKey') {
						resolve();
					} else {
						process.stdout.write(`\n${chalk.red(err)}`);
						reject(err);
					}
				}
				if (data) {
					resolve();
				}
			});

		});

		return promise;
	}

	getCurrentFile(filePath) {
		return this.getFile(filePath, this.currentConfig);
	}

	getGoldenFile(filePath) {
		return this.getFile(filePath, this.goldenConfig);
	}

	getFile(filePath, config) {
		const promise = new Promise((resolve, reject) => {

			const s3 = new AWS.S3({
				apiVersion: 'latest',
				accessKeyId: config.creds.accessKeyId,
				secretAccessKey: config.creds.secretAccessKey,
				region: config.region
			});

			const params = {Bucket: config.target, Key: path.basename(filePath)};

			s3.getObject(params, function(err, data) {
				if (err) {
					if (err.code === 'NoSuchKey') {
						resolve(false);
					} else {
						process.stdout.write(`\n${chalk.red(err)}`);
						reject(err);
					}
				}
				if (data) {
					fs.writeFileSync(filePath, data.Body);
					resolve(true);
				}
			});
		});

		return promise;
	}

	getCurrentFileList() {
		return this.getFileList(this.currentConfig);
	}

	getGoldenFileList() {
		return this.getFileList(this.goldenConfig);
	}

	getFileList(config) {
		const promise = new Promise((resolve, reject) => {

			const s3 = new AWS.S3({
				apiVersion: 'latest',
				accessKeyId: config.creds.accessKeyId,
				secretAccessKey: config.creds.secretAccessKey,
				region: config.region
			});

			const params = {
				Bucket: config.bucket,
				Prefix: `${config.target.replace(`${config.bucket}/`, '')}/`
			};

			s3.listObjectsV2(params, function(err, data) {
				if (err) {
					process.stdout.write(`\n${chalk.red(err)}`);
					reject(err);
				}
				if (data) {
					const files = [];
					for (let i = 0; i < data.Contents.length; i++) {
						const name = data.Contents[i].Key.replace(params.Prefix, '');
						if (name.length > 0) files.push(name);
					}
					resolve(files);
				}
			});

		});

		return promise;
	}

	getTimestamp(dateDelim, timeDelim) {
		dateDelim = dateDelim ? dateDelim : '-';
		timeDelim = timeDelim ? timeDelim : ':';
		const date = new Date();
		const year = date.getUTCFullYear();
		const month = date.getUTCMonth() + 1;
		const day = date.getUTCDate();
		const hours = date.getUTCHours();
		const minutes = date.getUTCMinutes();
		const seconds = date.getUTCSeconds();
		const milliseconds = date.getUTCMilliseconds();
		return year + dateDelim
			+ (month < 10 ? '0' + month : month) + dateDelim
			+ (day < 10 ? '0' + day : day) + ' '
			+ (hours < 10 ? '0' + hours : hours) + timeDelim
			+ (minutes < 10 ? '0' + minutes : minutes) + timeDelim
			+ (seconds < 10 ? '0' + seconds : seconds) + '.'
			+ milliseconds;
	}

	uploadCurrentFile(filePath) {
		return this.uploadFile(filePath, this.currentConfig);
	}

	uploadGoldenFile(filePath) {
		return this.uploadFile(filePath, this.goldenConfig);
	}

	uploadFile(filePath, config) {
		const promise = new Promise((resolve, reject) => {

			const getContentType = (filePath) => {
				if (filePath.endsWith('.html')) return 'text/html';
				if (filePath.endsWith('.png')) return 'image/png';
				return;
			};

			const s3 = new AWS.S3({
				apiVersion: 'latest',
				accessKeyId: config.creds.accessKeyId,
				secretAccessKey: config.creds.secretAccessKey,
				region: config.region
			});

			const params = {
				ACL: 'public-read',
				Body: '',
				Bucket: config.target,
				ContentDisposition: 'inline',
				ContentType: getContentType(filePath),
				Key: ''
			};

			const fileStream = fs.createReadStream(filePath);

			fileStream.on('error', function(err) {
				process.stdout.write(`\n${chalk.red(err)}`);
				reject(err);
			});
			params.Body = fileStream;
			params.Key = path.basename(filePath);

			s3.upload(params, function(err, data) {
				if (err) {
					process.stdout.write(`\n${chalk.red(err)}`);
					reject(err);
				}
				if (data) {
					resolve(data);
				}
			});

		});
		return promise;
	}

}

module.exports = S3Helper;
