/** Silhueta do cartao de produto real (AvaProductCard). */
const SkeletonProductPreview = () => {
  return (
    <div className="card-surface p-2.5 small:p-4 animate-pulse">
      <div className="aspect-square rounded-ava-md bg-subtle mb-3" />
      <div className="h-3 w-1/2 bg-subtle rounded mb-2" />
      <div className="h-4 bg-subtle rounded mb-1.5" />
      <div className="h-4 w-2/3 bg-subtle rounded mb-4" />
      <div className="h-7 w-1/2 bg-subtle rounded mb-3" />
      <div className="h-12 bg-subtle rounded-ava-md" />
    </div>
  )
}

export default SkeletonProductPreview
