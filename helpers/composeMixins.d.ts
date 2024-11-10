type F<P, R> = (p: P) => R;
type Constructor<T> = new (...args: any[]) => T;

export function composeMixins<T1>(b: T1): T1;
export function composeMixins<T1, R2, T2>(
	b: T1,
	f1: F<Constructor<any>, Constructor<R2> & T2>,
): T1 & Constructor<R2> & Pick<T2, keyof T2>;
export function composeMixins<T1, R2, T2, R3, T3>(
	b: T1,
	f1: F<Constructor<any>, Constructor<R2> & T2>,
	f2: F<Constructor<any>, Constructor<R3> & T3>,
): T1 & Constructor<R2> & Pick<T2, keyof T2> & Constructor<R3> & Pick<T3, keyof T3>;
export function composeMixins<T1, R2, T2, R3, T3, R4, T4>(
	b: T1,
	f1: F<Constructor<any>, Constructor<R2> & T2>,
	f2: F<Constructor<any>, Constructor<R3> & T3>,
	f3: F<Constructor<any>, Constructor<R4> & T4>,
): T1 &
	Constructor<R2> &
	Pick<T2, keyof T2> &
	Constructor<R3> &
	Pick<T3, keyof T3> &
	Constructor<R4> &
	Pick<T4, keyof T4>;
export function composeMixins<T1, R2, T2, R3, T3, R4, T4, R5, T5>(
	b: T1,
	f1: F<Constructor<any>, Constructor<R2> & T2>,
	f2: F<Constructor<any>, Constructor<R3> & T3>,
	f3: F<Constructor<any>, Constructor<R4> & T4>,
	f4: F<Constructor<any>, Constructor<R5> & T5>,
): T1 &
	Constructor<R2> &
	Pick<T2, keyof T2> &
	Constructor<R3> &
	Pick<T3, keyof T3> &
	Constructor<R4> &
	Pick<T4, keyof T4> &
	Constructor<R5> &
	Pick<T5, keyof T5>;
export function composeMixins<T1, R2, T2, R3, T3, R4, T4, R5, T5, R6, T6>(
	b: T1,
	f1: F<Constructor<any>, Constructor<R2> & T2>,
	f2: F<Constructor<any>, Constructor<R3> & T3>,
	f3: F<Constructor<any>, Constructor<R4> & T4>,
	f4: F<Constructor<any>, Constructor<R5> & T5>,
	f5: F<Constructor<any>, Constructor<R6> & T6>,
): T1 &
	Constructor<R2> &
	Pick<T2, keyof T2> &
	Constructor<R3> &
	Pick<T3, keyof T3> &
	Constructor<R4> &
	Pick<T4, keyof T4> &
	Constructor<R5> &
	Pick<T5, keyof T5> &
	Constructor<R6> &
	Pick<T6, keyof T6>;
export function composeMixins<T1, R2, T2, R3, T3, R4, T4, R5, T5, R6, T6, R7, T7>(
	b: T1,
	f1: F<Constructor<any>, Constructor<R2> & T2>,
	f2: F<Constructor<any>, Constructor<R3> & T3>,
	f3: F<Constructor<any>, Constructor<R4> & T4>,
	f4: F<Constructor<any>, Constructor<R5> & T5>,
	f5: F<Constructor<any>, Constructor<R6> & T6>,
	f6: F<Constructor<any>, Constructor<R7> & T7>,
): T1 &
	Constructor<R2> &
	Pick<T2, keyof T2> &
	Constructor<R3> &
	Pick<T3, keyof T3> &
	Constructor<R4> &
	Pick<T4, keyof T4> &
	Constructor<R5> &
	Pick<T5, keyof T5> &
	Constructor<R6> &
	Pick<T6, keyof T6> &
	Constructor<R7> &
	Pick<T7, keyof T7>;
export function composeMixins<T1, R2, T2, R3, T3, R4, T4, R5, T5, R6, T6, R7, T7, R8, T8>(
	b: T1,
	f1: F<Constructor<any>, Constructor<R2> & T2>,
	f2: F<Constructor<any>, Constructor<R3> & T3>,
	f3: F<Constructor<any>, Constructor<R4> & T4>,
	f4: F<Constructor<any>, Constructor<R5> & T5>,
	f5: F<Constructor<any>, Constructor<R6> & T6>,
	f6: F<Constructor<any>, Constructor<R7> & T7>,
	f7: F<Constructor<any>, Constructor<R8> & T8>,
): T1 &
	Constructor<R2> &
	Pick<T2, keyof T2> &
	Constructor<R3> &
	Pick<T3, keyof T3> &
	Constructor<R4> &
	Pick<T4, keyof T4> &
	Constructor<R5> &
	Pick<T5, keyof T5> &
	Constructor<R6> &
	Pick<T6, keyof T6> &
	Constructor<R7> &
	Pick<T7, keyof T7> &
	Constructor<R8> &
	Pick<T8, keyof T8>;
export function composeMixins<T1, R2, T2, R3, T3, R4, T4, R5, T5, R6, T6, R7, T7, R8, T8, R9, T9>(
	b: T1,
	f1: F<Constructor<any>, Constructor<R2> & T2>,
	f2: F<Constructor<any>, Constructor<R3> & T3>,
	f3: F<Constructor<any>, Constructor<R4> & T4>,
	f4: F<Constructor<any>, Constructor<R5> & T5>,
	f5: F<Constructor<any>, Constructor<R6> & T6>,
	f6: F<Constructor<any>, Constructor<R7> & T7>,
	f7: F<Constructor<any>, Constructor<R8> & T8>,
	f8: F<Constructor<any>, Constructor<R9> & T9>,
): T1 &
	Constructor<R2> &
	Pick<T2, keyof T2> &
	Constructor<R3> &
	Pick<T3, keyof T3> &
	Constructor<R4> &
	Pick<T4, keyof T4> &
	Constructor<R5> &
	Pick<T5, keyof T5> &
	Constructor<R6> &
	Pick<T6, keyof T6> &
	Constructor<R7> &
	Pick<T7, keyof T7> &
	Constructor<R8> &
	Pick<T8, keyof T8> &
	Constructor<R9> &
	Pick<T9, keyof T9>;
export function composeMixins<T1, R2, T2, R3, T3, R4, T4, R5, T5, R6, T6, R7, T7, R8, T8, R9, T9, R10, T10>(
	b: T1,
	f1: F<Constructor<any>, Constructor<R2> & T2>,
	f2: F<Constructor<any>, Constructor<R3> & T3>,
	f3: F<Constructor<any>, Constructor<R4> & T4>,
	f4: F<Constructor<any>, Constructor<R5> & T5>,
	f5: F<Constructor<any>, Constructor<R6> & T6>,
	f6: F<Constructor<any>, Constructor<R7> & T7>,
	f7: F<Constructor<any>, Constructor<R8> & T8>,
	f8: F<Constructor<any>, Constructor<R9> & T9>,
	f9: F<Constructor<any>, Constructor<R10> & T10>,
): T1 &
	Constructor<R2> &
	Pick<T2, keyof T2> &
	Constructor<R3> &
	Pick<T3, keyof T3> &
	Constructor<R4> &
	Pick<T4, keyof T4> &
	Constructor<R5> &
	Pick<T5, keyof T5> &
	Constructor<R6> &
	Pick<T6, keyof T6> &
	Constructor<R7> &
	Pick<T7, keyof T7> &
	Constructor<R8> &
	Pick<T8, keyof T8> &
	Constructor<R9> &
	Pick<T9, keyof T9> &
	Constructor<R10> &
	Pick<T10, keyof T10>;
