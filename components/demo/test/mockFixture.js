import { nextFrame, fixture as wcFixture } from '@open-wc/testing';
import { reset } from './mockReset.js';

/**
 * @param {*} node
 */
function getComposedChildren(node) {

	if (node?.nodeType !== Node.ELEMENT_NODE) {
		return [];
	}

	let nodes;
	const children = [];

	if (node.tagName === 'SLOT') {
		nodes = node.assignedNodes({ flatten: true });
	} else {
		if (node.shadowRoot) {
			node = node.shadowRoot;
		}
		nodes = node.children || node.childNodes;
	}

	for (let i = 0; i < nodes.length; i++) {
		if (nodes[i].nodeType === 1) {
			children.push(nodes[i]);
		}
	}

	return children;

}

/**
 * @param {*} elem
 * @param {boolean} awaitLoadingComplete
 */
async function waitForElem(elem, awaitLoadingComplete = true, indent = 0) {
	const now = new Date().getTime();
	if (!elem) return;
	let childTimes = [];

	const doWait = async() => {

		const update = elem.updateComplete;
		if (typeof update === 'object' && Promise.resolve(update) === update) {
			await update;
			if (indent === 0) console.log(new Date().getTime(), 'updateComplete');
			await nextFrame();
			if (indent === 0) console.log(new Date().getTime(), 'nextFrame');
		}

		if (awaitLoadingComplete && typeof elem.getLoadingComplete === 'function') {
			await elem.getLoadingComplete();
			if (indent === 0) console.log(new Date().getTime(), 'getLoadingComplete');
			await nextFrame();
			if (indent === 0) console.log(new Date().getTime(), 'nextFrame');
		}

		const children = getComposedChildren(elem);
		if (indent === 0) console.log(new Date().getTime(), 'getComposedChildren');
		childTimes = await Promise.all(children.map(e => waitForElem(e, awaitLoadingComplete, indent + 1)));

	};

	await new Promise((resolve) => {
		const observer = new MutationObserver((records) => {
			for (const record of records) {
				for (const removedNode of record.removedNodes) {
					if (removedNode === elem) {
						observer.disconnect();
						resolve();
						return;
					}
				}
			}
		});
		observer.observe(elem.parentNode, { childList: true });
		doWait()
			.then(() => observer.disconnect())
			.then(resolve);
	});
	const time = new Date().getTime() - now;
	if (time === 0) return '';
	childTimes = childTimes.filter(t => t);
	return `${'| '.repeat(indent)}${elem.tagName} (${time}ms):${childTimes.length ? '\n' : ''}${childTimes.join('\n')}`;

}

/**
 *
 * @param {*} element
 * @param {{
 *      awaitLoadingComplete: boolean,
 * 		lang: string,
 *		mathjax: {renderLatex: boolean},
 *		rtl: boolean,
 *		pagePadding: boolean,
 *		media: string,
 *      viewport: { height: number, width: number }
 *	}} opts
 */
export async function fixture(element, opts = {}) {
	await Promise.all([reset(opts), document.fonts.ready]);
	console.log(new Date().getTime(), 'reset');

	const parentNode = document.createElement('div');
	parentNode.setAttribute('id', 'd2l-test-fixture-container');

	const elem = await wcFixture(element, { parentNode });
	console.log(new Date().getTime(), 'wcFixture');
	await waitForElem(elem, opts.awaitLoadingComplete);
	console.log(new Date().getTime(), 'waitForElem');

	await pause();
	return elem;
}

async function pause() {
	const test = window.d2lTest || {};

	test.update?.();

	if (test.pause) {
		await test.pause;
		if (test.pause) test.pause = new Promise(r => test.run = r);
	}
}
