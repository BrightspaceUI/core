import { css, html, LitElement, unsafeCSS } from 'lit';
import { getFlag } from '../../helpers/flags.js';

const OffSCREEN_SIZELESS = getFlag('d2l-offscreen-sizeless', true);
const HAS_DOCUMENT = globalThis.document !== undefined;

const offscreenSize = HAS_DOCUMENT && OffSCREEN_SIZELESS ? css`0` : css`1px`;
const documentDirection = !HAS_DOCUMENT ? css`var(--d2l-document-direction)`
							: css`var(--d2l-document-direction, ${document.dir === 'rtl' ? css`rtl` : css`ltr`})`;

/**
 * A private helper declarations that should not be used by general consumers
 */
export const _offscreenStyleDeclarations = css`
	direction: ${documentDirection}; /* stylelint-disable-line @stylistic/string-quotes */
	height: ${offscreenSize};
	inset-inline-start: -10000px;
	overflow: hidden;
	position: absolute !important;
	white-space: nowrap;
	width: ${offscreenSize};
	inset-inline-start: -10000px;
`;

export const offscreenStyles = css`
	.d2l-offscreen {
		${_offscreenStyleDeclarations}
	}
`;
