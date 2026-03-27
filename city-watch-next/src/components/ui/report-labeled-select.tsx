import { ReportFormGroup } from './report-form-group'

type ReportLabeledSelectProps = {
  id: string
  label: string
  options: readonly string[]
}

export function ReportLabeledSelect({
  id,
  label,
  options,
}: ReportLabeledSelectProps) {
  return (
    <ReportFormGroup label={label} htmlFor={id}>
      <select id={id} name={id}>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </ReportFormGroup>
  )
}
