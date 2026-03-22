export function Markdown({ html }: { html: string }) {
  return (
    <div
      className="editorial-prose"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
