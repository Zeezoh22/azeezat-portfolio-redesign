/* Edit this one file when approved project, garden, bookshelf, or writing content is ready. */
window.PORTFOLIO_CONTENT = {
  experience: [
    { employer: "Konga", role: "UI/UX Designer", type: "Full-time", dates: "March 2026–Present", scope: "Product design and UX across Konga Logistics, Konga Travels, the main e-commerce platform, and the SHQ/admin system." },
    { employer: "Xtrempay", role: "Product Designer", type: "Contract", dates: "February–July 2026", scope: "Design across the mobile app, website, admin dashboard, and design system." },
    { employer: "DojoConnect", context: "Associated context: Qvate", role: "UI/UX Designer", type: "Contract", dates: "March 2025–February 2026", scope: "UI/UX design for a martial-arts management platform." },
    { employer: "Techlava Softwares", role: "UI/UX Expert", type: "Full-time", dates: "September 2024–February 2026", scope: "UX work across Legal Flow and Softdox." },
    { employer: "MyWantShop", role: "Design Lead", type: "Full-time", dates: "August 2023–February 2025", scope: "Design leadership across shop-owner interfaces, logistics management, and consumer-facing features." }
  ],
  /* Work index. Each entry is either a parent (group: true, with `children`
     product areas) or a single project. `classification` drives the filter tabs
     (professional, independent, volunteer, pending). Role/employment/date details
     are only set where documented (cv/content.py and the original portfolio);
     nothing is invented. */
  projects: [
    /* --- Professional engagements verified by cv/content.py --- */
    {
      name: "Konga",
      group: true,
      context: "Konga Group",
      role: "UI/UX Designer",
      employment: "Full-time",
      dates: "March 2026–Present",
      classification: "professional",
      industry: "E-commerce, logistics & travel",
      pending: false,
      description: "Designing UI/UX for customer-facing and internal products across Konga Logistics, Konga Travels, the main e-commerce platform, and SHQ/admin systems.",
      url: null,
      children: [
        { name: "Konga Logistics", domain: "Logistics & delivery", description: "UI/UX design for the logistics and delivery product area.", url: null, pending: false },
        { name: "Konga Travels", domain: "Travel booking", description: "UI/UX design for the travel booking product.", url: null, pending: false },
        { name: "Main e-commerce platform", domain: "E-commerce marketplace", description: "UI/UX design for the main e-commerce platform.", url: null, pending: false },
        { name: "SHQ / admin system", domain: "Internal admin & operations", description: "UI/UX design for the seller HQ and admin system.", url: null, pending: false }
      ]
    },
    {
      name: "Xtrempay",
      group: true,
      context: "Xtrempay",
      role: "Product Designer",
      employment: "Contract",
      dates: "February–July 2026",
      classification: "professional",
      industry: "Fintech",
      pending: false,
      description: "Product design across the mobile app, website, admin dashboard, and design system for a gamified savings and financial-product experience.",
      url: null,
      children: [
        { name: "Mobile app", domain: "Gamified savings", description: "Product design for the gamified savings and financial-product experience.", url: null, pending: false },
        { name: "Website", domain: "Product & marketing site", description: "Design for the Xtrempay website.", url: null, pending: false },
        { name: "Admin dashboard", domain: "Internal fintech dashboard", description: "Design for the Xtrempay admin dashboard.", url: null, pending: false },
        { name: "Design system", domain: "Design system", description: "Component and pattern foundations supporting the Xtrempay product suite.", url: null, pending: false }
      ]
    },
    {
      name: "Techlava Softwares",
      group: true,
      context: "Techlava Softwares",
      role: "UI/UX Expert",
      employment: "Full-time",
      dates: "September 2024–February 2026",
      classification: "professional",
      industry: "Legal technology",
      pending: false,
      description: "Focus on UI/UX design, translating product needs into user-centred interface solutions across Softdox and Legal Flow.",
      url: null,
      children: [
        { name: "Softdox", domain: "Legal technology", description: "Softdox is a comprehensive legal management platform designed to simplify legal processes and help legal teams manage their work more efficiently.", url: null, pending: false },
        { name: "Legal Flow", domain: "Legal technology", description: "A legal product area at Techlava Softwares.", url: null, pending: true }
      ]
    },
    {
      name: "DojoConnect",
      group: false,
      context: "DojoConnect · also known as Qvate",
      role: "UI/UX Designer",
      employment: "Contract",
      dates: "March 2025–February 2026",
      classification: "professional",
      industry: "Martial arts management",
      pending: false,
      description: "Product and interface design for a martial-arts management platform, including user flows, wireframes, and prototypes.",
      url: null,
      children: []
    },
    {
      name: "MyWantShop",
      group: false,
      context: "MyWantShop",
      role: "Design Lead",
      employment: "Full-time",
      dates: "August 2023–February 2025",
      classification: "professional",
      industry: "E-commerce & logistics",
      pending: false,
      description: "Led a multidisciplinary team crafting user experiences for logistics management, shop-owner interfaces, and consumer-facing features.",
      url: null,
      children: []
    },
    {
      name: "Whipcare",
      group: false,
      context: "Whipcare by Zacwurld",
      role: "UI Designer",
      employment: "Contract",
      dates: "August 2024–February 2025",
      classification: "professional",
      industry: "AutoTech (Automotive Technology) & Mobility",
      pending: false,
      description: "UI design for the mobile application and admin dashboard.",
      url: null,
      children: []
    },
    {
      name: "ExamCrush",
      group: false,
      context: "Project",
      role: null, employment: null, dates: null,
      classification: "professional",
      industry: "EdTech",
      pending: false,
      description: null,
      url: null,
      children: []
    },
    {
      name: "Zweka",
      group: false,
      context: "Project",
      role: null, employment: null, dates: null,
      classification: "professional",
      industry: "Marketplace",
      pending: false,
      description: null,
      url: null,
      children: []
    },

    /* --- Independent projects --- */
    {
      name: "BitPath",
      group: false,
      context: "Project",
      role: null, employment: null, dates: null,
      classification: "independent",
      industry: "Bitcoin & digital learning",
      pending: false,
      description: "An AI-guided digital-learning and rewards concept.",
      url: null,
      children: []
    },
    {
      name: "GuidMe",
      group: false,
      context: "Project",
      role: null, employment: null, dates: null,
      classification: "independent",
      industry: "Management",
      pending: false,
      description: null,
      url: null,
      children: []
    },
    {
      name: "Á Túnṣe",
      group: false,
      context: "Project",
      role: null, employment: null, dates: null,
      classification: "independent",
      industry: "Home services marketplace",
      pending: false,
      description: "A service-marketplace concept connecting customers with artisans.",
      url: null,
      children: []
    },

    /* --- Volunteer work --- */
    {
      name: "Bayttaalim",
      group: false,
      context: "Project",
      role: null, employment: null, dates: null,
      classification: "volunteer",
      industry: "EdTech",
      pending: false,
      description: null,
      url: null,
      children: []
    }
  ],
  /* Writing — Simply Zeezoh. The canonical publication URL is used everywhere.
     Article data is generated by tools/import-substack.mjs into writing-data.js. */
  writing: {
    name: "Simply Zeezoh",
    url: "https://simplyzeezoh.substack.com/",
    feed: "https://simplyzeezoh.substack.com/feed",
    label: "All writing",
    blurb: "A collection of thoughts, lessons, and reflections on becoming — through design, faith, work, and everyday life.",
    description: "I write about my learning journey: the reflections, challenges, inspiration, influences, and everyday lessons that shape how I grow. The writing moves across design, career, faith and deen, life, and personal development.",
    topics: ["Design", "Career", "Faith & deen", "Life", "Personal development"]
  },
  garden: [
    { placeholder: false, layout: "tall", title: "Zweka", category: "Mobile commerce · Motion study", device: true, ratio: "351 / 711", coverAsset: "assets/garden/zweka-shopping-journey.png", gifAsset: "assets/garden/zweka-shopping-journey.gif", webpAsset: "assets/garden/zweka-shopping-journey.webp", description: "A shopping journey motion study — discovering a listing, opening the Samsung Galaxy S24 product details, and landing on the seller's shop profile.", url: null },
    { placeholder: true, layout: "medium", title: "Temporary placeholder 01", category: "Approved work pending", coverAsset: null, gifAsset: null, description: "Replace with an approved interface or motion study.", url: null },
    { placeholder: false, layout: "small", title: "Softdox", category: "Legal technology · Device mockup", device: true, ratio: "1400 / 810", coverAsset: "assets/garden/macbook-pro.png", gifAsset: null, webpAsset: "assets/garden/macbook-pro.webp", description: "Softdox is a comprehensive legal management platform designed to simplify legal processes and help legal teams manage their work more efficiently.", url: null },
    { placeholder: true, layout: "small", title: "Temporary placeholder 02", category: "Approved work pending", coverAsset: null, gifAsset: null, description: "Replace with an approved visual exploration.", url: null },
    { placeholder: false, layout: "tall", title: "Bayttaalim", category: "Mobile class journey · Motion study", device: true, ratio: "409 / 803", coverAsset: "assets/garden/bayttaalim-mobile-class-journey.png", gifAsset: "assets/garden/bayttaalim-mobile-class-journey.gif", webpAsset: "assets/garden/bayttaalim-mobile-class-journey.webp", description: "A mobile class-journey motion study from the Bayttaalim platform.", url: null },
    { placeholder: false, layout: "small", title: "Bayttaalim", category: "Learning platform · Motion study", device: true, ratio: "960 / 479", coverAsset: "assets/garden/bayttaalim-learning-journey.png", gifAsset: "assets/garden/bayttaalim-learning-journey.gif", webpAsset: "assets/garden/bayttaalim-learning-journey.webp", description: "A learning-journey motion study from the Bayttaalim platform.", url: null },
    { placeholder: true, layout: "tall", title: "Temporary placeholder 03", category: "Approved work pending", coverAsset: null, gifAsset: null, description: "Replace with an approved product or experiment preview.", url: null },
    { placeholder: false, layout: "medium", title: "Xtrempay", category: "Fintech · App mockup", device: true, ratio: "1024 / 1536", coverAsset: "assets/garden/xtrempay-mockup.png", gifAsset: null, webpAsset: "assets/garden/xtrempay-mockup.webp", description: "Product design across the mobile app, website, admin dashboard, and design system for a gamified savings and financial-product experience.", url: null },
    { placeholder: true, layout: "medium", title: "Temporary placeholder 04", category: "Approved work pending", coverAsset: null, gifAsset: null, description: "Replace with an approved final gallery preview.", url: null }
  ],
  /* Bookshelf — a proposed reading list, not confirmed reading history.
     Filter categories follow the brief. `section` preserves the original listing
     section; `category` maps it to a visible filter tab (Design & Product →
     Design & Creativity, Thinking & Communication → Personal Growth). `status`
     is "Read" for the brief's read sections and "To read" otherwise.

     Cover fields: `cover` is the local asset, `coverSource` the exact provenance,
     `coverVerified` records whether the downloaded file was confirmed against a
     bibliographic/publisher record (images could not be viewed directly here).

     Reflection fields (`lessons`, `work`) are intentionally EMPTY: the workspace
     holds no genuine personal reflections, and none are invented. `motivation`
     and `hopes` reuse the neutral, editable starter copy already reviewed in this
     file — never first-person claims. `reflectionStatus` is "starter" when only
     that neutral copy exists, "empty" when nothing beyond the book description is
     available. Empty blocks are hidden by the renderer. */
  books: [
    /* --- Design & Creativity · Read (1–5) --- */
    { id: "design-everyday-things", title: "The Design of Everyday Things", author: "Don Norman", section: "Design & Creativity", category: "Design & Creativity", status: "Read", cover: "assets/books/the-design-of-everyday-things-don-norman.jpg", coverSource: "https://covers.openlibrary.org/b/isbn/9780465050659-L.jpg", coverVerified: true, isbn: "9780465050659", edition: null, about: "The foundational text on how people meet everyday objects and interfaces as design decisions.", motivation: "A foundation for seeing the everyday objects and interfaces around us as design decisions.", hopes: "How affordances, feedback, and mental models shape usable products.", lessons: [], work: null, reflectionStatus: "starter" },
    { id: "dont-make-me-think", title: "Don't Make Me Think", author: "Steve Krug", section: "Design & Creativity", category: "Design & Creativity", status: "Read", cover: "assets/books/don-t-make-me-think-steve-krug.jpg", coverSource: "https://covers.openlibrary.org/b/isbn/9780321965516-L.jpg", coverVerified: true, isbn: "9780321965516", edition: null, about: "A short, practical classic on how people actually scan and move through interfaces.", motivation: "A short, practical classic on how people actually move through interfaces.", hopes: "How to reduce friction and make screens immediately understandable.", lessons: [], work: null, reflectionStatus: "starter" },
    { id: "sprint", title: "Sprint", author: "Jake Knapp", section: "Design & Creativity", category: "Design & Creativity", status: "Read", cover: "assets/books/sprint-jake-knapp.jpg", coverSource: "https://covers.openlibrary.org/b/isbn/9781501121746-L.jpg", coverVerified: true, isbn: "9781501121746", edition: null, about: "A five-day process for testing a big idea before committing to build it.", motivation: null, hopes: null, lessons: [], work: null, reflectionStatus: "empty" },
    { id: "show-your-work", title: "Show Your Work!", author: "Austin Kleon", section: "Design & Creativity", category: "Design & Creativity", status: "Read", cover: "assets/books/show-your-work-austin-kleon.jpg", coverSource: "https://books.google.com/books?vid=ISBN9780761178972&printsec=frontcover&img=1&zoom=2", coverVerified: true, isbn: "9780761178972", edition: null, about: "An argument for sharing the process, not only the finished work.", motivation: "A gentle argument for sharing the process, not only the finished thing.", hopes: "How to document and share work-in-progress with confidence.", lessons: [], work: null, reflectionStatus: "starter" },
    { id: "steal-like-an-artist", title: "Steal Like an Artist", author: "Austin Kleon", section: "Design & Creativity", category: "Design & Creativity", status: "Read", cover: "assets/books/steal-like-an-artist-austin-kleon.jpg", coverSource: "https://books.google.com/books?vid=ISBN9780761169253&printsec=frontcover&img=1&zoom=2", coverVerified: true, isbn: "9780761169253", edition: null, about: "A short book on creativity as influence: nothing is fully original, so collect and remix.", motivation: null, hopes: null, lessons: [], work: null, reflectionStatus: "empty" },

    /* --- Personal Growth · Read (6–7) --- */
    { id: "atomic-habits", title: "Atomic Habits", author: "James Clear", section: "Personal Growth", category: "Personal Growth", status: "Read", cover: "assets/books/atomic-habits-james-clear.jpg", coverSource: "https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg", coverVerified: true, isbn: "9780735211292", edition: null, about: "A practical framework for building and sustaining small, repeatable habits.", motivation: "A structured way to think about small, repeatable change.", hopes: "How to build and sustain habits that support long-term creative work.", lessons: [], work: null, reflectionStatus: "starter" },
    { id: "subtle-art", title: "The Subtle Art of Not Giving a F*ck", author: "Mark Manson", section: "Personal Growth", category: "Personal Growth", status: "Read", cover: "assets/books/the-subtle-art-of-not-giving-a-f-ck-mark-manson.jpg", coverSource: "https://covers.openlibrary.org/b/isbn/9780062457714-L.jpg", coverVerified: true, isbn: "9780062457714", edition: null, about: "A blunt counter to the self-improvement treadmill, built on choosing what to care about.", motivation: null, hopes: null, lessons: [], work: null, reflectionStatus: "empty" },

    /* --- Faith & Deen · Read (8–10) --- */
    { id: "rulings-muslim-woman", title: "Rulings Pertaining to the Muslim Woman", author: "Salih Al-Fawzaan", section: "Faith & Deen", category: "Faith & Deen", status: "Read", cover: "assets/books/rulings-pertaining-to-the-muslim-woman-salih-al-fawzaan.jpg", coverSource: "https://darussalamus.com/cdn/shop/files/rulingspertainingtomuslimwomen_1.jpg", coverVerified: true, isbn: "9789960293479", edition: "Darussalam, 1st ed. October 2002, trans. Burhan Loqueman", about: "A collection of jurisprudential rulings for Muslim women across everyday life and special events.", motivation: null, hopes: null, lessons: [], work: null, reflectionStatus: "empty" },
    { id: "disease-and-the-cure", title: "The Disease and the Cure", author: "Ibn al-Qayyim", section: "Faith & Deen", category: "Faith & Deen", status: "Read", cover: "assets/books/the-disease-and-the-cure-ibn-al-qayyim.jpg", coverSource: "https://www.emaanlibrary.com/wp-content/uploads/2022/01/The-Disease-The-Cure-Imam-Ibn-Al-Qayyim-compressed.pdf (Hikmah Publications cover, page 1)", coverVerified: false, isbn: "9781532369414", edition: "Hikmah Publications, 2020, trans. Osman Hamid", about: "Ibn al-Qayyim's classical work on the diseases of the heart and their remedies (Ad-Da' wa Ad-Dawa').", motivation: null, hopes: null, lessons: [], work: null, reflectionStatus: "empty" },
    { id: "my-hifdh-guide", title: "My Hifdh Guide", author: "Abdulrasaq Bilal Oyeniran (IbnulArobiy)", section: "Faith & Deen", category: "Faith & Deen", status: "Read", cover: "assets/books/my-hifdh-guide-abdulrasaq-bilal-oyeniran.png", coverSource: "user-supplied cover (provided by the designer)", coverVerified: true, isbn: null, edition: null, about: "A guide to memorising the Qur'an.", motivation: null, hopes: null, lessons: [], work: null, reflectionStatus: "empty" },

    /* --- Business · Read (11–14) --- */
    { id: "personal-mba", title: "The Personal MBA", author: "Josh Kaufman", section: "Business", category: "Business", status: "Read", cover: "assets/books/the-personal-mba-josh-kaufman.jpg", coverSource: "https://covers.openlibrary.org/b/isbn/9781591845577-L.jpg", coverVerified: true, isbn: "9781591845577", edition: null, about: "A distillation of the core mental models behind business.", motivation: "A self-directed route into the business ideas behind the products I design.", hopes: "The mental models that connect design decisions to how businesses work.", lessons: [], work: null, reflectionStatus: "starter" },
    { id: "mom-test", title: "The Mom Test", author: "Rob Fitzpatrick", section: "Business", category: "Business", status: "Read", cover: "assets/books/the-mom-test-rob-fitzpatrick.jpg", coverSource: "https://covers.openlibrary.org/b/isbn/9781492180746-L.jpg", coverVerified: true, isbn: "9781492180746", edition: null, about: "A compact guide to customer conversations that produce honest signal.", motivation: "A compact guide to talking to people without leading them to false answers.", hopes: "How to ask better questions and get honest, useful signal.", lessons: [], work: null, reflectionStatus: "starter" },
    { id: "lean-startup", title: "The Lean Startup", author: "Eric Ries", section: "Business", category: "Business", status: "Read", cover: "assets/books/the-lean-startup-eric-ries.jpg", coverSource: "https://covers.openlibrary.org/b/isbn/9780307887894-L.jpg", coverVerified: true, isbn: "9780307887894", edition: null, about: "A method for learning and iterating quickly under uncertainty.", motivation: "A method for learning quickly and iterating under uncertainty.", hopes: "How to test ideas and validate direction before over-investing.", lessons: [], work: null, reflectionStatus: "starter" },
    { id: "psychology-of-money", title: "The Psychology of Money", author: "Morgan Housel", section: "Business", category: "Business", status: "Read", cover: "assets/books/the-psychology-of-money-morgan-housel.jpg", coverSource: "https://covers.openlibrary.org/b/isbn/9780857197689-L.jpg", coverVerified: true, isbn: "9780857197689", edition: null, about: "Essays on how behaviour, not just knowledge, shapes financial decisions.", motivation: "Short essays on how behaviour, not just knowledge, shapes financial decisions.", hopes: "How to think about money with more patience and less emotion.", lessons: [], work: null, reflectionStatus: "starter" },

    /* --- Design & Product → Design & Creativity · To read (15–16) --- */
    { id: "inspired", title: "INSPIRED", author: "Marty Cagan", section: "Design & Product", category: "Design & Creativity", status: "To read", cover: "assets/books/inspired-how-to-create-tech-products-customers-love-marty-cagan.jpg", coverSource: "https://covers.openlibrary.org/b/isbn/9781119387503-L.jpg", coverVerified: true, isbn: "9781119387503", edition: null, about: "How strong product teams are built and how good products get made.", motivation: "A look at how strong product teams are built and how good products get made.", hopes: "How product discovery and delivery work beyond the design layer.", lessons: [], work: null, reflectionStatus: "starter" },
    { id: "articulating-design-decisions", title: "Articulating Design Decisions", author: "Tom Greever", section: "Design & Product", category: "Design & Creativity", status: "To read", cover: "assets/books/articulating-design-decisions-tom-greever.jpg", coverSource: "https://covers.openlibrary.org/b/isbn/9781491921562-L.jpg", coverVerified: true, isbn: "9781491921562", edition: null, about: "How to communicate design choices so stakeholders can agree on them.", motivation: "The gap between good design and getting stakeholders to agree with it.", hopes: "How to explain and defend design choices clearly and calmly.", lessons: [], work: null, reflectionStatus: "starter" },

    /* --- Personal Growth · To read (17–19) --- */
    { id: "deep-work", title: "Deep Work", author: "Cal Newport", section: "Personal Growth", category: "Personal Growth", status: "To read", cover: "assets/books/deep-work-cal-newport.jpg", coverSource: "https://covers.openlibrary.org/b/isbn/9781455586691-L.jpg", coverVerified: true, isbn: "9781455586691", edition: null, about: "A case for protecting focused, undistracted attention at work.", motivation: "A case for protecting focused attention in a distracted working life.", hopes: "How to structure time for meaningful, undistracted work.", lessons: [], work: null, reflectionStatus: "starter" },
    { id: "essentialism", title: "Essentialism", author: "Greg McKeown", section: "Personal Growth", category: "Personal Growth", status: "To read", cover: "assets/books/essentialism-greg-mckeown.jpg", coverSource: "https://covers.openlibrary.org/b/id/10658806-L.jpg", coverVerified: true, isbn: "9780804137386", edition: null, about: "The disciplined pursuit of less — doing fewer things, better.", motivation: "A reminder that doing fewer things well can matter more than doing more.", hopes: "How to make deliberate choices about where energy goes.", lessons: [], work: null, reflectionStatus: "starter" },
    { id: "mindset", title: "Mindset: The New Psychology of Success", author: "Carol S. Dweck", section: "Personal Growth", category: "Personal Growth", status: "To read", cover: "assets/books/mindset-the-new-psychology-of-success-carol-s-dweck.jpg", coverSource: "https://covers.openlibrary.org/b/isbn/9780345472328-L.jpg", coverVerified: true, isbn: "9780345472328", edition: null, about: "The idea that ability can grow, and how that reshapes effort and failure.", motivation: "The idea that ability can grow, which reshapes how failure feels.", hopes: "How a growth mindset changes the way I approach hard problems.", lessons: [], work: null, reflectionStatus: "starter" },

    /* --- Thinking & Communication → Personal Growth · To read (20–22) --- */
    { id: "thinking-in-systems", title: "Thinking in Systems", author: "Donella H. Meadows", section: "Thinking & Communication", category: "Personal Growth", status: "To read", cover: "assets/books/thinking-in-systems-donella-h-meadows.jpg", coverSource: "https://covers.openlibrary.org/b/isbn/9781603580557-L.jpg", coverVerified: true, isbn: "9781603580557", edition: null, about: "A lens for seeing how parts connect and why systems behave the way they do.", motivation: "A lens for seeing how parts connect and why systems behave the way they do.", hopes: "How to reason about complex, interconnected problems.", lessons: [], work: null, reflectionStatus: "starter" },
    { id: "thinking-fast-and-slow", title: "Thinking, Fast and Slow", author: "Daniel Kahneman", section: "Thinking & Communication", category: "Personal Growth", status: "To read", cover: "assets/books/thinking-fast-and-slow-daniel-kahneman.jpg", coverSource: "https://covers.openlibrary.org/b/isbn/9780374533557-L.jpg", coverVerified: true, isbn: "9780374533557", edition: null, about: "A study of how intuition and deliberate thought interact.", motivation: "A close study of how intuition and deliberate thought interact.", hopes: "To recognise the biases that shape everyday judgement.", lessons: [], work: null, reflectionStatus: "starter" },
    { id: "made-to-stick", title: "Made to Stick", author: "Chip Heath and Dan Heath", section: "Thinking & Communication", category: "Personal Growth", status: "To read", cover: "assets/books/made-to-stick-chip-heath.jpg", coverSource: "https://books.google.com/books?vid=ISBN9781400064281&printsec=frontcover&img=1&zoom=4", coverVerified: true, isbn: "9781400064281", edition: null, about: "Why some ideas survive and others are forgotten, and how to make ideas memorable.", motivation: "How some ideas survive and others disappear the moment they are shared.", hopes: "How to make ideas clear and memorable for the people who see them.", lessons: [], work: null, reflectionStatus: "starter" },

    /* --- Title to confirm (23) — placed under Design & Creativity --- */
    { id: "artists-way", title: "The Artist's Way", author: "Julia Cameron", section: "To confirm", category: "Design & Creativity", status: "To read", cover: "assets/books/the-artist-s-way-julia-cameron.jpg", coverSource: "https://covers.openlibrary.org/b/id/111743-L.jpg", coverVerified: true, isbn: "9781585421466", edition: null, about: "A structured course for recovering and sustaining a creative practice. Listed under the brief's section whose exact title is still to be confirmed.", motivation: null, hopes: null, lessons: [], work: null, reflectionStatus: "empty" },

    /* --- UoPeople & Computer Science · course resources · To read (24–26) --- */
    { id: "college-success", title: "College Success", author: "Amy Baldwin", section: "UoPeople & Computer Science", category: "UoPeople & Computer Science", status: "To read", cover: "assets/books/college-success-amy-baldwin.jpg", coverSource: "https://covers.openlibrary.org/b/id/15113587-L.jpg", coverVerified: true, isbn: null, edition: "Open Library edition (first published 2020)", about: "A practical foundation for study skills and the transition into university-level learning.", motivation: null, hopes: null, lessons: [], work: null, reflectionStatus: "empty" },
    { id: "think-python", title: "Think Python: How to Think Like a Computer Scientist", author: "Allen B. Downey", section: "UoPeople & Computer Science", category: "UoPeople & Computer Science", status: "To read", cover: "assets/books/think-python-how-to-think-like-a-computer-scientist-allen-b-downey.jpg", coverSource: "https://covers.openlibrary.org/b/id/736943-L.jpg", coverVerified: true, isbn: "9781491939369", edition: null, about: "An introduction to programming and computational thinking through Python.", motivation: null, hopes: null, lessons: [], work: null, reflectionStatus: "empty" },
    { id: "basics-of-python-programming", title: "Basics of Python Programming: A Quick Guide for Beginners", author: "Krishna Kumar Mohbey and Malika Acharya", section: "UoPeople & Computer Science", category: "UoPeople & Computer Science", status: "To read", cover: "assets/books/basics-of-python-programming-mohbey-acharya.jpg", coverSource: "https://books.google.com/books?vid=ISBN9789815179644&printsec=frontcover&img=1&zoom=4", coverVerified: true, isbn: "9789815179644", edition: "Bentham Science Publishers, 2023", about: "A beginner's guide to Python fundamentals through to machine-learning basics.", motivation: null, hopes: null, lessons: [], work: null, reflectionStatus: "empty" }
  ]
};
