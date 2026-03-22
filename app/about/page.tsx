export default function AboutPage() {
  return (
    <div className="grid min-h-screen border-line lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:border-l">
      <section className="border-line px-6 py-12 sm:px-10 lg:border-r lg:px-14 lg:py-16">
        <div className="editorial-prose max-w-2xl">
          <h1 className="text-4xl">Stewart Huang</h1>
          <p>
            1. <a href="https://buildandlevel.club" target="_blank">Indie builder</a> and DJ based in Singapore. 
          </p>
        <p>
            2. Founding Design Engineer at <a href="https://newstandard.design">New Standard</a> building custom websites for teams who value craft.
          </p>
          <p>
            See also: <a href="https://x.com/builtbynext">Twitter</a>,{" "}
            <a href="https://curius.app/"> Curius </a>,{" "}    
            <a href="https://github.com/builtbynext">GitHub</a>
          </p>
        </div>
      </section>
    </div>
  )
}
