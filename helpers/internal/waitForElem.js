import { getComposedChildren } from '../dom.js';

export async function waitForElem(elem, predicate = () => true) {

	if (!elem || !elem.parentNode) return;

	const doWait = async() => {

		const update = elem.updateComplete;
		if (typeof update === 'object' && Promise.resolve(update) === update) {
			await update;
			await new Promise(resolve => {
				requestAnimationFrame(() => resolve());
			});
		}

		if (typeof elem.getLoadingComplete === 'function') {
			await elem.getLoadingComplete();
			await new Promise(resolve => {
				requestAnimationFrame(() => resolve());
			});
		}

		const children = getComposedChildren(elem, predicate);
		await Promise.all(children.map(e => waitForElem(e, predicate)));
	};

	await doWait();
}
