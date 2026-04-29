import * as ts from 'typescript';
import * as fs from 'fs';

const fileName = 'src/pages/Panel.tsx';
const content = fs.readFileSync(fileName, 'utf8');

const sourceFile = ts.createSourceFile(
    fileName,
    content,
    ts.ScriptTarget.Latest,
    true
);

function findUnmatched(node) {
    // We can just dump syntax errors.
    console.log("Errors: ", sourceFile.parseDiagnostics.map(d => d.messageText));
}
findUnmatched(sourceFile);
