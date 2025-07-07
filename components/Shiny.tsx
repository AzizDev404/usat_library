import React from "react"

const ShinyButton = ({
  children,
  onClick,
  className = "",
  disabled = false,
}: {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  disabled?: boolean
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative inline-block px-6 py-3 rounded-md font-semibold 
        text-white bg-[#21466D] overflow-hidden 
        ${disabled ? "opacity-50 cursor-not-allowed" : "hover:text-white"}
        transition-all duration-300 ease-in-out
        ${className}
      `}
    >
      <span className="relative z-10">{children}</span>
      {!disabled && (
        <span
          className="absolute top-0 left-[-75%] w-[200%] h-full bg-gradient-to-r from-transparent via-white/60 to-transparent
          animate-shimmer"
        />
      )}
    </button>
  )
}

export default ShinyButton
