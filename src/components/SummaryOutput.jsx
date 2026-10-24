import { useEffect, useState } from 'react'
import './SummaryOutput.css'

// Matches lines that start with "* " or "- " (the model's way of writing bullets)
const BULLET_PATTERN = /^[*-] /

// Splits the summary into blocks: runs of bullet lines become a list, and runs
// of normal lines become a paragraph. A blank line ends the current paragraph.
function splitIntoBlocks(summary) {
  const blocks = []

  for (const rawLine of summary.split('\n')) {
    const line = rawLine.trim()
    const lastBlock = blocks[blocks.length - 1]

    if (line === '') {
      // Push an empty marker so the next text line starts a new paragraph
      if (lastBlock && lastBlock.type !== 'break') {
        blocks.push({ type: 'break' })
      }
    } else if (BULLET_PATTERN.test(line)) {
      const item = line.replace(BULLET_PATTERN, '')
      if (lastBlock?.type === 'list') {
        lastBlock.items.push(item)
      } else {
        blocks.push({ type: 'list', items: [item] })
      }
    } else if (lastBlock?.type === 'text') {
      lastBlock.lines.push(line)
    } else {
      blocks.push({ type: 'text', lines: [line] })
    }
  }

  return blocks.filter((block) => block.type !== 'break')
}

function SummaryOutput({ summary }) {
  // 'idle' shows "Copy", 'copied' shows "Copied ✓", 'failed' shows an error label
  const [copyStatus, setCopyStatus] = useState('idle')

  // After a copy (or failed copy), switch the label back after 2 seconds.
  // The cleanup cancels the timer if the component disappears first.
  useEffect(() => {
    if (copyStatus === 'idle') {
      return
    }
    const timer = setTimeout(() => setCopyStatus('idle'), 2000)
    return () => clearTimeout(timer)
  }, [copyStatus])

  async function handleCopy() {
    // Swap "* " / "- " markers for "•" so the pasted text looks like a real list
    const cleanText = summary
      .split('\n')
      .map((line) => {
        const trimmed = line.trim()
        return BULLET_PATTERN.test(trimmed) ? trimmed.replace(BULLET_PATTERN, '• ') : line
      })
      .join('\n')

    try {
      await navigator.clipboard.writeText(cleanText)
      setCopyStatus('copied')
    } catch {
      // The clipboard can be blocked (e.g. permissions or a non-https page)
      setCopyStatus('failed')
    }
  }

  // Nothing to show until a summary arrives. This check comes after the hooks
  // because React needs hooks to run in the same order on every render.
  if (!summary) {
    return null
  }

  const blocks = splitIntoBlocks(summary)

  let copyLabel = 'Copy'
  if (copyStatus === 'copied') copyLabel = 'Copied ✓'
  if (copyStatus === 'failed') copyLabel = "Couldn't copy"

  return (
    <section className="summary-output">
      <div className="summary-output__header">
        <h2 className="summary-output__title">Summary</h2>
        <button type="button" className="summary-output__copy" onClick={handleCopy}>
          {copyLabel}
        </button>
      </div>
      {blocks.map((block, index) =>
        block.type === 'list' ? (
          <ul key={index} className="summary-output__list">
            {block.items.map((item, itemIndex) => (
              <li key={itemIndex}>{item}</li>
            ))}
          </ul>
        ) : (
          // Lines are joined with "\n"; the CSS keeps those line breaks visible
          <p key={index} className="summary-output__text">
            {block.lines.join('\n')}
          </p>
        ),
      )}
    </section>
  )
}

export default SummaryOutput
