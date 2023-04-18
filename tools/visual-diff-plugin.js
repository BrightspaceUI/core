
import { access, constants, stat } from 'node:fs/promises';
import { dirname, join } from 'path';
import { env } from 'node:process';

const isCI = !!env['CI'];
const ciDir = isCI ? 'ci' : '';
const DEFAULT_MARGIN = 10;

async function checkFileExists(fileName) {
	try {
		await access(fileName, constants.F_OK);
		return true;
	} catch (e) {
		return false;
	}
}

function extractTestPartsFromName(name) {
	name = name.toLowerCase();
	const parts = name.split(' ');
	if (parts.length > 1) {
		let dirName = parts.shift();
		if (dirName.startsWith('d2l-')) {
			dirName = dirName.substring(4);
		}
		return {
			dir: dirName,
			newName: parts.join('-')
		};
	}
	return {
		dir: '',
		newName: parts.join('-')
	};
}

export function visualDiff() {
	return {
		name: 'brightspace-visual-diff',
		async executeCommand({ command, payload, session }) {

			if (command !== 'brightspace-visual-diff') {
				return;
			}
			if (session.browser.type !== 'playwright') {
				throw new Error('Visual-diff is only supported for browser type Playwright');
			}

			const browser = session.browser.name.toLowerCase();
			const { dir, newName } = extractTestPartsFromName(payload.name);
			const goldenFileName = `${join(dirname(session.testFile), 'screenshots', ciDir, 'golden', browser, dir, newName)}.png`;
			const currentFileName = `${join(dirname(session.testFile), 'screenshots', ciDir, 'current', browser, dir, newName)}.png`;

			const opts = payload.opts || {};
			opts.margin = opts.margin || DEFAULT_MARGIN;

			const page = session.browser.getPage(session.id);
			await page.screenshot({
				animations: 'disabled',
				clip: {
					x: payload.rect.x - opts.margin,
					y: payload.rect.y - opts.margin,
					width: payload.rect.width + (opts.margin * 2),
					height: payload.rect.height + (opts.margin * 2)
				},
				path: currentFileName
			});

			const goldenExists = await checkFileExists(goldenFileName);
			if (!goldenExists) {
				//return { pass: false, message: 'No golden exists' };
				return { pass: true };
			}

			const currentInfo = await stat(currentFileName);
			const goldenInfo = await stat(goldenFileName);

			// TODO: obviously this isn't how to diff against, the golden! Use pixelmatch here.
			const same = (currentInfo.size === goldenInfo.size);

			return { pass: same, message: 'Does not match golden' };

		}
	};
}
