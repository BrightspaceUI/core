/**
 * Creates a `srcset` string from a Siren organization-image entity to
 * be used with an <img> tag.
 * @param {Entity} image Siren organization image entity. Must be a hydrated entity (not a linked entity).
 * @param {string} imageClass Class used to find correct organization image links. Defaults to `tile`.
 * @param {bool} forceImageRefresh If true, generated URLs will include a cache-busting timestamp
 * @return {string} `srcset` to be used with an <img> tag.
 */
export function getImageSrcset(image, imageClass, forceImageRefresh) {
	if (!image || image.href) {
		return;
	}

	let srcset = '',
		separator,
		forceRefreshParam = '';
	const imageWidths = {
			tile: {
				lowMin: 145, lowMid: 220, lowMax: 540,
				highMin: 290, highMid: 440, highMax: 1080
			},
			narrow: {
				lowMin: 320, lowMid: 375, lowMax: 767,
				highMin: 640, highMid: 750, highMax: 1534
			}
		},
		selectedWidths = imageWidths[imageClass] || imageWidths.narrow,
		dateTimeString = forceImageRefresh ? new Date().getTime() : '';

	const sizes = getBestImageLinks(image, imageClass);
	if (!sizes) {
		return;
	}

	['lowMin', 'lowMid', 'lowMax', 'highMin', 'highMid', 'highMax'].forEach((size) => {
		if (sizes[size]) {
			if (forceImageRefresh) {
				separator = sizes[size].split('?')[1] ? '&' : '?';
				forceRefreshParam = `${separator}timestamp=${dateTimeString}`;
			}
			srcset += `${sizes[size]}${forceRefreshParam} ${selectedWidths[size]}w, `;
		}
	});
	return srcset.replace(/,\s*$/, '');
}

/**
 * Gets the link to the image entity with the given `imageClass` class
 * Defaults to the image entity with the `tile` class if `imageClass`
 * is not provided.
 * @param {Entity} image Siren organization-image entity. Must be a hydrated entity (not a linked entity).
 * @param {string} imageClass Class used to find correct organization image link. Defaults to `tile`.
 * @return {string} URL of image with the requested `imageClass`.
 */
export function getDefaultImageLink(image, imageClass) {
	if (!image || image.href) {
		return;
	}

	const sizes = getBestImageLinks(image, imageClass);
	if (!sizes) {
		return;
	}
	return sizes.highMax || sizes.lowMax || sizes.highMid || sizes.lowMid || sizes.highMin || sizes.lowMin;
}

export function getBestImageLinks(image, imageClass) {
	const linksByType = _getImageLinks(image, imageClass);

	const jpegLinks = linksByType['image/jpeg'];
	if (jpegLinks) {
		return jpegLinks;
	}

	for (const type in linksByType) {
		return linksByType[type];
	}
}

function _getImageLinks(image, imageClass) {
	const imageLinks = image.getLinksByClass(imageClass || 'tile'),
		sizesByType = {};
	imageLinks.forEach((link) => {
		const sizes = sizesByType[link.type] = sizesByType[link.type] || {};
		const size = link.hasClass('min') && 'Min' || link.hasClass('mid') && 'Mid' || link.hasClass('max') && 'Max',
			density = link.hasClass('high-density') ? 'high' : 'low';
		sizes[density + size] = link.href;
	});
	return sizesByType;
}
