#!/bin/sh

FILES=`egrep --include="*.js" --exclude-dir="node_modules" --exclude-dir="test" -lR "customElements.define" * | xargs egrep -L 'export class.*Test.* extends'`

FILES_WITH_TYPEDEF=`egrep -l "@typedef.*Exported" $FILES`
FILES_WITH_EXPORT=`egrep -l "export class.*" $FILES`

echo "/** Generated from {@link ../tools/create-mapping.sh} */" > ./typings/mapping.d.ts
echo "import { LitElement } from 'lit';" >> ./typings/mapping.d.ts
echo "declare global {" >> ./typings/mapping.d.ts
echo "	interface HTMLElementTagNameMap {" >> ./typings/mapping.d.ts
if [ "x$FILES_WITH_TYPEDEF" != "x" ]
then
    echo "		// Components with @typedef exports" >> ./typings/mapping.d.ts
    egrep -oR "customElements.define\(['\"].*\)" $FILES_WITH_TYPEDEF | sed -r "s/(.*):customElements\.define\((.*),\s*(.*)\)/		\2: import('..\/\1').\3Exported;/" >> ./typings/mapping.d.ts
fi
if [ "x$FILES_WITH_EXPORT" != "x" ]
then
    echo "		// Components with export class...extends LitElement" >> ./typings/mapping.d.ts
    egrep -oR "customElements.define\(['\"].*\)" $FILES_WITH_EXPORT | sed -r "s/(.*):customElements\.define\((.*),\s*(.*)\)/		\2: import('..\/\1').\3;/" >> ./typings/mapping.d.ts
fi
echo "	}" >> ./typings/mapping.d.ts
echo "}" >> ./typings/mapping.d.ts
