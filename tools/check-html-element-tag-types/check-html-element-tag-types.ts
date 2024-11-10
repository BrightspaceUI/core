/// <reference path="./check-html-element-helper.d.ts" />
/// <reference path="../../typings/mapping.ts" />

type Check<K extends HTMLElement> = K;
// This line fails if the mapping contains something that doesn't extend HTMLElement
type Test = Check<HTMLElementTagNameMap[keyof HTMLElementTagNameMap]>;
