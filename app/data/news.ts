export type BiasBreakdown = {
  left: number
  center: number
  right: number
}

export type Article = {
  slug: string
  category: string
  region: string
  title: string
  author: string
  publishedAt: string
  readTime: string
  sources: number
  image: string
  imagePosition?: string
  caption: string
  bias: BiasBreakdown
  body: string[]
  summary: string[]
}

export const articles: Article[] = [
  {
    slug: "trump-sends-iran-revised-peace-proposal",
    category: "Politics",
    region: "United States",
    title: "Trump Sends Iran Revised Peace Proposal With Tougher Terms: Report",
    author: "David Morgan",
    publishedAt: "May 31, 2026",
    readTime: "12 min read",
    sources: 12,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/January_2025_Official_Presidential_Portrait_of_Donald_J._Trump.jpg/500px-January_2025_Official_Presidential_Portrait_of_Donald_J._Trump.jpg",
    imagePosition: "center 28%",
    caption:
      "President Donald Trump in the Cabinet Room at the White House, Washington, D.C., May 30, 2026.",
    bias: { left: 20, center: 31, right: 49 },
    body: [
      "The Trump administration has sent Iran a revised nuclear deal proposal that includes tougher terms on uranium enrichment and stronger verification measures, according to a report published Saturday.",
      "The new proposal, delivered through intermediaries in Oman, requires Iran to halt all uranium enrichment on its soil and ship its stockpile of enriched uranium out of the country. It also demands unrestricted access for international inspectors to all Iranian nuclear facilities, including military sites.",
      '"This is a take-it-or-leave-it proposal," a senior administration official told the Wall Street Journal. "The President wants a deal, but he will not accept a weak agreement that puts America or our allies at risk."',
      "Iran has not yet officially responded to the proposal. However, Iranian Foreign Minister Hossein Amir-Abdollahian said last week that any deal must respect Iran's right to peaceful nuclear energy and include the lifting of all U.S. sanctions.",
      "The revised proposal comes after several rounds of indirect talks between U.S. and Iranian officials failed to produce a breakthrough. The Trump administration has warned that if diplomacy fails, it is prepared to take other action to prevent Iran from obtaining a nuclear weapon.",
      'European allies have urged both sides to continue negotiations. "We believe diplomacy is still the best path forward," said a spokesperson for the EU\'s foreign policy chief.',
      'Israel, which has long opposed the 2015 nuclear deal with Iran, praised the Trump administration\'s tougher stance. "This is the kind of leadership that was missing in the past," said Israeli Prime Minister Benjamin Netanyahu in a statement.',
      "The fate of the proposal now rests with Iran, as global attention remains focused on whether a new nuclear agreement can be reached or if tensions will escalate further.",
    ],
    summary: [
      "The Trump administration has sent Iran a revised nuclear deal proposal with tougher verification and enrichment terms.",
      "The proposal demands unrestricted inspector access to all nuclear sites, including military facilities.",
      "Iran says any deal must respect its right to peaceful nuclear energy and include sanctions relief.",
      "The U.S. and European allies remain split between pressure and continued negotiations.",
      "Israel supports the tougher stance and says the proposal strengthens deterrence.",
    ],
  },
  {
    slug: "researchers-make-case-for-grapes-as-superfood",
    category: "Health",
    region: "United States",
    title:
      "Researchers Make Case for Grapes as a 'Superfood' After Review of Health Evidence",
    author: "Maya Patel",
    publishedAt: "May 30, 2026",
    readTime: "7 min read",
    sources: 7,
    image:
      "https://images.unsplash.com/photo-1474722883778-792e7990302f?auto=format&fit=crop&w=900&q=80",
    caption: "Grapes hanging on vines before harvest.",
    bias: { left: 18, center: 42, right: 40 },
    body: [
      "Researchers reviewing recent nutrition studies say grapes may deserve renewed attention because of compounds linked to heart, gut, and metabolic health.",
      "The review highlights polyphenols, fiber, and naturally occurring antioxidants that appear in both red and green grape varieties. Scientists cautioned that the evidence is promising but not a substitute for broader dietary guidance.",
      "Public health experts said the findings fit a growing body of research that emphasizes whole foods over supplements. They also noted that serving size and overall diet quality matter more than any single ingredient.",
      "Industry groups welcomed the review, while independent dietitians urged consumers to avoid exaggerated claims. The researchers said longer controlled studies are needed before grapes can be treated as a clinical intervention.",
    ],
    summary: [
      "A new review argues grapes contain compounds associated with several health benefits.",
      "Researchers point to polyphenols, fiber, and antioxidants as the main areas of interest.",
      "Nutrition experts warn against treating one food as a cure-all.",
      "More long-term studies are needed to measure clinical impact.",
    ],
  },
  {
    slug: "cern-finds-high-significance-hint-of-physics-beyond-standard-model",
    category: "Science",
    region: "Switzerland",
    title: "CERN Finds High-Significance Hint of Physics Beyond Standard Model",
    author: "Elena Fischer",
    publishedAt: "May 30, 2026",
    readTime: "8 min read",
    sources: 8,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/CERN_LHC_ATLAS_Tunnel.jpg/960px-CERN_LHC_ATLAS_Tunnel.jpg",
    caption: "A tunnel section at CERN's Large Hadron Collider complex.",
    bias: { left: 18, center: 62, right: 22 },
    body: [
      "Scientists at CERN say a new analysis has produced one of the strongest hints yet of behavior not fully explained by the Standard Model of particle physics.",
      "The result comes from a large dataset gathered across several years of high-energy collisions. Researchers emphasized that the finding is not a discovery until independent teams reproduce the signal.",
      "Physicists are especially interested because small deviations can point toward unknown particles or forces. The team is now preparing follow-up analyses designed to rule out detector effects and statistical anomalies.",
      "If confirmed, the observation could reshape how scientists understand fundamental matter. For now, CERN officials described the result as exciting but preliminary.",
    ],
    summary: [
      "CERN researchers reported a strong statistical hint of physics beyond the Standard Model.",
      "The signal requires independent confirmation before it can be called a discovery.",
      "Follow-up work will test whether detector effects or chance explain the result.",
      "Physicists say the finding could be significant if it holds up.",
    ],
  },
  {
    slug: "indigenous-leader-brooklyn-rivera-dies-in-nicaragua",
    category: "World",
    region: "Nicaragua",
    title:
      "Indigenous Leader Brooklyn Rivera Dies in Nicaragua After Nearly 3 Years of Detention",
    author: "Camila Torres",
    publishedAt: "May 29, 2026",
    readTime: "9 min read",
    sources: 63,
    image:
      "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=900&q=80",
    imagePosition: "center 25%",
    caption: "Supporters gather during a political demonstration.",
    bias: { left: 54, center: 28, right: 18 },
    body: [
      "Indigenous leader Brooklyn Rivera has died in Nicaragua after nearly three years in detention, according to family members and human rights advocates.",
      "Rivera had long represented Indigenous communities on Nicaragua's Caribbean coast and was detained during a wider crackdown on opposition figures.",
      "Rights groups called for an independent investigation into the circumstances of his death. Government officials did not immediately provide a detailed public account.",
      "Community leaders said Rivera's death deepens concern over political prisoners and Indigenous representation in the country.",
    ],
    summary: [
      "Brooklyn Rivera died after nearly three years in detention.",
      "Human rights groups are seeking an independent investigation.",
      "Rivera was a prominent Indigenous political figure in Nicaragua.",
      "His death has renewed scrutiny of political detentions.",
    ],
  },
  {
    slug: "un-security-council-emergency-meeting-israel-lebanon",
    category: "World",
    region: "Middle East",
    title:
      "UN Security Council to Hold Emergency Meeting as Israel Pushes Deeper into Lebanon",
    author: "Jon Reed",
    publishedAt: "May 29, 2026",
    readTime: "10 min read",
    sources: 15,
    image:
      "https://images.unsplash.com/photo-1601379327928-bedfaf9da2d0?auto=format&fit=crop&w=900&q=80",
    caption: "Damaged buildings seen after heavy fighting.",
    bias: { left: 22, center: 35, right: 43 },
    body: [
      "The UN Security Council will hold an emergency meeting after Israeli forces advanced deeper into southern Lebanon, raising fears of a broader regional conflict.",
      "Diplomats said the meeting will focus on civilian protection, cross-border fire, and possible steps to prevent further escalation.",
      "Israel says its operations target militant infrastructure. Lebanese officials and aid groups warn that displacement and damage to civilian areas are increasing.",
      "International mediators are pressing both sides to accept a temporary pause while negotiations continue.",
    ],
    summary: [
      "The UN Security Council is convening over escalating fighting in Lebanon.",
      "Israel says its advance targets militant infrastructure.",
      "Aid groups warn civilians are facing mounting risk.",
      "Diplomats are seeking steps to prevent regional escalation.",
    ],
  },
  {
    slug: "oil-prices-dip-opec-considers-output-increase",
    category: "Business",
    region: "Global",
    title: "Oil Prices Dip as OPEC+ Considers Output Increase Amid Weak Demand",
    author: "Nora Blake",
    publishedAt: "May 28, 2026",
    readTime: "6 min read",
    sources: 11,
    image:
      "https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?auto=format&fit=crop&w=900&q=80",
    caption: "A fuel pump at a service station.",
    bias: { left: 25, center: 50, right: 28 },
    body: [
      "Oil prices fell as traders weighed signs that OPEC+ could consider a production increase despite softer demand indicators.",
      "Analysts said the move would mark a shift from recent efforts to support prices through supply restraint. Some producers are reportedly concerned about losing market share.",
      "Demand expectations have weakened in several major economies, while inventories remain closely watched. Energy companies said volatility is likely to continue before the next producer meeting.",
      "Consumers could see modest relief if lower crude prices persist, though refining costs and taxes still influence pump prices.",
    ],
    summary: [
      "Oil prices dropped on reports OPEC+ may consider increasing output.",
      "Weak demand expectations are pressuring energy markets.",
      "Some producers are balancing price support against market share.",
      "Lower crude prices could eventually affect consumer fuel costs.",
    ],
  },
  {
    slug: "spacex-launches-starship-test-flight",
    category: "Technology",
    region: "United States",
    title: "SpaceX Launches Starship Test Flight in Milestone for Mars Program",
    author: "Leo Kim",
    publishedAt: "May 28, 2026",
    readTime: "7 min read",
    sources: 9,
    image:
      "https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&w=900&q=80",
    caption: "A rocket lifts off during a test flight.",
    bias: { left: 12, center: 45, right: 49 },
    body: [
      "SpaceX launched another Starship test flight as the company works toward a reusable heavy-lift system for lunar and Mars missions.",
      "The flight tested engine performance, stage separation, and reentry procedures. Engineers said several milestones were achieved, though post-flight analysis is still underway.",
      "NASA and commercial partners are watching the program closely because Starship is central to planned cargo and crew missions.",
      "Regulators will review telemetry and environmental reports before clearing future launches.",
    ],
    summary: [
      "SpaceX completed a new Starship test flight.",
      "The mission tested propulsion, separation, and reentry systems.",
      "Starship remains central to future lunar and Mars plans.",
      "Regulatory review will shape the next launch timeline.",
    ],
  },
  {
    slug: "apple-unveils-ai-powered-features",
    category: "Business",
    region: "United States",
    title: "Apple Unveils AI-Powered Features Across iPhone, iPad and Mac",
    author: "Priya Shah",
    publishedAt: "May 27, 2026",
    readTime: "6 min read",
    sources: 10,
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
    caption: "Apple software running across connected devices.",
    bias: { left: 15, center: 40, right: 45 },
    body: [
      "Apple introduced new AI-powered features across iPhone, iPad, and Mac, expanding tools for writing, search, image editing, and personal assistance.",
      "Executives framed the updates as privacy-focused, saying many tasks will run on device while more complex requests use protected cloud systems.",
      "Developers said the changes could reshape app workflows, though investors are watching whether the features drive a larger upgrade cycle.",
      "Consumer groups welcomed privacy messaging but said Apple should provide clearer controls over how AI systems use personal data.",
    ],
    summary: [
      "Apple announced AI features across its core devices.",
      "The company emphasized privacy and on-device processing.",
      "Developers expect changes to app workflows.",
      "Analysts are watching whether the tools boost device upgrades.",
    ],
  },
  {
    slug: "2025-among-top-three-hottest-years",
    category: "Climate",
    region: "Global",
    title: "2025 on Track to Be Among Top 3 Hottest Years, EU Climate Service Says",
    author: "Ari Coleman",
    publishedAt: "May 27, 2026",
    readTime: "8 min read",
    sources: 14,
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    caption: "A thermometer during a period of extreme heat.",
    bias: { left: 33, center: 34, right: 33 },
    body: [
      "The EU climate service says 2025 is on track to rank among the three hottest years ever recorded, extending a streak of unusually warm global temperatures.",
      "Scientists cited ocean heat, greenhouse gas concentrations, and regional heat waves as major contributors. Several continents have already reported monthly temperature records.",
      "Climate researchers said single-year rankings can vary, but the long-term trend remains clear. Governments are under pressure to adapt infrastructure and reduce emissions.",
      "Public health officials warned that heat risk is becoming a routine planning issue rather than an occasional emergency.",
    ],
    summary: [
      "EU climate data shows 2025 could rank among the top three hottest years.",
      "Ocean heat and greenhouse gases are contributing factors.",
      "Scientists say the long-term warming trend remains clear.",
      "Health and infrastructure planning are becoming more urgent.",
    ],
  },
  {
    slug: "fed-holds-rates-steady-signals-caution",
    category: "Economy",
    region: "United States",
    title: "Fed Holds Rates Steady, Signals Caution on Inflation and Growth Outlook",
    author: "Marcus Lee",
    publishedAt: "May 26, 2026",
    readTime: "7 min read",
    sources: 13,
    image:
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=900&q=80",
    caption: "The Federal Reserve building in Washington, D.C.",
    bias: { left: 30, center: 45, right: 26 },
    body: [
      "The Federal Reserve held interest rates steady and signaled caution as policymakers weigh slower growth against inflation that remains above target.",
      "Officials said they need more evidence that price pressures are easing before considering cuts. Markets had largely expected the decision.",
      "Businesses and households continue to feel the effects of elevated borrowing costs, especially in housing and credit-sensitive sectors.",
      "The central bank said future decisions will depend on incoming labor, spending, and inflation data.",
    ],
    summary: [
      "The Fed left interest rates unchanged.",
      "Officials want more evidence that inflation is easing.",
      "Higher borrowing costs continue to affect households and businesses.",
      "Future moves will depend on incoming economic data.",
    ],
  },
  {
    slug: "real-madrid-win-champions-league-comeback",
    category: "Soccer",
    region: "Europe",
    title: "Real Madrid Win Champions League After Comeback Victory in Final",
    author: "Samir Khan",
    publishedAt: "May 25, 2026",
    readTime: "5 min read",
    sources: 26,
    image:
      "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=900&q=80",
    imagePosition: "center 25%",
    caption: "A soccer match under stadium lights.",
    bias: { left: 9, center: 20, right: 70 },
    body: [
      "Real Madrid won the Champions League after staging a dramatic comeback in the final, adding another European title to the club's record.",
      "The match turned after halftime as Madrid increased pressure and found space behind the opposing defense. Late goals shifted momentum and sent supporters into celebration.",
      "Players credited composure and experience for the comeback. The manager said the team never lost belief even after falling behind early.",
      "The victory renews debate over Madrid's dominance in European competition and the squad's next era.",
    ],
    summary: [
      "Real Madrid won the Champions League final after a comeback.",
      "Second-half pressure changed the match.",
      "Players credited experience and composure.",
      "The win adds to Madrid's European record.",
    ],
  },
  {
    slug: "wildfires-force-evacuations-western-canada",
    category: "Environment",
    region: "Canada",
    title: "Wildfires Force Thousands to Evacuate Across Western Canada",
    author: "Olivia Chen",
    publishedAt: "May 24, 2026",
    readTime: "6 min read",
    sources: 17,
    image:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80",
    caption: "Smoke and flames from a wildfire near a forest road.",
    bias: { left: 27, center: 33, right: 40 },
    body: [
      "Wildfires across western Canada have forced thousands of residents to evacuate as dry conditions and high winds complicate firefighting efforts.",
      "Provincial officials said emergency shelters are open and crews are prioritizing communities near active fire lines. Air quality warnings remain in effect across several regions.",
      "Scientists say early-season fire activity is becoming more common as warmer temperatures dry vegetation sooner.",
      "Authorities urged residents to follow evacuation orders and prepare emergency kits as conditions shift quickly.",
    ],
    summary: [
      "Wildfires have forced evacuations across western Canada.",
      "Officials opened shelters and warned of poor air quality.",
      "Dry conditions and wind are complicating fire response.",
      "Authorities say residents should follow evacuation orders.",
    ],
  },
]

export function getArticleBySlug(slug: string) {
  return articles.find((article) => article.slug === slug)
}

export function getRelatedArticles(slug: string) {
  return articles.filter((article) => article.slug !== slug).slice(0, 6)
}
