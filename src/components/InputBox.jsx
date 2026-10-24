import './InputBox.css'

function InputBox({ text, onTextChange }) {
  return (
    <section id="input-box" className="input-box">
      <textarea
        className="input-box__textarea"
        placeholder="Paste your text here..."
        value={text}
        onChange={(event) => onTextChange(event.target.value)}
        rows={10}
      />
      <p className="input-box__count">{text.length} characters</p>
    </section>
  )
}

export default InputBox
