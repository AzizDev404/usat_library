import Image from "next/image"
import Link from "next/link"
import DarkLogo from "/public/logo-icon.png"
import { Info, Locate, LocateFixed, LocateIcon, LocateOffIcon, Map, PhoneCall } from "lucide-react"
export default function Footer() {
  return (
    <footer className="bg-[#21466D] text-white py-10 mt-16 max-md:mb-10 max-md:mt-2">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 ">
        {/* Logo va nom */}
        <Link href="/" className="flex items-center space-x-2 max-md:w-full max-md:justify-start">
            <div className="w-[250px]  max-md:flex max-md:justify-center">
              <Image src={DarkLogo || "/placeholder.svg"} alt="Logo" className="w-full" />
            </div>
          </Link>

        {/* Foydali havolalar */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Havolalar</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-[#ffc82a]">Bosh sahifa</Link></li>
            <li><Link href="/" className="hover:text-[#ffc82a]">Kitoblar</Link></li>
            <li><Link href="/filter" className="hover:text-[#ffc82a]">Katalog</Link></li>
          </ul>
        </div>

        {/* Kontakt */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-10">
  {/* Matn qismi */}
  <div className="flex-1 flex flex-col gap-3">
    <h3 className="text-lg font-semibold">Kontakt</h3>
    <p className="text-sm text-white flex justify-start items-center gap-3"><Map/>USAT Universiteti, Toshkent, O'zbekiston</p>
    <p className="text-sm text-white flex justify-start items-center gap-3"><PhoneCall/>+998 (90) 123-45-67</p>
    <p className="text-sm text-white flex justify-start items-center gap-3"><Info/>info@usat.uz</p>
  </div>

  {/* Xarita qismi */}
  
</div>

      </div>
<div className="flex-1 container mx-auto my-10">
    <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d23995.830932484278!2d69.1568639923855!3d41.2549083285244!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae89998837c2dd%3A0x17a930c5c7d93e28!2sUniversity%20of%20Science%20and%20Technologies!5e0!3m2!1suz!2s!4v1751872009631!5m2!1suz!2s"
      width="100%"
      height="250"
      className="rounded-xl border-0 shadow-md w-full"
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    ></iframe>
  </div>
      {/* Pastki chiziq */}
      <div className="mt-10 text-center text-sm text-white border-t border-yellow-400 pt-4">
        © {new Date().getFullYear()} USAT Kutubxonasi. Barcha huquqlar himoyalangan.
      </div>
    </footer>
  )
}
