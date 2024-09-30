"use client"

import Link from "next/link"
import {
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenu,
  navigationMenuTriggerStyle,
} from "../ui/navigation-menu"
import { MenuIcon } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "../ui/sheet"

export default function Navbar() {
  return (
    <header className="sticky top-0 bg-white shadow-sm ">
      <nav className="hidden md:flex justify-between items-center p-4 max-w-[1500px] mx-auto rounded-full">
        <ul className="flex items-center gap-12 px-4 py-2">
          <Link href="/">
            <img className="w-24" src="/logo.png" />
          </Link>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/pricing" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Pricing
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/blog" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Blog
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/faqs" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    FAQs
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </ul>
        <Link href="/auth/signup">
          <div className="border shadow-lg border-black px-4 p-2 rounded-full font-light text-md cursor-pointer bg-blue-500 text-white">
            Get started for free
          </div>
        </Link>
      </nav>
      <nav className="md:hidden flex justify-between items-center p-4 max-w-[1500px] mx-auto rounded-full">
        <Link href="/">
          <img className="w-24" src="/logo.png" />
        </Link>
        <Sheet>
          <SheetTrigger asChild>
            <MenuIcon />
          </SheetTrigger>
          <SheetContent className="flex flex-col">
            <SheetHeader className="items-center">
              <Link href="/">
                <img className="w-24" src="/logo.png" />
              </Link>
            </SheetHeader>
            <div className="flex flex-col items-center justify-center gap-4 h-full">
              <Link href="/pricing">Pricing</Link>
              <Link href="/blog">Blog</Link>
              <Link href="/faqs">FAQs</Link>
              <Link href="/auth/signup">
                <div className="border shadow-lg border-black px-4 p-2 rounded-full font-light text-md cursor-pointer bg-blue-500 text-white">
                  Get started for free
                </div>
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  )
}
