import { SiteFooter } from "@/components/site/site-footer"

export default function AboutPage() {
  return (
    <div className="min-h-screen border-line lg:border-l">
      <section className="flex min-h-screen flex-col px-6 py-12 sm:px-10 lg:px-14 lg:py-16">
        <div className="editorial-prose max-w-1xl">
          <h1 className="text-4xl">Stewart Huang</h1>
          <p>
            1. <a href="https://buildandlevel.club" target="_blank">Indie builder</a> and DJ based in Singapore.
          </p>
        <p>
            2. Founding Design Engineer at <a href="https://newstandard.design">New Standard</a> building custom websites for teams that value craft.
            <br></br>Previously <a href="https://x.com/GovTechSG" target="_blank">@GovTech</a>
          </p>
          <p>
            See also: <a href="https://x.com/builtbynext">Twitter</a>,{" "}
            <a href="https://curius.app/"> Curius </a>,{" "}
            <a href="https://github.com/builtbynext">GitHub</a>
          </p>
        </div>
        <SiteFooter className="mt-auto" />
      </section>
    </div>
  )
}
