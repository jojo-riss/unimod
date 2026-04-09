export type Article = {
  slug: string
  title: string
  author: string
  date: string
  category: string
  featured?: boolean
  content: string[]
  externalUrl?: string
}

export const articles: Article[] = [
  {
    slug: 'big-techs-push-to-make-electricity-cheaper',
    title: "Big Tech's Push to Make Electricity Cheaper",
    author: 'Matthew Borner',
    date: 'March 25, 2026',
    category: 'Energy',
    content: [
      "A coalition of major tech companies — among them Google and Tesla — is forming a group called Utilize to tackle rising U.S. energy costs driven by the rapid expansion of AI data centers. Their central argument is that the national grid is being pushed harder than ever, yet still operates far below its true capacity most of the time.",
    ],
    externalUrl: 'https://oilprice.com',
  },
  {
    slug: 'unimod-model-eight',
    title: 'UniMod Model Eight',
    author: 'Matthew Borner',
    date: 'February 26, 2026',
    category: 'Industry',
    featured: true,
    content: [
      "We are actively working on a full scale UniMod hydraulic engine. We have recently incorporated an electronic data collection and control system. Progress continues and we are excited to bring the UniMod to the next level of development.",
    ],
  },
  {
    slug: 'hydraulic-drive-the-most-underrated-heavy-truck-solution',
    title: 'Hydraulic Drive: The Most Underrated Heavy Truck Solution',
    author: 'Matthew Borner',
    date: 'December 3, 2025',
    category: 'Videos',
    content: [
      "Did you know that hydraulic drive, although it sounds modern, has roots in the 19th century?",
      "This video explores the origins, advantages, and applications of hydraulic drive technology in trucks and machinery — a proven yet underappreciated solution for heavy-duty transport.",
    ],
  },
  {
    slug: 'unimod-modular-shed',
    title: 'UniMod Modular Shed',
    author: 'Matthew Borner',
    date: 'March 13, 2024',
    category: 'Energy',
    content: [
      "This specially designed shed will house UniMod modules in discrete locations protecting equipment from natural elements.",
      "The modular shed provides a sound barrier and safety isolation for UniMod power generation modules, enabling deployment in residential and commercial settings.",
    ],
  },
  {
    slug: 'history-1996-2024',
    title: 'History (1996 - 2024)',
    author: 'Matthew Borner',
    date: 'March 12, 2024',
    category: 'Videos',
    content: [
      "In the fall of 1996, Paul Borner was given a revelation. This gave birth to the crossarm concept.",
      "The crossarm concept overcame the fundamental balancing and power output problems that had plagued previous opposed-piston designs. This breakthrough set the foundation for nearly three decades of development that would become the UniMod engine.",
    ],
  },
  {
    slug: 'unimod-applications',
    title: 'UniMod Applications',
    author: 'Matthew Borner',
    date: 'March 12, 2024',
    category: 'Energy',
    content: [
      "The UniMod engine is the answer to a long overdue update using proven principles and tried materials in a compact, innovative configuration for efficient vehicle engines and facility power generation.",
    ],
  },
  {
    slug: 'early-free-piston-engines',
    title: 'Early Free Piston Engines',
    author: 'Matthew Borner',
    date: 'March 12, 2024',
    category: 'Videos',
    content: [
      "The free piston engine combines those of the two stroke diesel and the gas turbine.",
      "This 1960 documentary examines the early development of free piston engine technology — the same foundational concepts that inform the UniMod's opposed-piston architecture today.",
    ],
  },
  {
    slug: 'toyotas-developing-a-hydrogen-combustion-engine',
    title: "Toyota's Developing A Hydrogen Combustion Engine!",
    author: 'Matthew Borner',
    date: 'June 17, 2021',
    category: 'Automotive',
    content: [
      "Could Toyota's hydrogen engine save combustion by converting engines?",
      "Toyota's hydrogen combustion engine technology represents a potential path for converting existing internal combustion infrastructure to clean fuel — an approach that shares philosophical ground with the UniMod's multi-fuel versatility.",
    ],
  },
  {
    slug: 'the-uni-mod-trials-march-2020',
    title: 'The Uni-Mod Trials March, 2020',
    author: 'Matthew Borner',
    date: 'March 24, 2020',
    category: 'Videos',
    featured: true,
    content: [
      "Testing continues on the mountain. All the mechanical components are holding up.",
      "Ongoing testing in the Catskill Mountains continues to validate the UniMod's mechanical design. Data gathering from these trials directly informs the next generation of development.",
    ],
  },
  {
    slug: 'hcci-new-life-for-the-ice',
    title: 'HCCI: New Life for the ICE',
    author: 'Matthew Borner',
    date: 'July 26, 2018',
    category: 'Education',
    content: [
      "Not all gasoline engines need spark plugs to ignite their fuel. In a conventional internal combustion engine (ICE) cycle, a mixture of air, spark and fuel come together over the course of four strokes to create power and move a vehicle forward.",
      "Diesel engines do not require spark plugs to ignite the mixture and produce combustion. Instead, compressed air causes spontaneous fuel ignition upon injection into the combustion chamber.",
      "There is a third engine type: homogeneous charge compression ignition (HCCI) engines, representing an alternative approach to traditional ICE designs. HCCI achieves diesel-like efficiency on gasoline with significantly lower NOx emissions — a key technology behind the UniMod engine.",
    ],
  },
  {
    slug: 'uni-mod-7-first-oscillations',
    title: 'Uni-Mod 7, First Oscillations',
    author: 'Matthew Borner',
    date: 'September 5, 2017',
    category: 'Videos',
    featured: true,
    content: [
      "At our shop in the Catskills the Uni-Mod engine is warming up.",
      "The crankless opposed piston engine is preparing for fuel introduction and testing — a milestone moment in the development of what would become the UniMod platform.",
    ],
  },
  {
    slug: 'ups-launches-hydraulic-hybrid-propulsion',
    title: 'UPS Launches Hydraulic-Hybrid Propulsion into Chicago Service',
    author: 'Matthew Borner',
    date: 'September 5, 2017',
    category: 'Industry',
    content: [
      "United Parcel Service (UPS) has begun converting 50 of its gasoline-engine delivery trucks in the Chicago-metro area to hydraulic-hybrid propulsion.",
      "The first converted vehicles recently entered service equipped with Lightning Hybrids' hydraulic hybrid system featuring an energy recovery system (ERS). The technology combines traditional gasoline engines with an energy recovery system designed for medium and heavy-duty vehicles with front-engine/rear-drive configurations.",
      "This real-world deployment validates the core principle behind the UniMod's hydraulic power delivery — that hydraulic energy recovery is a practical, commercially viable technology for fleet vehicles.",
    ],
  },
  {
    slug: 'toyota-develops-free-piston-engine',
    title: "Toyota develops high-efficiency 'free piston' no-crankshaft combustion engine to power an EV",
    author: 'Matthew Borner',
    date: 'September 5, 2017',
    category: 'Industry',
    content: [
      "There is probably no better chronicler into the full depth of American ingenuity than YouTube. Here one finds not just computer models for all manner of esoteric combustion engine designs, but actual working prototypes of them, often built by individuals. Big companies can also innovate here sometimes.",
      "A new free piston engine linear generator (FPEG) from Toyota Central in Maine is a case in point. The piston is called 'free' because there is no crankshaft. On its power stroke, the piston dumps its kinetic energy into the fixed windings which surround it, generating a shot of three-phase AC electricity.",
      "It can be run sparkless through a diesel cycle or run on standard gasoline. What has folks excited is the claimed thermal efficiency for the device — at 42% it blows away the engines used in cars today. Toyota's demo engine, just 8 inches around and 2 feet long, was able to generate 15 hp. A two-cylinder model would be self-balancing and have much reduced vibration.",
    ],
  },
  {
    slug: 'a-basic-intro-to-hydraulics',
    title: 'A Basic Intro to Hydraulics',
    author: 'Matthew Borner',
    date: 'September 5, 2017',
    category: 'Videos',
    content: [
      "Principles of hydraulics explained, centering on the value for safety and comfort of hydraulic brakes.",
      "Understanding hydraulic principles is fundamental to appreciating how the UniMod engine converts combustion energy into useful work through fluid power.",
    ],
  },
  {
    slug: 'valentin-technologies-hydrostatic-transmission',
    title: 'Valentin Technologies: Hydrostatic Transmission',
    author: 'Matthew Borner',
    date: 'February 26, 1996',
    category: 'Education',
    content: [
      "\"What if your car could get four or five times the gas mileage it gets now?\" — NY Times, 1996",
      "A typical medium-size car averages about 23 miles per gallon. If driving 12,000 miles annually, owners could save $530 every year with present fuel costs and more than $2,200 during the time you own the car if fuel consumption could be improved five-fold.",
      "Hydrostatic transmission technology has been understood for decades — the challenge has always been packaging it efficiently enough for consumer vehicles. The UniMod's integrated hydraulic power split represents the modern evolution of this concept.",
    ],
  },
  {
    slug: 'vincent-carman-internal-storage-transmission',
    title: "Vincent Carman: Internal Storage Transmission",
    author: 'Matthew Borner',
    date: 'January 1, 1977',
    category: 'Education',
    content: [
      "\"Carmen's Inertial Storage Transmission is the key to greater car mileage.\" — Mother Earth News, 1977",
      "The Good News is that Vincent Carman's new transmission can double your car's gas mileage. The Bad News is that — thanks in part to bungling by the U.S. Government's Energy Research and Development Administration (ERDA) — it may be decades before this fuel saver is on the market.",
      "Portland, Oregon's Vincent Carman is an honest, straightforward guy... and the revolutionary automobile transmission he's invented is the same kind of animal. It's a simple, straightforward combination of off-the-shelf components that don't do a blessed thing... except simply and straightforwardly double the gasoline mileage of a passenger car or other internal combustion engine-powered vehicle.",
      "This historical article underscores a recurring theme in automotive innovation: breakthrough efficiency technologies often face institutional resistance. The UniMod aims to break that cycle through modular manufacturing and strategic licensing.",
    ],
  },
]

export function getArticleBySlug(slug: string) {
  return articles.find(a => a.slug === slug)
}
