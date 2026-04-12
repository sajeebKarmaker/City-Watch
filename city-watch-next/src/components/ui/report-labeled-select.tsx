import { ReportFormGroup } from './report-form-group'

type ReportLabeledSelectProps = {
  id: string
  label: string
  options: readonly string[]
  value?: string
  onChange?: (value: string) => void
}

export function ReportLabeledSelect({
  id,
  label,
  options,
  value,
  onChange,
}: ReportLabeledSelectProps) {
  return (
    <ReportFormGroup label={label} htmlFor={id}>
      <select
        id={id}
        name={id}
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </ReportFormGroup>
  )
}
