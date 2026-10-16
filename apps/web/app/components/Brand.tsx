import Image from 'next/image'
import Link from 'next/link'

export default function Brand() {
  return <Link href="/" className="brand" aria-label="Husie home">
    <Image src="/husie-logo.svg" alt="Husie logo" width={48} height={48} className="brand-mark" priority />
    <span className="brand-wordmark"><strong>HUSIE</strong></span>
  </Link>
}
