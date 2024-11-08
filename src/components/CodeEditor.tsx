import React, { useEffect, useRef } from 'react';
import { EditorView, basicSetup } from 'codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { autocompletion } from '@codemirror/autocomplete';
import {
  createDefaultMapFromCDN,
  createSystem,
  createVirtualTypeScriptEnvironment,
} from '@typescript/vfs';
import ts, { CompilerOptions } from 'typescript';
import { tsAutocomplete, tsFacet, tsHover, tsLinter, tsSync } from '@valtown/codemirror-ts';

// Utility function to add custom type declarations to the environment
function addCustomDeclarations(env: any) {
  env.createFile(
    'env.d.ts',
    `
    declare var Summit: {
      env: "biz" | "baz";
    };
    
    interface User {
  id: number;
  name: string;
      email: string;
    }
  `
  );

  env.createFile(
    '/foo.tsx',
    `export function foo(name: string) { return name; }`
  );

  env.createFile(
    '/constants.json',
    `{
      "name": "example-name",
      "isJson": true,
      "some": {
        "nested": {
          "data": [1, 2, 3]
        }
      }
    }`
  );
}

export const CodeEditor: React.FC = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const editorInstanceRef = useRef<EditorView | null>(null);

  useEffect(() => {
    // Guard clause to prevent multiple initializations
    if (editorInstanceRef.current || !editorRef.current) {
      return;
    }

    let mounted = true;

    const initializeEditor = async () => {
      try {
        // Set up TypeScript Virtual File System
        const fsMap = await createDefaultMapFromCDN(
          { target: ts.ScriptTarget.ES2022 },
          '3.7.3',
          true,
          ts
        );

        // Check if component is still mounted after async operation
        if (!mounted || !editorRef.current) {
          return;
        }

        const system = createSystem(fsMap);
        const compilerOpts: CompilerOptions = {
          jsx: ts.JsxEmit.ReactJSX,
          skipLibCheck: true,
          esModuleInterop: true,
          lib: ['dom', 'es2015'],
          allowSyntheticDefaultImports: true,
          forceConsistentCasingInFileNames: true,
          noFallthroughCasesInSwitch: true,
          module: ts.ModuleKind.ESNext,
          resolveJsonModule: true,
          noEmit: true,
        };

        const env = createVirtualTypeScriptEnvironment(system, [], ts, compilerOpts);
        addCustomDeclarations(env);

        const path = 'index.tsx';

        // Initialize the CodeMirror editor
        const editor = new EditorView({
          doc: `
// Sample interface declaration 

interface User {
  id: number;
  name: string;
  email: string;
}

// Function that uses the interface
function getUserInfo(user: User): string {
  return "User ID: " + user.id + ", Name: " + user.name + ", Email: " + user.email;
}

// Sample usage of the function
const user: User = {
  id: 1,
  name: "John Doe",
  email: "johndoe@example.com",
};
          `.trim(),
          extensions: [
            basicSetup,
            javascript({
              typescript: true,
              jsx: true,
            }),
            tsFacet.of({ env, path }),
            tsSync(),
            tsLinter(),
            autocompletion({
              override: [tsAutocomplete()],
            }),
            tsHover(),
          ],
          parent: editorRef.current,
        });

        editorInstanceRef.current = editor;
      } catch (error) {
        console.error('Failed to initialize editor:', error);
      }
    };

    initializeEditor();

    // Cleanup function
    return () => {
      mounted = false;
      if (editorInstanceRef.current) {
        editorInstanceRef.current.destroy();
        editorInstanceRef.current = null;
      }
    };
  }, []);

  return <div ref={editorRef} className="border border-gray-300 rounded-md p-4 min-h-[200px]" />;
};