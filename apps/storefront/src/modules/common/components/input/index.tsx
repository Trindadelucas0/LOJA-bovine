import { Label } from "@modules/common/components/ui"
import React, { useId, useImperativeHandle, useState } from "react"

import Eye from "@modules/common/icons/eye"
import EyeOff from "@modules/common/icons/eye-off"

type InputProps = Omit<
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
  "placeholder"
> & {
  label: string
  errors?: Record<string, unknown>
  touched?: Record<string, unknown>
  name: string
  topLabel?: string
  hint?: string
  placeholder?: string
}

/**
 * Campo de texto com rotulo sempre visivel acima do campo.
 * O rotulo flutuante anterior sumia ao digitar, o que dificulta
 * o preenchimento para quem tem menos familiaridade com formularios.
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { type, name, label, errors, touched: _touched, required, topLabel, hint, placeholder, className, ...props },
    ref
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null)
    const [showPassword, setShowPassword] = useState(false)
    const generatedId = useId()
    const fieldId = props.id || `${name}-${generatedId}`
    const inputType = type === "password" && showPassword ? "text" : type
    const error = errors && name ? errors[name] : undefined
    const hintId = hint ? `${fieldId}-hint` : undefined
    const errorId = error ? `${fieldId}-error` : undefined

    useImperativeHandle(ref, () => inputRef.current!)

    return (
      <div className="flex flex-col w-full gap-1.5">
        {topLabel && <Label className="text-label-md text-ink">{topLabel}</Label>}
        <Label htmlFor={fieldId} className="text-label-md text-ink">
          {label}
          {required && <span className="text-danger"> *</span>}
        </Label>
        <div className="relative w-full">
          <input
            id={fieldId}
            type={inputType}
            name={name}
            placeholder={placeholder}
            required={required}
            aria-invalid={error ? true : undefined}
            aria-describedby={[errorId, hintId].filter(Boolean).join(" ") || undefined}
            className={`block w-full h-13 px-4 bg-card rounded-ava-md border text-body-lg text-ink placeholder:text-ink-muted appearance-none outline-none transition-colors ${
              error ? "border-danger" : "border-line-strong focus:border-brand"
            } ${type === "password" ? "pr-14" : ""} ${className || ""}`}
            {...props}
            ref={inputRef}
          />
          {type === "password" && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              className="absolute right-1 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-ava text-ink-soft hover:text-ink hover:bg-subtle transition-colors"
            >
              {showPassword ? <Eye /> : <EyeOff />}
            </button>
          )}
        </div>
        {hint && !error && (
          <span id={hintId} className="text-body-sm text-ink-soft">
            {hint}
          </span>
        )}
        {error ? (
          <span id={errorId} className="text-body-sm text-danger font-semibold">
            {String(error)}
          </span>
        ) : null}
      </div>
    )
  }
)

Input.displayName = "Input"

export default Input
