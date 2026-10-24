import { useState } from 'react'
import Intro from './components/Intro.jsx'
import InputBox from './components/InputBox.jsx'
import LengthSelector from './components/LengthSelector.jsx'
import SummaryOutput from './components/SummaryOutput.jsx'
import HistoryPanel from './components/HistoryPanel.jsx'
import './App.css'

// Text must be at least this long before the AI can produce a useful summary
const MIN_TEXT_LENGTH = 100

function App() {
  const [text, setText] = useState('')
  const [length, setLength] = useState('Medium')

  const isTooShort = text.length < MIN_TEXT_LENGTH

  return (
    <main className="app">
      <Intro />
      <InputBox text={text} onTextChange={setText} />
      <LengthSelector length={length} onLengthChange={setLength} />
      <button type="button" className="summarize-button" disabled={isTooShort}>
        Summarize
      </button>
      <SummaryOutput />
      <HistoryPanel />
    </main>
  )
}

export default App
