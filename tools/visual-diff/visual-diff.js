const chalk = require('chalk');
const expect = require('chai').expect;
const pixelmatch = require('pixelmatch');
const PNG = require('pngjs').PNG;
const polyserve = require('polyserve');
const FileHelper = require('./file-helper.js');

const _isGoldenUpdate = process.argv.includes('--golden') ? process.argv.includes('--golden') : false;
const _isCI = process.env['CI'] ? true : false;
//const _isCI = true;
const _serverOptions = {npm: true, moduleResolution: 'node'};

let _server;
let _serverInfo;

before(async() => {
	_server = await polyserve.startServer(_serverOptions);
	const url = polyserve.getServerUrls(_serverOptions, _server).componentUrl;

	const baseUrl = `${url.protocol}://${url.hostname}:${url.port}/${url.pathname.replace(/\/$/, '')}`;
	_serverInfo = Object.assign({baseUrl: baseUrl}, url);
	process.stdout.write(`Started server with base: ${_serverInfo.baseUrl}\n\n`);
});

after(async() => {
	if (_server) {
		await _server.close();
		process.stdout.write('Stopped server.\n');
	}
});

class VisualDiff {

	constructor(name, dir, options) {

		this._results = [];
		this._fs = new FileHelper(name, `${dir ? dir : process.cwd()}/screenshots`, options ? options.upload : null, _isCI);
		this._dpr = options && options.dpr ? options.dpr : 2;

		let currentTarget, goldenTarget;

		before(async() => {
			currentTarget = this._fs.getCurrentTarget();
			goldenTarget = this._fs.getGoldenTarget();
			if (!_isCI) {
				currentTarget = currentTarget.replace(process.cwd(), '');
				goldenTarget = goldenTarget.replace(process.cwd(), '');
			}

			process.stdout.write(`\n${chalk.green('    Current:')} ${currentTarget}`);
			process.stdout.write(`\n${chalk.hex('#DCDCAA')('    Golden:')} ${goldenTarget}\n\n`);

			if (!_isGoldenUpdate) {
				// fail fast if no goldens
				const goldenFiles = await this._fs.getGoldenFiles();
				if (goldenFiles.length === 0) {
					process.stdout.write(`\n${chalk.hex('#DCDCAA')('No goldens!  Did you forget to generate them?')}\n${goldenTarget}\n\n`);
					process.exit(1);
				}
			}
		});

		after(async() => {
			if (_isGoldenUpdate) {
				await this._deleteGoldenOrphans();
			} else {
				await this._generateHtml('report.html', this._results);
				if (_isCI) {
					process.stdout.write(`\nResults: ${this._fs.getCurrentBaseUrl()}report.html\n`);
				} else {
					process.stdout.write(`\nResults: ${_serverInfo.baseUrl}${currentTarget}/report.html\n`);
				}
			}
		});

	}

	getBaseUrl() {
		return _serverInfo.baseUrl;
	}

	async getRect(page, selector, margin) {
		margin = (margin !== undefined) ? margin : 10;
		return page.$eval(selector, (elem, margin) => {
			return {
				x: elem.offsetLeft - margin,
				y: elem.offsetTop - margin,
				width: elem.offsetWidth + (margin * 2),
				height: elem.offsetHeight + (margin * 2)
			};
		}, margin);
	}

	async resetFocus(page) {
		await page.evaluate(() => {
			let elem = document.querySelector('#vd-focus');
			if (!elem) {
				elem = document.createElement('button');
				elem.id = 'vd-focus';
				elem.innerHTML = 'reset focus';
				elem.style.opacity = 0;
				document.body.insertBefore(elem, document.body.firstChild);
			}
		});
		await page.click('#vd-focus');
	}

	async screenshotAndCompare(page, name, options) {
		const info = Object.assign({path: this._fs.getCurrentPath(name)}, options);

		await page.screenshot(info);
		await this._fs.putCurrentFile(name);

		if (_isGoldenUpdate) return this._updateGolden(name);
		else await this._compare(name);
	}

	async _compare(name) {

		const currentImage = await this._fs.getCurrentImage(name);
		const goldenImage = await this._fs.getGoldenImage(name);
		let pixelsDiff;

		if (goldenImage && currentImage.width === goldenImage.width && currentImage.height === goldenImage.height) {
			const diff = new PNG({width: currentImage.width, height: currentImage.height});
			pixelsDiff = pixelmatch(
				currentImage.data, goldenImage.data, diff.data, currentImage.width, currentImage.height, {threshold: 0.1}
			);
			if (pixelsDiff !== 0) await this._fs.writeCurrentStream(`${name}-diff`, diff.pack());
		}

		this._results.push({
			name: name,
			current: { height: currentImage.height, width: currentImage.width },
			golden: goldenImage ? { height: goldenImage.height, width: goldenImage.width } : null,
			pixelsDiff: pixelsDiff
		});

		expect(goldenImage !== null, 'golden exists').equal(true);
		expect(currentImage.width, 'image widths are the same').equal(goldenImage.width);
		expect(currentImage.height, 'image heights are the same').equal(goldenImage.height);
		expect(pixelsDiff, 'number of different pixels').equal(0);

	}

	async _deleteGoldenOrphans() {

		process.stdout.write('\n      Removed orphaned goldens.\n');

		const currentFiles = this._fs.getCurrentFiles();
		const goldenFiles = await this._fs.getGoldenFiles();

		for (let i = 0; i < goldenFiles.length; i++) {
			const fileName = goldenFiles[i];
			if (!currentFiles.includes(fileName)) {
				await this._fs.removeGoldenFile(fileName);
				process.stdout.write(`      ${chalk.gray(fileName)}\n`);
			}
		}

		process.stdout.write('\n');

	}

	async _updateGolden(name) {

		const currentImage = await this._fs.getCurrentImage(name);
		const goldenImage = await this._fs.getGoldenImage(name);

		let updateGolden = false;
		if (!goldenImage) {
			updateGolden = true;
		} else if (currentImage.width !== goldenImage.width || currentImage.height !== goldenImage.height) {
			updateGolden = true;
		} else {
			const diff = new PNG({width: currentImage.width, height: currentImage.height});
			const pixelsDiff = pixelmatch(
				currentImage.data, goldenImage.data, diff.data, currentImage.width, currentImage.height, {threshold: 0.1}
			);
			if (pixelsDiff !== 0) updateGolden = true;
		}

		process.stdout.write('      ');
		if (updateGolden) {
			const result = await this._fs.updateGolden(name);
			if (result) process.stdout.write(chalk.gray('golden updated'));
			else process.stdout.write(chalk.gray('golden update failed'));
		} else {
			process.stdout.write(chalk.gray('golden already up to date'));
		}

	}

	async _generateHtml(fileName, results) {
		const createArtifactHtml = (name, meta, content) => {
			return `<div>
				<div class="label">${name} ${meta ? '(' : ''}${meta}${meta ? ')' : ''}</div>
				${content}
			</div>`;
		};
		const createImageHtml = (name, image, url) => {
			return createArtifactHtml(
				name,
				`w:${image.width / this._dpr} x h:${image.height / this._dpr}`,
				`<img src="${url}" style="width: ${image.width / this._dpr}px; height: ${image.height / this._dpr}px;" alt="${name}" />`
			);
		};
		const createNoImageHtml = (name, image, reason) => {
			return createArtifactHtml(name, '', `<div class="label" style="width: ${image.width / this._dpr}px;">${reason}</div>`);
		};
		const createCurrentHtml = (image, url) => {
			return createImageHtml('Current', image, url);
		};
		const createGoldenHtml = (image, url, defaultImage) => {
			if (image) return createImageHtml('Golden', image, url);
			else return createNoImageHtml('Golden', defaultImage, 'No golden.');
		};
		const createDiffHtml = (pixelsDiff, url, defaultImage) => {
			if (pixelsDiff === 0) {
				return createNoImageHtml('Difference (0px)', defaultImage, 'Images match.');
			} else if (pixelsDiff > 0) {
				return createArtifactHtml('Difference', `${pixelsDiff / this._dpr}px`, `<img src="${url}" style="width: ${defaultImage.width / this._dpr}px; height: ${defaultImage.height / this._dpr}px;" alt="Difference" />`);
			} else {
				return createNoImageHtml('Difference', defaultImage, 'No image.');
			}
		};
		const createMetaHtml = () => {
			if (!_isCI) return '';
			const branch = process.env['TRAVIS_BRANCH'];
			const sha = process.env['TRAVIS_COMMIT'];
			const message = process.env['TRAVIS_COMMIT_MESSAGE'];
			const url = process.env['TRAVIS_BUILD_WEB_URL'];
			const build = process.env['TRAVIS_BUILD_NUMBER'];
			return `
				<div class="meta">
					<div><a href="${url}">Build #${build}</a></div>
					<div>${branch} (${sha})</div>
					<div>${message}</div>
				</div>`;
		};
		const diffHtml = results.map((result) => {

			let goldenUrl = this._fs.getGoldenUrl(result.name);
			// the follow assumes golden directory is exactly ../../ relative to report
			goldenUrl = goldenUrl.startsWith('https://s3.') ? goldenUrl : `../../${goldenUrl}`;

			return `
				<h2>${result.name}</h2>
				<div class="compare">
					${createCurrentHtml(result.current, this._fs.getCurrentUrl(result.name))}
					${createGoldenHtml(result.golden, goldenUrl, result.current)}
					${createDiffHtml(result.pixelsDiff, this._fs.getCurrentUrl(`${result.name}-diff`), result.current)}
				</div>`;
		}).join('\n');

		const html = `
			<html>
				<head>
					<title>visual-diff</title>
					<style>
						html { font-size: 20px; }
						body { font-family: sans-serif; background-color: #333; color: #fff; margin: 18px; }
						h1 { font-size: 1.2rem; font-weight: 400; margin: 24px 0; }
						h2 { font-size: 0.9rem; font-weight: 400; margin: 30px 0 18px 0; }
						a { color: #006fbf; }
						.compare { display: flex; }
						.compare > div { margin: 0 18px; }
						.compare > div:first-child { margin: 0 18px 0 0; }
						.compare > div:last-child { margin: 0 0 0 18px; }
						.label { display: flex; font-size: 0.7rem; margin-bottom: 6px; }
						.meta { font-size: 0.7rem; margin-top: 24px; }
						.meta > div { margin-bottom: 3px; }
					</style>
				</head>
				<body>
					<h1>Visual-Diff</h1>${diffHtml}
					${createMetaHtml()}
				</body>
			</html>
		`;

		await this._fs.writeCurrentFile(fileName, html);
	}

}

module.exports = VisualDiff;
