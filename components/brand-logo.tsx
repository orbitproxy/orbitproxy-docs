import Image from "next/image"

export function BrandLogo() {
  return (
    <span className="inline-flex items-center">
      <Image
        src="/logo.svg"
        alt="orbitproxy"
        width={120}
        height={24}
        priority
        style={{ width: "auto", height: 24 }}
      />
    </span>
  )
}