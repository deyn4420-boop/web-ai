import type { CSSProperties } from "react"

type BiasBreakdown = {
  left: number
  center: number
  right: number
}

type Article = {
  category: string
  region: string
  title: string
  sources: number
  image: string
  imagePosition?: string
  bias: BiasBreakdown
}

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

const articles: Article[] = [
  {
    category: "Politics",
    region: "United States",
    title: "Trump Sends Iran Revised Peace Proposal With Tougher Terms: Report",
    sources: 12,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/January_2025_Official_Presidential_Portrait_of_Donald_J._Trump.jpg/500px-January_2025_Official_Presidential_Portrait_of_Donald_J._Trump.jpg",
    imagePosition: "center 28%",
    bias: { left: 20, center: 31, right: 49 },
  },
  {
    category: "Health",
    region: "United States",
    title:
      "Researchers Make Case for Grapes as a 'Superfood' After Review of Health Evidence",
    sources: 7,
    image:
      "https://images.unsplash.com/photo-1474722883778-792e7990302f?auto=format&fit=crop&w=900&q=80",
    bias: { left: 18, center: 42, right: 40 },
  },
  {
    category: "Science",
    region: "Switzerland",
    title: "CERN Finds High-Significance Hint of Physics Beyond Standard Model",
    sources: 8,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/CERN_LHC_ATLAS_Tunnel.jpg/960px-CERN_LHC_ATLAS_Tunnel.jpg",
    bias: { left: 18, center: 62, right: 22 },
  },
  {
    category: "World",
    region: "Nicaragua",
    title:
      "Indigenous Leader Brooklyn Rivera Dies in Nicaragua After Nearly 3 Years of Detention",
    sources: 63,
    image:
      "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=900&q=80",
    imagePosition: "center 25%",
    bias: { left: 54, center: 28, right: 18 },
  },
  {
    category: "World",
    region: "Middle East",
    title:
      "UN Security Council to Hold Emergency Meeting as Israel Pushes Deeper into Lebanon",
    sources: 15,
    image:
      "https://images.unsplash.com/photo-1601379327928-bedfaf9da2d0?auto=format&fit=crop&w=900&q=80",
    bias: { left: 22, center: 35, right: 43 },
  },
  {
    category: "Business",
    region: "Global",
    title: "Oil Prices Dip as OPEC+ Considers Output Increase Amid Weak Demand",
    sources: 11,
    image:
      "https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?auto=format&fit=crop&w=900&q=80",
    bias: { left: 25, center: 50, right: 28 },
  },
  {
    category: "Technology",
    region: "United States",
    title: "SpaceX Launches Starship Test Flight in Milestone for Mars Program",
    sources: 9,
    image:
      "https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&w=900&q=80",
    bias: { left: 12, center: 45, right: 49 },
  },
  {
    category: "Business",
    region: "United States",
    title: "Apple Unveils AI-Powered Features Across iPhone, iPad and Mac",
    sources: 10,
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
    bias: { left: 15, center: 40, right: 45 },
  },
  {
    category: "Climate",
    region: "Global",
    title: "2025 on Track to Be Among Top 3 Hottest Years, EU Climate Service Says",
    sources: 14,
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    bias: { left: 33, center: 34, right: 33 },
  },
  {
    category: "Economy",
    region: "United States",
    title: "Fed Holds Rates Steady, Signals Caution on Inflation and Growth Outlook",
    sources: 13,
    image:
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=900&q=80",
    bias: { left: 30, center: 45, right: 26 },
  },
  {
    category: "Soccer",
    region: "Europe",
    title: "Real Madrid Win Champions League After Comeback Victory in Final",
    sources: 26,
    image:
      "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=900&q=80",
    imagePosition: "center 25%",
    bias: { left: 9, center: 20, right: 70 },
  },
  {
    category: "Environment",
    region: "Canada",
    title: "Wildfires Force Thousands to Evacuate Across Western Canada",
    sources: 17,
    image:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80",
    bias: { left: 27, center: 33, right: 40 },
  },
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
      <div
        className="relative h-[206px] bg-[#d8d8d8] bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0.08)), url(${article.image})`,
          backgroundPosition: article.imagePosition ?? "center",
        }}
      >
        <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full border border-white/80 bg-black/45 text-[12px] font-semibold text-white">
          i
        </span>
      </div>
      <div className="px-4 pb-4 pt-3">
        <p className="text-[13px] font-semibold text-[#101010]">
          {article.category}
          <span className="font-normal"> / {article.region}</span>
        </p>
        <h2 className="mt-1 min-h-[64px] text-[20px] font-bold leading-[1.22] text-text-primary">
          {article.title}
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

export default function HomePage() {
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
