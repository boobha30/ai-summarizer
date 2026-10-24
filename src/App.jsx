import Intro from './components/Intro.jsx'
import InputBox from './components/InputBox.jsx'
import LengthSelector from './components/LengthSelector.jsx'
import SummaryOutput from './components/SummaryOutput.jsx'
import HistoryPanel from './components/HistoryPanel.jsx'
import './App.css'

function App() {
  return (
    <main className="app">
      <Intro />
      <InputBox />
      <LengthSelector />
      <SummaryOutput />
      <HistoryPanel />
    </main>
  )
}

export default App
