import './Intro.css'

const steps = [
  'You paste in some text.',
  'The AI model reads it and picks out the key ideas.',
  'It writes a shorter version for you.',
]

function Intro() {
  // Scroll smoothly to the input box instead of jumping straight there
  function scrollToInput() {
    document.getElementById('input-box').scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="intro">
      <h1>AI Text Summarizer</h1>
      <p className="tagline">Turn long text into a short summary in seconds.</p>

      <ol className="steps">
        {steps.map((step, index) => (
          <li key={index}>{step}</li>
        ))}
      </ol>

      <button type="button" className="start-button" onClick={scrollToInput}>
        Start summarizing
      </button>
    </section>
  )
}

export default Intro
