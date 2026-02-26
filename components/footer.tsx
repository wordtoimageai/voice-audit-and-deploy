import Link from "next/link"

const FOOTER_LINKS = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Changelog", href: "/changelog" },
    { label: "Roadmap", href: "/roadmap" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "Press", href: "/press" },
  ],
  Support: [
    { label: "Documentation", href: "/docs" },
    { label: "Community", href: "/community" },
    { label: "Contact", href: "#contact" },
    { label: "Status", href: "/status" },
  ],
  Legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    { label: "Cookies", href: "/cookies" },
    { label: "Licenses", href: "/licenses" },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-5">
          {/* Brand */}
          <div className="md:col-span-1 flex flex-col gap-4">
            <Link
              href="/"
              className="text-sm font-bold tracking-tight text-foreground w-fit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            >
              my-app
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground">
              The complete platform to build and ship production-grade web
              applications.
            </p>
          </div>

          {/* Links */}
          <div className="md:col-span-4 grid grid-cols-2 gap-8 sm:grid-cols-4">
            {Object.entries(FOOTER_LINKS).map(([category, links]) => (
              <div key={category} className="flex flex-col gap-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-foreground">
                  {category}
                </p>
                <ul className="flex flex-col gap-2.5">
                  {links.map(({ label, href }) => (
                    <li key={label}>
                      {href.startsWith("#") ? (
                        <a
                          href={href}
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                        >
                          {label}
                        </a>
                      ) : (
                        <Link
                          href={href}
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                        >
                          {label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} my-app. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built with Next.js 16 and deployed on Vercel.
          </p>
        </div>
      </div>
    </footer>
  )
}
