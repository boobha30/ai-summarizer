import { useState } from 'react'
import Intro from './components/Intro.jsx'
import InputBox from './components/InputBox.jsx'
import LengthSelector from './components/LengthSelector.jsx'
import ErrorMessage from './components/ErrorMessage.jsx'
import SummaryOutput from './components/SummaryOutput.jsx'
import HistoryPanel from './components/HistoryPanel.jsx'
import useHistory from './hooks/useHistory.js'
import countWords from './utils/countWords.js'
import './App.css'

// Text must be at least this long before the AI can produce a useful summary
const MIN_TEXT_LENGTH = 100

function App() {
  const [text, setText] = useState('')
  const [length, setLength] = useState('Medium')
  const [summary, setSummary] = useState('')
  // Word count of the text that produced the current summary (for the stat line)
  const [originalWordCount, setOriginalWordCount] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const { history, addEntry, clearHistory } = useHistory()

  const isTooShort = text.length < MIN_TEXT_LENGTH

  async function handleSummarize() {
    setIsLoading(true)
    // Clear the previous result so an old summary isn't shown next to a new error
    setError('')
    setSummary('')

    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        // Tells the server the body is JSON so it can parse it into req.body
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, length }),
      })

      // If the server isn't running the API (e.g. plain `npm run dev`), the
      // reply may not be JSON at all, so fall back to an empty object
      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        setError(data.error ?? 'Something went wrong. Please try again.')
        return
      }

      if (!data.summary) {
        setError('The summary came back empty. Please try again.')
        return
      }

      setSummary(data.summary)
      setOriginalWordCount(countWords(text))
      addEntry({ text, length, summary: data.summary })
    } catch {
      // fetch only throws when the request never reaches the server
      setError('Could not reach the server. Check your connection and try again.')
    } finally {
      // Runs after success, error, or an early return, so the button always re-enables
      setIsLoading(false)
    }
  }

  // Show a saved summary again; clear any error so it doesn't sit next to it
  function handleSelectHistory(entry) {
    setError('')
    setSummary(entry.summary)
    // Entries saved before word counts were added don't have one; the stat is then hidden
    setOriginalWordCount(entry.originalWordCount ?? null)
  }

  return (
    <main className="app">
      <Intro />
      <InputBox text={text} onTextChange={setText} />
      <LengthSelector length={length} onLengthChange={setLength} />
      <div className="actions">
        <button
          type="button"
          className="summarize-button"
          disabled={isTooShort || isLoading}
          onClick={handleSummarize}
        >
          {isLoading ? 'Summarizing…' : 'Summarize'}
        </button>
        <button
          type="button"
          className="history-button"
          // Lets screen readers know whether the panel is currently open
          aria-expanded={isHistoryOpen}
          onClick={() => setIsHistoryOpen(!isHistoryOpen)}
        >
          {isHistoryOpen ? 'Hide history' : 'History'}
        </button>
      </div>
      <ErrorMessage message={error} />
      <SummaryOutput summary={summary} originalWordCount={originalWordCount} />
      {isHistoryOpen && (
        <HistoryPanel
          history={history}
          onSelect={handleSelectHistory}
          onClear={clearHistory}
        />
      )}
    </main>
  )
}

export default App
