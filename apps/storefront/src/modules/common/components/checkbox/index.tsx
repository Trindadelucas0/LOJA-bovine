import { Checkbox, Label } from "@modules/common/components/ui"
import React from "react"

type CheckboxProps = {
  checked?: boolean
  onChange?: () => void
  label: string
  name?: string
  'data-testid'?: string
}

const CheckboxWithLabel: React.FC<CheckboxProps> = ({
  checked = true,
  onChange,
  label,
  name,
  'data-testid': dataTestId
}) => {
  return (
    <label htmlFor={name || "checkbox"} className="flex items-center gap-3 min-h-11 cursor-pointer select-none">
      <Checkbox
        className="h-6 w-6 shrink-0 rounded border-line-strong text-brand focus:ring-brand"
        id={name || "checkbox"}
        role="checkbox"
        checked={checked}
        readOnly
        aria-checked={checked}
        onClick={onChange}
        name={name}
        data-testid={dataTestId}
      />
      <Label className="text-body-md text-ink cursor-pointer">{label}</Label>
    </label>
  )
}

export default CheckboxWithLabel
