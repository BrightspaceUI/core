import { css } from 'lit';
import { getFlag } from '../../helpers/flags.js';

const OffSCREEN_SIZELESS = getFlag('d2l-offscreen-sizeless', true);
const HAS_DOCUMENT = globalThis.document !== undefined;

/**
 * A private helper declarations that should not be used by general consumers
 */
export const _offscreenStyleDeclarations = css`
	direction: var(--d2l-document-direction, ${ !HAS_DOCUMENT ? css`unset` : (document.dir === 'rtl' ? css`rtl` : css`ltr`)}); /* stylelint-disable-line @stylistic/string-quotes */
	height: ${HAS_DOCUMENT && OffSCREEN_SIZELESS ? 0 : 1}px; /* The HAS_DOCUMENT check can be removed once the d2l-offscreen-sizeless flag is removed and set to 0px */
	inset-inline-start: -10000px;
	overflow: hidden;
	position: absolute !important;
	white-space: nowrap;
	width: ${HAS_DOCUMENT && OffSCREEN_SIZELESS ? 0 : 1}px; /* The HAS_DOCUMENT check can be removed once the d2l-offscreen-sizeless flag is removed and set to 0px */
`;

export const offscreenStyles = css`
	.d2l-offscreen {
		${_offscreenStyleDeclarations}
	}
`;
