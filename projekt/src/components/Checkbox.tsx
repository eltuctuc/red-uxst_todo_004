import { useId } from 'react'
import './Checkbox.css'

interface CheckboxProps {
  checked: boolean
  label: string
  onChange: () => void
}

export function Checkbox({ checked, label, onChange }: CheckboxProps) {
  const id = useId()
  return (
    <label className="checkbox" htmlFor={id}>
      <input
        id={id}
        className="checkbox__input"
        type="checkbox"
        checked={checked}
        onChange={onChange}
      />
      {/* BUG-FEAT2-QA-005 fix: label text als visually-hidden Span statt aria-label auf Input */}
      <span className="checkbox__label-text">{label}</span>
      <span className={`checkbox__box${checked ? ' checkbox__box--checked' : ''}`} aria-hidden="true">
        {checked && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden="true">
            <path
              d="M1 4L3.5 6.5L9 1"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
    </label>
  )
}
