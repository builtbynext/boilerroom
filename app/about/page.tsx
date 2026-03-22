export default function AboutPage() {
  return (
    <div className="grid min-h-screen border-line lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:border-l">
      <section className="border-line px-6 py-12 sm:px-10 lg:border-r lg:px-14 lg:py-16">
        <div className="editorial-prose max-w-2xl">
          <strong> Boiler Room</strong>
          <p>
            A third space I wanted that could hold my essays, book highlights and smaller fragments from my indie projects.
          </p> 
          <p>
            The overall goal is durability. If I come back after a month with one essay, one book note, 
            and three loose observations, the boiler room should still feel like a place I want to be while still feeling coherent.
          </p>
          <p>
            See also: <a href="https://x.com/builtbynext">Twitter</a>  Curius  <a href="https://github.com/builtbynext">GitHub</a>
          </p>
        </div>
      </section>
    </div>
  )
}
