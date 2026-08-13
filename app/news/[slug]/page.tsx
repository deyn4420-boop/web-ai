import Link from "next/link"
import { notFound } from "next/navigation"
import type { CSSProperties, ReactNode } from "react"
import type { Article, BiasBreakdown } from "@/app/data/news"
import {
  getArticleBySlug,
  getArticleSources,
  getArticles,
  getRelatedArticles,
  type ArticleSource,
} from "@/app/lib/news-repository"

type PageProps = {
  params: Promise<{
    slug: string
  }>
}

function MenuIcon() {
  return (
    <span className="flex h-9 w-9 flex-col items-center justify-center gap-1">
      <span className="h-0.5 w-5 bg-[#111]" />
      <span className="h-0.5 w-5 bg-[#111]" />
      <span className="h-0.5 w-5 bg-[#111]" />
    </span>
  )
}

function SiteHeader() {
  return (
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
            <Link className="leading-none" href="/">
              <div className="text-[30px] font-bold tracking-[-0.02em]">
                biasly
              </div>
              <div className="ml-[54px] mt-[-2px] text-[11px] text-[#555]">
                News
              </div>
            </Link>
            <div className="hidden h-[72px] items-center gap-8 text-[14px] font-medium md:flex">
              <Link className="relative flex h-full items-center" href="/">
                Home
                <span className="absolute bottom-0 left-0 h-[2px] w-full bg-[#111]" />
              </Link>
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
    </header>
  )
}

function BiasBar({ bias, compact = false }: { bias: BiasBreakdown; compact?: boolean }) {
  const biasStyle = {
    "--left": `${bias.left}fr`,
    "--center": `${bias.center}fr`,
    "--right": `${bias.right}fr`,
  } as CSSProperties

  return (
    <div
      className={`${compact ? "h-2" : "h-[28px] text-[13px]"} grid grid-cols-[var(--left)_var(--center)_var(--right)] overflow-hidden rounded-[2px] border border-[#ededed] font-bold leading-[28px]`}
      style={biasStyle}
    >
      <div className="bg-bias-left text-center text-white">
        {!compact && `Left ${bias.left}%`}
      </div>
      <div className="bg-white text-center text-[#111]">
        {!compact && `Center ${bias.center}%`}
      </div>
      <div className="bg-bias-right text-center text-white">
        {!compact && `Right ${bias.right}%`}
      </div>
    </div>
  )
}

function strongestBias(bias: BiasBreakdown) {
  if (bias.left >= bias.center && bias.left >= bias.right) return ["Left", bias.left] as const
  if (bias.right >= bias.left && bias.right >= bias.center) return ["Right", bias.right] as const
  return ["Center", bias.center] as const
}

function MeterRow({
  label,
  value,
  tone,
}: {
  label: string
  value: number
  tone: "left" | "center" | "right"
}) {
  const color =
    tone === "left" ? "bg-bias-left" : tone === "right" ? "bg-bias-right" : "bg-[#d8d8d8]"
  const textColor =
    tone === "left" ? "text-bias-left" : tone === "right" ? "text-bias-right" : "text-[#111]"

  return (
    <div className="grid grid-cols-[72px_56px_1fr] items-center gap-3 text-[13px]">
      <span>{label}</span>
      <span className={`font-semibold ${textColor}`}>{value}%</span>
      <span className="h-2 rounded-full bg-[#f0f0f0]">
        <span className={`block h-2 rounded-full ${color}`} style={{ width: `${value}%` }} />
      </span>
    </div>
  )
}

function SideCard({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className="rounded-md border border-[#d5d5d5] bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 className="text-[22px] font-bold leading-tight">{title}</h2>
        <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#111] text-[12px] font-semibold">
          i
        </span>
      </div>
      {children}
    </section>
  )
}

function RelatedStoryItem({ story }: { story: Article }) {
  return (
    <article className="grid grid-cols-[104px_1fr] gap-4">
      <Link
        aria-label={`Read ${story.title}`}
        className="h-[78px] rounded-sm bg-[#d9d9d9] bg-cover bg-center"
        href={`/news/${story.slug}`}
        style={{ backgroundImage: `url(${story.image})` }}
      />
      <div>
        <p className="text-[11px] font-medium text-text-secondary">
          {story.category} / {story.region}
        </p>
        <h3 className="mt-1 text-[15px] font-bold leading-[1.25]">
          <Link className="hover:underline" href={`/news/${story.slug}`}>
            {story.title}
          </Link>
        </h3>
        <p className="mt-2 text-[11px] text-text-secondary">
          {story.publishedAt} / {story.readTime}
        </p>
      </div>
    </article>
  )
}

function SourceRow({ source }: { source: ArticleSource }) {
  const biasClass =
    source.bias === "Left"
      ? "text-bias-left"
      : source.bias === "Right"
        ? "text-bias-right"
        : "text-[#555]"

  return (
    <div className="flex items-center justify-between gap-4 text-[13px]">
      <span className="font-semibold">{source.name}</span>
      <span className={`font-semibold ${biasClass}`}>{source.bias}</span>
    </div>
  )
}

function SiteFooter() {
  return (
    <footer className="bg-[#20201f] text-white">
      <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-9 px-5 py-8 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_0.8fr_1.2fr]">
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
  )
}

export async function generateStaticParams() {
  const articles = await getArticles()

  return articles.map((article) => ({
    slug: article.slug,
  }))
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)

  if (!article) {
    return {
      title: "Article not found | biasly",
    }
  }

  return {
    title: `${article.title} | biasly`,
    description: article.summary[0] ?? article.caption,
  }
}

export default async function NewsDetailsPage({ params }: PageProps) {
  const { slug } = await params
  const [article, relatedStories, sources] = await Promise.all([
    getArticleBySlug(slug),
    getRelatedArticles(slug),
    getArticleSources(slug),
  ])

  if (!article) {
    notFound()
  }

  const [overallBias, overallBiasValue] = strongestBias(article.bias)
  const overallBiasClass =
    overallBias === "Left"
      ? "text-bias-left"
      : overallBias === "Right"
        ? "text-bias-right"
        : "text-[#111]"

  return (
    <main className="min-h-screen bg-[#fbfbf8] text-text-primary">
      <SiteHeader />

      <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-10 px-5 py-11 lg:grid-cols-[minmax(0,840px)_360px]">
        <article>
          <p className="text-[14px] font-semibold">
            {article.category} / {article.region}
          </p>
          <h1 className="mt-3 max-w-[780px] text-[36px] font-bold leading-[1.12] md:text-[44px]">
            {article.title}
          </h1>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-[13px]">
            <div className="flex flex-wrap items-center gap-3">
              <span>
                By <strong>{article.author}</strong>
              </span>
              <span className="h-4 w-px bg-[#cfcfcf]" />
              <span>{article.publishedAt}</span>
              <span className="h-4 w-px bg-[#cfcfcf]" />
              <span>{article.readTime}</span>
            </div>
            <div className="flex items-center gap-4">
              <button>Save</button>
              <button className="text-xl leading-none">[]</button>
              <button>Share</button>
              <button className="text-xl leading-none">o-</button>
              <button className="text-xl leading-none">...</button>
            </div>
          </div>

          <div
            className="mt-7 h-[430px] rounded-md bg-[#d8d8d8] bg-cover bg-center"
            style={{
              backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0.08)), url(${article.image})`,
              backgroundPosition: article.imagePosition ?? "center",
            }}
          />
          <p className="mt-4 text-[11px] leading-5 text-text-secondary">
            {article.caption}
          </p>

          <section className="mt-5 rounded-md border border-[#d5d5d5] bg-white p-5">
            <div className="mb-4 flex items-center gap-2 text-[13px] font-bold">
              Bias Distribution
              <span className="flex h-4 w-4 items-center justify-center rounded-full border border-[#111] text-[10px]">
                i
              </span>
            </div>
            <BiasBar bias={article.bias} />
            <p className="mt-4 text-[13px] font-bold">
              {article.sources} sources
            </p>
          </section>

          <div className="mt-9 space-y-6 text-[18px] leading-[1.55]">
            {article.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <section className="mt-10 border-t border-[#cfcfcf] pt-7">
            <h2 className="text-[16px] font-bold">Related Stories</h2>
            <div className="mt-5 grid grid-cols-1 gap-x-10 gap-y-6 md:grid-cols-2">
              {relatedStories.map((story) => (
                <RelatedStoryItem key={story.slug} story={story} />
              ))}
            </div>
          </section>
        </article>

        <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
          <SideCard title="Bias Analysis">
            <div>
              <p className="text-[13px] font-bold">Overall Bias</p>
              <p className={`mt-3 text-[28px] font-bold leading-none ${overallBiasClass}`}>
                {overallBias} {overallBiasValue}%
              </p>
              <p className={`mt-2 text-[13px] ${overallBiasClass}`}>
                Based on {article.sources} balanced sources
              </p>
            </div>
            <div className="my-6 h-px bg-[#d8d8d8]" />
            <div className="space-y-6">
              <MeterRow label="Left" value={article.bias.left} tone="left" />
              <MeterRow label="Center" value={article.bias.center} tone="center" />
              <MeterRow label="Right" value={article.bias.right} tone="right" />
            </div>
            <p className="mt-8 text-[13px] leading-5">
              Our analysis is based on the political leaning of the publication
              and how the story is framed. Sources are weighted by reliability
              and recency.
            </p>
            <button className="mt-5 w-full rounded-sm border border-[#777] px-4 py-3 text-[13px] font-bold">
              How We Analyze Bias
            </button>
          </SideCard>

          <SideCard title="AI Summary">
            <p className="text-[12px] text-text-secondary">
              Generated {article.publishedAt} / 3 min read
            </p>
            <ul className="mt-6 list-disc space-y-5 pl-5 text-[14px] leading-6">
              {article.summary.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
            <p className="mt-7 text-[12px] text-text-secondary">
              AI summaries can make mistakes.
            </p>
            <button className="mt-3 rounded-sm border border-[#777] px-5 py-2 text-[13px] font-bold">
              Provide Feedback
            </button>
          </SideCard>

          <SideCard title="Source Breakdown">
            <p className="text-[13px] font-bold">{article.sources} Total Sources</p>
            <div className="mt-6 space-y-5">
              <MeterRow label="Left" value={article.bias.left} tone="left" />
              <MeterRow label="Center" value={article.bias.center} tone="center" />
              <MeterRow label="Right" value={article.bias.right} tone="right" />
            </div>
            <div className="mt-8 flex justify-between text-[13px] font-bold">
              <span>Top Sources</span>
              <span>Bias</span>
            </div>
            <div className="mt-4 space-y-4">
              {sources.length > 0 ? (
                sources.map((source) => (
                  <SourceRow key={`${source.name}-${source.bias}`} source={source} />
                ))
              ) : (
                <p className="text-[13px] text-text-secondary">
                  Source list pending.
                </p>
              )}
            </div>
            <button className="mt-6 w-full rounded-sm border border-[#777] px-4 py-3 text-[13px] font-bold">
              View All Sources
            </button>
          </SideCard>
        </aside>
      </div>

      <section className="mx-auto max-w-[1320px] px-5 pb-8">
        <div className="flex flex-col gap-5 rounded-md border border-[#d5d5d5] bg-white px-8 py-7 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-[21px] font-bold">
              Stay Informed. Stay Balanced.
            </h2>
            <p className="mt-2 text-[13px] text-text-secondary">
              Get the top stories and bias analysis delivered to your inbox.
            </p>
          </div>
          <form className="flex w-full flex-col gap-4 sm:flex-row md:w-auto">
            <input
              className="h-12 min-w-0 rounded-sm border border-[#777] bg-white px-4 text-[14px] sm:w-[320px]"
              placeholder="Enter your email"
              type="email"
            />
            <button className="h-12 rounded-sm bg-[#171717] px-12 text-[14px] font-bold text-white">
              Subscribe
            </button>
          </form>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
