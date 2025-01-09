import { getComposedChildren } from '../dom.js';

export async function waitForElem(elem, predicate = () => true) {

	if (!elem) return;

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

}
