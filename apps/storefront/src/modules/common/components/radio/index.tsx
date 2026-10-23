const Radio = ({ checked, 'data-testid': dataTestId }: { checked: boolean, 'data-testid'?: string }) => {
  return (
    <>
      <button
        type="button"
        role="radio"
        aria-checked="true"
        data-state={checked ? "checked" : "unchecked"}
        className="group relative flex h-6 w-6 items-center justify-center outline-none tap-exempt"
        data-testid={dataTestId || 'radio-button'}
      >
        <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-line-strong bg-card transition-all group-hover:border-ink-soft group-data-[state=checked]:border-brand group-data-[state=checked]:bg-brand">
          {checked && (
            <span
              data-state={checked ? "checked" : "unchecked"}
              className="group flex items-center justify-center"
            >
              <div className="bg-white rounded-full h-2.5 w-2.5"></div>
            </span>
          )}
        </div>
      </button>
    </>
  )
}

export default Radio
