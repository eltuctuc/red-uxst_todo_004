import './Checkbox.css'

interface CheckboxProps {
  checked: boolean
  label: string
  onChange: () => void
}

export function Checkbox({ checked, label, onChange }: CheckboxProps) {
  return (
    <label className="checkbox">
      <input
        className="checkbox__input"
        type="checkbox"
        checked={checked}
        aria-label={label}
        onChange={onChange}
      />
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
