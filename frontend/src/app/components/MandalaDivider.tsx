export default function MandalaDivider() {
  return (
    <div className="relative py-12">
      <div className="absolute left-0 right-0 flex justify-center">
        <div className="w-24 h-24 bg-[url('/mandala-divider.svg')] bg-contain bg-no-repeat opacity-30" />
      </div>
      <div className="border-t border-purple-100 w-full" />
    </div>
  )
}

