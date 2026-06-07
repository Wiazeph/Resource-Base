/**
 * The Studio renders its own full-viewport UI; it must not inherit the site
 * header/footer. This nested layout keeps it isolated from the marketing chrome.
 */
export default function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="h-screen">{children}</div>
}
