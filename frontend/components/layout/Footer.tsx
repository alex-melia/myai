import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t p-12">
      <div className="container flex flex-col gap-12 md:grid grid-cols-4 place-items-center">
        <Link href="/">
          <img className="w-24" src="/logo.png" />
        </Link>
        <div className="flex flex-col items-center gap-2">
          <p className="font-bold mb-4">Company</p>
          <Link href="/pricing">Pricing</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/faqs">FAQs</Link>
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="font-bold mb-4">Support</p>
          <Link href="mailto:alexmelia41@gmail.com">Contact Us</Link>
          <Link href="/tocs">Terms & Conditions</Link>
          <Link href="/privacy-policy">Privacy Policy</Link>
        </div>
        <p className="font-bold">&copy; MyAI.bio</p>
      </div>
    </footer>
  )
}
