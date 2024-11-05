import React from 'react'
import {EditorView, basicSetup} from 'codemirror'
import {EditorState} from '@codemirror/state'
import {javascript} from '@codemirror/lang-javascript'
import {autocompletion, CompletionContext, CompletionResult} from '@codemirror/autocomplete'
import {HOME_TYPE_STRUCTURE, TypeStructure} from './jsTypes'



function createCompletions(context: CompletionContext): CompletionResult | null {
  const word = context.matchBefore(/[\w.]+\.[\w]*/)
  if (!word || !word.text.endsWith('.')) return null

  const parts = word.text.slice(0, -1).split('.')
  const prefix = parts[0].toLowerCase()
  
  if (prefix !== 'home') return null

  // Navigate through the nested structure
  let currentStructure = HOME_TYPE_STRUCTURE
  for (let i = 1; i < parts.length; i++) {
    const part = parts[i]
    if (currentStructure[part]?.properties) {
      currentStructure = currentStructure[part].properties!
    } else {
      return null
    }
  }

  return {
    from: word.from + word.text.length,
    options: Object.entries(currentStructure).map(([key, value]) => ({
      label: key,
      type: value.type === 'object' ? 'interface' : value.type,
      detail: getDetailString(value),
    })),
  }
}

function getDetailString(value: TypeStructure[string]): string {
  if (value.type === 'array') {
    return `${value.arrayType}[]`
  } else if (value.enum) {
    return `enum: ${value.enum.join(' | ')}`
  } else if (value.properties) {
    return 'object'
  }
  return value.type
}

// CodeEditor component
export const CodeEditor: React.FC = () => {
  const editorRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!editorRef.current) return

    const state = EditorState.create({
      doc: '// Type your home properties here\nhome.',
      extensions: [
        basicSetup,
        javascript({
          // jsx: true, 
          // typescript: true,
        }),
        autocompletion({
          override: [createCompletions],
        }),
      ],
    })

    const view = new EditorView({
      state,
      parent: editorRef.current,
    })

    return () => view.destroy()
  }, [])

  return <div ref={editorRef} className='border border-gray-300 rounded-md p-4 min-h-[200px]' />
}
