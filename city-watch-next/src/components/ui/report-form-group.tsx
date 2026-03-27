import type { ReactNode } from 'react'
import styles from '../../App.module.css'

type ReportFormGroupProps = {
  label: string
  htmlFor?: string
  children: ReactNode
}

export function ReportFormGroup({
  label,
  htmlFor,
  children,
}: ReportFormGroupProps) {
  return (
    <div className={styles.formGroup}>
      {htmlFor ? (
        <label htmlFor={htmlFor}>{label}</label>
      ) : (
        <label>{label}</label>
      )}
      {children}
    </div>
  )
}
