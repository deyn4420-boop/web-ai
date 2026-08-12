import Link from "next/link"
import type { CSSProperties, ReactNode } from "react"

type BiasBreakdown = {
  left: number
  center: number
  right: number
}

type RelatedStory = {
  category: string
  region: string
  title: string
  date: string
  readTime: string
  image: string
}

type Source = {
  name: string
  count?: string
  bias: "Left" | "Center" | "Right"
}

const articleBias: BiasBreakdown = {
  left: 20,
  center: 31,
  right: 49,
}

const articleParagraphs = [
  "The Trump administration has sent Iran a revised nuclear deal proposal that includes tougher terms on uranium enrichment and stronger verification measures, according to a report published Saturday.",
  "The new proposal, delivered through intermediaries in Oman, requires Iran to halt all uranium enrichment on its soil and ship its stockpile of enriched uranium out of the country. It also demands unrestricted access for international inspectors to all Iranian nuclear facilities, including military sites.",
  '"This is a take-it-or-leave-it proposal," a senior administration official told the Wall Street Journal. "The President wants a deal, but he will not accept a weak agreement that puts America or our allies at risk."',
  "Iran has not yet officially responded to the proposal. However, Iranian Foreign Minister Hossein Amir-Abdollahian said last week that any deal must respect Iran's right to peaceful nuclear energy and include the lifting of all U.S. sanctions.",
  "The revised proposal comes after several rounds of indirect talks between U.S. and Iranian officials failed to produce a breakthrough. The Trump administration has warned that if diplomacy fails, it is prepared to take other action to prevent Iran from obtaining a nuclear weapon.",
  'European allies have urged both sides to continue negotiations. "We believe diplomacy is still the best path forward," said a spokesperson for the EU\'s foreign policy chief.',
  'Israel, which has long opposed the 2015 nuclear deal with Iran, praised the Trump administration\'s tougher stance. "This is the kind of leadership that was missing in the past," said Israeli Prime Minister Benjamin Netanyahu in a statement.',
  "The fate of the proposal now rests with Iran, as global attention remains focused on whether a new nuclear agreement can be reached or if tensions will escalate further.",
]

const summaryBullets = [
  "The Trump administration has sent Iran a revised nuclear deal proposal with tougher terms, including a complete halt to uranium enrichment and the removal of enriched uranium stockpiles.",
  "The proposal also demands unrestricted inspector access to all nuclear sites, including military facilities.",
  "Iran has not responded officially but says any deal must respect its right to peaceful nuclear energy and include sanctions relief.",
  "The U.S. warns it is prepared to take other action if diplomacy fails, while European allies urge continued negotiations.",
  "Israel supports the tougher stance, praising the administration's determination to prevent Iran from acquiring nuclear weapons.",
]

const relatedStories: RelatedStory[] = [
  {
    category: "World",
    region: "Middle East",
    title: "Iran Says It Will Not Negotiate Under 'Maximum Pressure'",
    date: "May 29, 2026",
    readTime: "8 min read",
    image:
      "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&w=300&q=80",
  },
  {
    category: "Politics",
    region: "United States",
    title: "Bipartisan Group Urges Diplomacy With Iran",
    date: "May 26, 2026",
    readTime: "5 min read",
    image:
      "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=300&q=80",
  },
  {
    category: "Politics",
    region: "United States",
    title: "US Sanctions More Iranian Entities Over Nuclear Program",
    date: "May 28, 2026",
    readTime: "6 min read",
    image:
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=300&q=80",
  },
  {
    category: "Science",
    region: "Nuclear Policy",
    title: "What's in the 2015 Iran Nuclear Deal?",
    date: "May 25, 2026",
    readTime: "10 min read",
    image:
      "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=300&q=80",
  },
  {
    category: "World",
    region: "Middle East",
    title: "Oman Hosts Another Round of US-Iran Nuclear Talks",
    date: "May 27, 2026",
    readTime: "7 min read",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=300&q=80",
  },
  {
    category: "World",
    region: "Middle East",
    title: "Israel Reaffirms Red Line Over Iranian Nuclear Program",
    date: "May 24, 2026",
    readTime: "6 min read",
    image:
      "https://images.unsplash.com/photo-1542744094-24638eff58bb?auto=format&fit=crop&w=300&q=80",
  },
]

const sources: Source[] = [
  { name: "Fox News", bias: "Right" },
  { name: "The Wall Street Journal", bias: "Center" },
  { name: "Reuters", bias: "Center" },
  { name: "BBC", bias: "Center" },
  { name: "CNN", bias: "Left" },
  { name: "The New York Times", bias: "Center" },
  { name: "The Washington Post", bias: "Center" },
  { name: "Newsmax", bias: "Right" },
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

function MeterRow({
  label,
  value,
  tone,
}: {
  label: string
  value: string
  tone: "left" | "center" | "right"
}) {
  const color =
    tone === "left" ? "bg-bias-left" : tone === "right" ? "bg-bias-right" : "bg-[#d8d8d8]"
  const textColor =
    tone === "left" ? "text-bias-left" : tone === "right" ? "text-bias-right" : "text-[#111]"

  return (
    <div className="grid grid-cols-[72px_56px_1fr] items-center gap-3 text-[13px]">
      <span>{label}</span>
      <span className={`font-semibold ${textColor}`}>{value}</span>
      <span className="h-2 rounded-full bg-[#f0f0f0]">
        <span className={`block h-2 rounded-full ${color}`} style={{ width: value }} />
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

function RelatedStoryItem({ story }: { story: RelatedStory }) {
  return (
    <article className="grid grid-cols-[104px_1fr] gap-4">
      <div
        className="h-[78px] rounded-sm bg-[#d9d9d9] bg-cover bg-center"
        style={{ backgroundImage: `url(${story.image})` }}
      />
      <div>
        <p className="text-[11px] font-medium text-text-secondary">
          {story.category} / {story.region}
        </p>
        <h3 className="mt-1 text-[15px] font-bold leading-[1.25]">
          {story.title}
        </h3>
        <p className="mt-2 text-[11px] text-text-secondary">
          {story.date} / {story.readTime}
        </p>
      </div>
    </article>
  )
}

function SourceRow({ source }: { source: Source }) {
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

export default function NewsDetailsPage() {
  return (
    <main className="min-h-screen bg-[#fbfbf8] text-text-primary">
      <SiteHeader />

      <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-10 px-5 py-11 lg:grid-cols-[minmax(0,840px)_360px]">
        <article>
          <p className="text-[14px] font-semibold">Politics / United States</p>
          <h1 className="mt-3 max-w-[780px] text-[36px] font-bold leading-[1.12] md:text-[44px]">
            Trump Sends Iran Revised Peace Proposal With Tougher Terms: Report
          </h1>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-[13px]">
            <div className="flex flex-wrap items-center gap-3">
              <span>
                By <strong>David Morgan</strong>
              </span>
              <span className="h-4 w-px bg-[#cfcfcf]" />
              <span>May 31, 2026</span>
              <span className="h-4 w-px bg-[#cfcfcf]" />
              <span>12 min read</span>
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
              backgroundImage:
                "linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0.08)), url(https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/January_2025_Official_Presidential_Portrait_of_Donald_J._Trump.jpg/500px-January_2025_Official_Presidential_Portrait_of_Donald_J._Trump.jpg)",
              backgroundPosition: "center 30%",
            }}
          />
          <p className="mt-4 text-[11px] leading-5 text-text-secondary">
            President Donald Trump in the Cabinet Room at the White House,
            Washington, D.C., May 30, 2026.
            <br />
            Photo: Andrew Harnik/Getty Images
          </p>

          <section className="mt-5 rounded-md border border-[#d5d5d5] bg-white p-5">
            <div className="mb-4 flex items-center gap-2 text-[13px] font-bold">
              Bias Distribution
              <span className="flex h-4 w-4 items-center justify-center rounded-full border border-[#111] text-[10px]">
                i
              </span>
            </div>
            <BiasBar bias={articleBias} />
            <p className="mt-4 text-[13px] font-bold">12 sources</p>
          </section>

          <div className="mt-9 space-y-6 text-[18px] leading-[1.55]">
            {articleParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <section className="mt-10 border-t border-[#cfcfcf] pt-7">
            <h2 className="text-[16px] font-bold">Related Stories</h2>
            <div className="mt-5 grid grid-cols-1 gap-x-10 gap-y-6 md:grid-cols-2">
              {relatedStories.map((story) => (
                <RelatedStoryItem key={story.title} story={story} />
              ))}
            </div>
          </section>
        </article>

        <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
          <SideCard title="Bias Analysis">
            <div>
              <p className="text-[13px] font-bold">Overall Bias</p>
              <p className="mt-3 text-[28px] font-bold leading-none text-bias-right">
                Right 49%
              </p>
              <p className="mt-2 text-[13px] text-bias-right">
                Based on 12 balanced sources
              </p>
            </div>
            <div className="my-6 h-px bg-[#d8d8d8]" />
            <div className="space-y-6">
              <MeterRow label="Left" value="20%" tone="left" />
              <MeterRow label="Center" value="31%" tone="center" />
              <MeterRow label="Right" value="49%" tone="right" />
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
              Generated May 31, 2026 / 3 min read
            </p>
            <ul className="mt-6 list-disc space-y-5 pl-5 text-[14px] leading-6">
              {summaryBullets.map((bullet) => (
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
            <p className="text-[13px] font-bold">12 Total Sources</p>
            <div className="mt-6 space-y-5">
              <MeterRow label="Left" value="20%" tone="left" />
              <MeterRow label="Center" value="31%" tone="center" />
              <MeterRow label="Right" value="49%" tone="right" />
            </div>
            <div className="mt-8 flex justify-between text-[13px] font-bold">
              <span>Top Sources</span>
              <span>Bias</span>
            </div>
            <div className="mt-4 space-y-4">
              {sources.map((source) => (
                <SourceRow key={source.name} source={source} />
              ))}
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
