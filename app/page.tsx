import Link from "next/link"
import type { CSSProperties } from "react"
import type { Article, BiasBreakdown } from "./data/news"
import { getArticles } from "./lib/news-repository"

const topics = [
  "World Cup",
  "IPL",
  "Social Media",
  "Business & Markets",
  "Health & Medicine",
  "Soccer",
  "Artificial Intelligence",
  "Arsenal FC",
  "Extreme Weather and Disasters",
]

function MenuIcon() {
  return (
    <span className="flex h-9 w-9 flex-col items-center justify-center gap-1">
      <span className="h-0.5 w-5 bg-[#111]" />
      <span className="h-0.5 w-5 bg-[#111]" />
      <span className="h-0.5 w-5 bg-[#111]" />
    </span>
  )
}

function BiasBar({ bias }: { bias: BiasBreakdown }) {
  const biasStyle = {
    "--left": `${bias.left}fr`,
    "--center": `${bias.center}fr`,
    "--right": `${bias.right}fr`,
  } as CSSProperties

  return (
    <div
      className="grid h-[18px] grid-cols-[var(--left)_var(--center)_var(--right)] overflow-hidden rounded-[2px] border border-[#eeeeee] text-[11px] font-semibold leading-[17px]"
      style={biasStyle}
    >
      <div className="bg-bias-left text-center text-white">
        L {bias.left}%
      </div>
      <div className="bg-white text-center text-[#171717]">
        Center {bias.center}%
      </div>
      <div className="bg-bias-right text-center text-white">
        Right {bias.right}%
      </div>
    </div>
  )
}

function NewsCard({ article }: { article: Article }) {
  return (
    <article className="overflow-hidden rounded-md border border-[#cfcfcf] bg-bg-primary shadow-sm">
      <Link
        aria-label={`Read ${article.title}`}
        className="relative block h-[206px] bg-[#d8d8d8] bg-cover bg-center"
        href={`/news/${article.slug}`}
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0.08)), url(${article.image})`,
          backgroundPosition: article.imagePosition ?? "center",
        }}
      >
        <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full border border-white/80 bg-black/45 text-[12px] font-semibold text-white">
          i
        </span>
      </Link>
      <div className="px-4 pb-4 pt-3">
        <p className="text-[13px] font-semibold text-[#101010]">
          {article.category}
          <span className="font-normal"> / {article.region}</span>
        </p>
        <h2 className="mt-1 min-h-[64px] text-[20px] font-bold leading-[1.22] text-text-primary">
          <Link className="hover:underline" href={`/news/${article.slug}`}>
            {article.title}
          </Link>
        </h2>
        <div className="mt-5">
          <BiasBar bias={article.bias} />
        </div>
        <p className="mt-4 text-[13px] font-medium text-[#111111]">
          {article.sources} sources
        </p>
      </div>
    </article>
  )
}

export default async function HomePage() {
  const articles = await getArticles()

  return (
    <main className="min-h-screen bg-[#fbfbf8] text-text-primary">
      <header>
        <div className="bg-[#1c1c1b] text-white">
          <div className="mx-auto flex h-9 max-w-[1440px] items-center justify-between px-5 text-[12px]">
            <div className="flex items-center gap-6">
              <span>Browser Extension</span>
              <span className="hidden h-4 w-px bg-white/20 sm:block" />
              <div className="hidden items-center gap-3 sm:flex">
                <span>Theme:</span>
                <span className="font-semibold">Light</span>
                <span>Dark</span>
                <span>Auto</span>
              </div>
            </div>
            <div className="flex items-center gap-5">
              <span className="hidden md:inline">Monday, June 1, 2026</span>
              <span className="hidden h-4 w-px bg-white/20 md:block" />
              <span className="hidden sm:inline">Set Location</span>
              <span>International Edition v</span>
            </div>
          </div>
        </div>

        <nav className="border-b border-[#d2d2d2] bg-[#fbfbf8]">
          <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-5">
            <div className="flex items-center gap-7">
              <MenuIcon />
              <div className="leading-none">
                <div className="text-[30px] font-bold tracking-[-0.02em]">
                  biasly
                </div>
                <div className="ml-[54px] mt-[-2px] text-[11px] text-[#555]">
                  News
                </div>
              </div>
              <div className="hidden h-[72px] items-center gap-8 text-[14px] font-medium md:flex">
                <a className="relative flex h-full items-center" href="#">
                  Home
                  <span className="absolute bottom-0 left-0 h-[2px] w-full bg-[#111]" />
                </a>
                <a href="#">For You</a>
                <a href="#">Local</a>
                <a href="#">Blindspot</a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="hidden rounded-md bg-[#171717] px-9 py-4 text-[14px] font-semibold text-white shadow-sm sm:inline-flex">
                Subscribe
              </button>
              <button className="rounded-md border border-[#777] bg-white px-8 py-4 text-[14px] font-semibold text-[#111]">
                Login
              </button>
            </div>
          </div>
        </nav>

        <div className="border-b border-[#d2d2d2] bg-[#f5f5f3]">
          <div className="mx-auto flex h-[55px] max-w-[1440px] items-center gap-3 overflow-x-auto px-5">
            <button className="flex h-8 min-w-8 items-center justify-center rounded-full bg-[#e8e8e6] text-lg font-semibold">
              +
            </button>
            {topics.map((topic) => (
              <button
                className="flex shrink-0 items-center gap-4 rounded-md bg-[#e1e1df] px-4 py-2 text-[12px] font-bold text-[#111]"
                key={topic}
              >
                {topic}
                <span className="text-base leading-none">+</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-[1320px] px-5 pb-7 pt-10">
        <h1 className="text-[30px] font-bold leading-tight">Top News</h1>
        <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-7 md:grid-cols-2 xl:grid-cols-3">
          {articles.map((article) => (
            <NewsCard article={article} key={article.title} />
          ))}
        </div>
      </section>

      <footer className="mt-5 bg-[#20201f] text-white">
        <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-9 px-5 py-7 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_0.8fr_1.2fr]">
          <div>
            <div className="text-[30px] font-bold leading-none">biasly</div>
            <div className="ml-[54px] mt-[-2px] text-[11px] text-white/80">
              News
            </div>
            <p className="mt-8 max-w-[190px] text-[13px] leading-5 text-white/90">
              Balanced news coverage powered by AI.
            </p>
          </div>
          <div>
            <h3 className="text-[13px] font-bold">Company</h3>
            <ul className="mt-3 space-y-2 text-[12px] text-white/85">
              <li>About</li>
              <li>Careers</li>
              <li>Press</li>
              <li>Contact</li>
            </ul>
          </div>
          <div>
            <h3 className="text-[13px] font-bold">Help</h3>
            <ul className="mt-3 space-y-2 text-[12px] text-white/85">
              <li>Help Center</li>
              <li>Guides</li>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
            </ul>
          </div>
          <div>
            <h3 className="text-[13px] font-bold">Connect</h3>
            <div className="mt-4 flex gap-7 text-[15px] font-semibold text-white/90">
              <span>X</span>
              <span>in</span>
              <span>ig</span>
              <span>yt</span>
            </div>
          </div>
        </div>
        <div className="border-t border-white/15">
          <div className="mx-auto max-w-[1320px] px-5 py-4 text-[12px] text-white/80">
            (c) 2026 Biasly News. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  )
}
