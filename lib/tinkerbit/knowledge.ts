// ✦ tinkerbit's brain ✦
// a static, hand-written knowledge base. no AI, no server, no tracking.
// every answer lives in this file, edit it like you'd edit a zine.
//
// to teach tinkerbit something new: add an Entry.
// keywords = words a person might actually type. more keywords = better matching.

export type Entry = {
  id: string;
  // short display name, e.g. "resistor decoder"
  name: string;
  category:
    | "electronics"
    | "e-textiles"
    | "code & dev"
    | "generative text"
    | "color & design"
    | "print & zine"
    | "measurements"
    | "about"
    | "know-how";
  // route on tinytinker.tools, if this entry points at a tool
  href?: string;
  // what tinkerbit says when this entry is the best match
  answer: string;
  // matching vocabulary, lowercase, single words or short phrases
  keywords: string[];
};

export const KNOWLEDGE: Entry[] = [
  // electronics
  {
    id: "resistor",
    name: "resistor decoder",
    category: "electronics",
    href: "/tools/resistor",
    answer:
      "the resistor decoder turns color bands into a resistance value + tolerance. pick your bands (4, 5, or 6 band resistors) and it reads them for you — no chart squinting required.",
    keywords: [
      "resistor",
      "resistance",
      "color band",
      "bands",
      "ohm",
      "ohms",
      "tolerance",
      "decode resistor",
      "read resistor",
      "stripe",
      "4 band",
      "5 band",
    ],
  },
  {
    id: "ohms-law",
    name: "ohm's law calc",
    category: "electronics",
    href: "/tools/ohms-law",
    answer:
      "the ohm's law calc solves for voltage, current, resistance, or power — give it any two and it finds the rest. it also includes an LED resistor calculator, so if you're wiring an LED and wondering what resistor to use, that's the spot.",
    keywords: [
      "ohm",
      "ohms law",
      "voltage",
      "current",
      "amps",
      "amperage",
      "watts",
      "power",
      "led resistor",
      "led",
      "v=ir",
      "series resistor",
      "current limiting",
    ],
  },
  {
    id: "wire-gauge",
    name: "wire gauge reference",
    category: "electronics",
    href: "/tools/wire-gauge",
    answer:
      "the wire gauge reference converts AWG ↔ mm² and lists ampacity (how much current a wire can safely carry) and resistance per km for each gauge. handy for picking wire for a project.",
    keywords: [
      "wire",
      "gauge",
      "awg",
      "mm2",
      "ampacity",
      "wire thickness",
      "wire size",
      "current capacity",
      "hookup wire",
    ],
  },
  {
    id: "capacitor",
    name: "capacitor decoder",
    category: "electronics",
    href: "/tools/capacitor",
    answer:
      "the capacitor decoder reads 2-digit, 3-digit, and EIA-198 codes and gives you the actual capacitance value. type in what’s printed on the cap (like “104”) and it tells you what you’re holding.",
    keywords: [
      "capacitor",
      "capacitance",
      "farad",
      "microfarad",
      "uf",
      "nf",
      "pf",
      "104",
      "cap code",
      "eia",
      "ceramic capacitor",
    ],
  },
  {
    id: "555-timer",
    name: "555 timer calculator",
    category: "electronics",
    href: "/tools/555-timer",
    answer:
      "the 555 timer calculator handles both astable (oscillating) and monostable (one-shot) modes — plug in your resistor and capacitor values to get frequency, duty cycle, and timing.",
    keywords: [
      "555",
      "timer",
      "astable",
      "monostable",
      "oscillator",
      "frequency",
      "duty cycle",
      "blink",
      "pulse",
      "ne555",
    ],
  },
  {
    id: "voltage-divider",
    name: "voltage divider",
    category: "electronics",
    href: "/tools/voltage-divider",
    answer:
      "the voltage divider tool solves for Vout, R1, R2, or Vin. useful for scaling a voltage down — like reading a 5V signal on a 3.3V microcontroller pin, or working with voltage-dividing sensors (velostat, photoresistors, flex sensors…).",
    keywords: [
      "voltage divider",
      "divider",
      "vout",
      "r1",
      "r2",
      "scale voltage",
      "step down",
      "sensor circuit",
      "photoresistor",
      "velostat",
      "flex sensor",
      "analog read",
    ],
  },

  // e-textiles
  {
    id: "conductive-thread",
    name: "conductive thread calc",
    category: "e-textiles",
    href: "/tools/conductive-thread",
    answer:
      "the conductive thread tool calculates resistance for a sewn trace — pick your thread type and length to see how much resistance your stitching adds, and whether your circuit will still behave. essential before committing to a long embroidered trace.",
    keywords: [
      "conductive thread",
      "thread resistance",
      "sewn trace",
      "stitch",
      "sew circuit",
      "thread calc",
      "trace length",
      "embroidery circuit",
    ],
  },
  {
    id: "fabric-resistance",
    name: "fabric & materials reference",
    category: "e-textiles",
    href: "/tools/fabric-resistance",
    answer:
      "the fabric & materials reference lists resistance properties of conductive fabrics, velostat, eeonyx, copper tape, and other soft-circuit materials — so you can pick the right material for a sensor or trace before you cut into your stash.",
    keywords: [
      "fabric resistance",
      "conductive fabric",
      "materials",
      "eeonyx",
      "copper tape",
      "soft circuit material",
      "material reference",
      "resistive fabric",
    ],
  },

  // code & dev
  {
    id: "code-identifier",
    name: "code identifier",
    category: "code & dev",
    href: "/tools/code-identifier",
    answer:
      "the code identifier uses pattern matching to guess which of 41 programming languages a snippet is written in. paste mystery code, get a language.",
    keywords: [
      "identify code",
      "what language",
      "programming language",
      "detect language",
      "code identifier",
      "snippet",
      "mystery code",
    ],
  },
  {
    id: "binary-hex",
    name: "binary / hex converter",
    category: "code & dev",
    href: "/tools/binary-converter",
    answer:
      "the binary / hex converter takes text & numbers and converts between binary, hex, octal, and decimal. good for decoding bytes, checking bitmasks, or writing secret notes in binary.",
    keywords: [
      "binary",
      "hex",
      "hexadecimal",
      "octal",
      "decimal",
      "base",
      "convert number",
      "bits",
      "bytes",
      "ascii code",
    ],
  },
  {
    id: "regex",
    name: "regex tester",
    category: "code & dev",
    href: "/tools/regex-tester",
    answer:
      "the regex tester gives you live highlighting as you type, supports named groups, and has a replace mode. test your pattern against real text before it goes anywhere near production.",
    keywords: [
      "regex",
      "regular expression",
      "pattern",
      "match",
      "capture group",
      "named group",
      "replace",
      "test regex",
    ],
  },
  {
    id: "json",
    name: "json formatter",
    category: "code & dev",
    href: "/tools/json-formatter",
    answer:
      "the json formatter formats, validates, and minifies JSON. paste in tangled JSON and get it pretty-printed — or squished down for shipping.",
    keywords: [
      "json",
      "format json",
      "validate",
      "minify",
      "pretty print",
      "parse",
      "api response",
    ],
  },
  {
    id: "timestamp",
    name: "timestamp converter",
    category: "code & dev",
    href: "/tools/timestamp-converter",
    answer:
      "the timestamp converter goes both ways between unix timestamps and human-readable dates. paste an epoch number, get an actual date — or the reverse.",
    keywords: [
      "timestamp",
      "unix",
      "epoch",
      "date",
      "time",
      "convert date",
      "utc",
      "milliseconds",
    ],
  },

  // generative text
  {
    id: "markov",
    name: "markov generator",
    category: "generative text",
    href: "/tools/markov",
    answer:
      "the markov generator trains on any corpus you paste in and generates new text in its style. a markov chain predicts each next word from the ones before it — feed it a poem, a diary, a manual, anything, and see what grows.",
    keywords: [
      "markov",
      "markov chain",
      "generate text",
      "corpus",
      "text generation",
      "generative",
      "ngram",
      "predictive text",
      "write like",
    ],
  },
  {
    id: "cut-up",
    name: "cut-up machine",
    category: "generative text",
    href: "/tools/cutup",
    answer:
      "the cut-up machine does burroughs-style text reassembly — it slices your text into fragments and rearranges them, the way william burroughs and brion gysin did with scissors and newspaper. paste text, cut it up, find accidental poetry.",
    keywords: [
      "cut up",
      "cutup",
      "burroughs",
      "dada",
      "rearrange",
      "remix text",
      "collage",
      "fragments",
      "found poetry",
    ],
  },
  {
    id: "glitch-text",
    name: "glitch text",
    category: "generative text",
    href: "/tools/glitch-text",
    answer:
      "the glitch text tool transforms text into zalgo, wide (vaporwave), mirror, morse, binary, and more. good for unsettling usernames and cursed captions.",
    keywords: [
      "glitch",
      "zalgo",
      "cursed text",
      "vaporwave",
      "wide text",
      "mirror",
      "morse",
      "weird text",
      "fancy text",
      "unicode",
    ],
  },
  {
    id: "zine-filler",
    name: "zine filler",
    category: "generative text",
    href: "/tools/zine-filler",
    answer:
      "zine filler generates placeholder text in 5 flavors — like lorem ipsum, but with personality. useful when you’re laying out a zine or mockup and need words that aren’t final.",
    keywords: [
      "placeholder",
      "lorem ipsum",
      "filler",
      "dummy text",
      "mockup text",
      "zine filler",
    ],
  },
  {
    id: "ascii",
    name: "ascii generator",
    category: "generative text",
    href: "/tools/ascii",
    answer:
      "the ascii generator makes big text banners, converts images → ascii art, and generates patterns. terminal decoration, README headers, plaintext art.",
    keywords: [
      "ascii",
      "ascii art",
      "big text",
      "banner",
      "image to ascii",
      "figlet",
      "text art",
      "pattern",
    ],
  },

  // color & design
  {
    id: "palette",
    name: "color palette gen",
    category: "color & design",
    href: "/tools/palette",
    answer:
      "the color palette generator builds palettes in 6 harmony modes (complementary, analogous, triadic, and friends) — click any swatch to copy it. start from a color you love, get a family that goes with it.",
    keywords: [
      "palette",
      "color palette",
      "color scheme",
      "harmony",
      "complementary",
      "analogous",
      "triadic",
      "swatches",
      "colors that match",
    ],
  },
  {
    id: "color-converter",
    name: "color converter",
    category: "color & design",
    href: "/tools/color-converter",
    answer:
      "the color converter translates between hex ↔ rgb ↔ hsl ↔ hsv ↔ oklch ↔ cmyk. paste a color in any format, take it out in another.",
    keywords: [
      "convert color",
      "hex",
      "rgb",
      "hsl",
      "hsv",
      "oklch",
      "cmyk",
      "hex to rgb",
      "color format",
    ],
  },
  {
    id: "hex-namer",
    name: "hex color namer",
    category: "color & design",
    href: "/tools/hex-name",
    answer:
      "the hex color namer gives any hex code a poetic name plus its nearest css color name. #c8b8e8 is more than a number — find out what it’s actually called.",
    keywords: [
      "name color",
      "color name",
      "poetic",
      "css color",
      "what color is",
      "hex name",
    ],
  },
  {
    id: "color-cheatsheet",
    name: "color cheatsheet",
    category: "color & design",
    href: "/tools/color-cheatsheet",
    answer:
      "the color cheatsheet is a browsable reference of css, tailwind, material, pastel, neon, and earth palettes — all the named colors in one lavender-tinted place.",
    keywords: [
      "cheatsheet",
      "css colors",
      "tailwind colors",
      "material",
      "pastel",
      "neon",
      "earth tones",
      "color reference",
      "color list",
    ],
  },
  {
    id: "accessibility",
    name: "accessibility checker",
    category: "color & design",
    href: "/tools/accessibility",
    answer:
      "the accessibility checker tests contrast ratio between two colors (against WCAG levels), simulates color blindness, and checks whether your text is actually readable. run your palette through it before you ship.",
    keywords: [
      "accessibility",
      "a11y",
      "contrast",
      "wcag",
      "color blind",
      "colorblind",
      "readable",
      "contrast ratio",
      "aa",
      "aaa",
    ],
  },

  // print & zine
  {
    id: "zine-imposer",
    name: "zine imposer",
    category: "print & zine",
    href: "/tools/zine-imposer",
    answer:
      "the zine imposer lays out an 8-page mini-zine on a single sheet (with the pages rotated and ordered correctly for folding) and includes a folding guide. print, fold, one snip, done — you have a zine.",
    keywords: [
      "zine",
      "imposition",
      "imposer",
      "fold",
      "mini zine",
      "8 page",
      "booklet",
      "print layout",
      "folding guide",
      "one page zine",
    ],
  },

  // measurements
  {
    id: "unit-converter",
    name: "unit converter",
    category: "measurements",
    href: "/tools/unit-converter",
    answer:
      "the unit converter handles length, weight, temperature, fabric, data, wire, pressure, and speed. yes — fabric. yards of felt to meters, at last.",
    keywords: [
      "unit",
      "convert units",
      "length",
      "weight",
      "temperature",
      "celsius",
      "fahrenheit",
      "inches",
      "cm",
      "fabric",
      "yards",
      "meters",
      "pressure",
      "speed",
      "data size",
    ],
  },

  // about the site
  {
    id: "about-site",
    name: "about tinytinker.tools",
    category: "about",
    answer:
      "tinytinker✦tools is a soft toolkit for curious makers — tiny, focused utilities for electronics, generative text, color, zines & more, all free and open source (MIT). everything runs 100% client-side: no backend, no database, no logins, no ads. it’s made by yafira (electrocute.io), a design engineer & creative technologist from NYU ITP.",
    keywords: [
      "about",
      "tinytinker",
      "what is this",
      "who made",
      "yafira",
      "electrocute",
      "open source",
      "license",
      "mit",
      "free",
      "website",
      "site",
    ],
  },
  {
    id: "about-privacy",
    name: "privacy",
    category: "about",
    answer:
      "nothing you do here leaves your browser. the tools run entirely client-side — no backend, no database, no api keys, no analytics on your inputs. and me? i’m not an AI. i’m a little lookup table with opinions. this conversation lives only in this window and disappears when you close it.",
    keywords: [
      "privacy",
      "tracking",
      "data",
      "analytics",
      "cookies",
      "store",
      "save",
      "server",
      "are you ai",
      "chatgpt",
      "llm",
      "private",
      "safe",
    ],
  },
  {
    id: "about-tinkerbit",
    name: "about tinkerbit",
    category: "about",
    answer:
      "hi! i’m tinkerbit ✦ — the resident companion of tinytinker.tools. i’m not an AI: i’m a hand-written knowledge base with a fuzzy little search engine attached. ask me which tool to use, or small questions about electronics, color, text, and zines. everything i know was written by a person.",
    keywords: [
      "tinkerbit",
      "who are you",
      "what are you",
      "hello",
      "hi",
      "hey",
      "help",
      "what can you do",
    ],
  },
  {
    id: "about-contributing",
    name: "contributing",
    category: "about",
    answer:
      "tinytinker.tools is open source — contributions welcome! each tool is a single self-contained file. to add one: create a folder in app/tools/, add a page.tsx using the ToolPage wrapper, register it in the nav, grid, and featured list, and open a pull request. there’s a full guide in CONTRIBUTING.md on GitHub, and a tool request form at /request if you’d rather suggest than build.",
    keywords: [
      "contribute",
      "contributing",
      "add a tool",
      "pull request",
      "github",
      "request",
      "suggest",
      "new tool",
      "idea",
    ],
  },

  // guide questions
  // "how do i pick / find / do" — meta-questions about the toolkit itself.
  {
    id: "guide-pick-tool",
    name: "picking the right tool",
    category: "about",
    answer:
      "tell me what you’re trying to *do* and i’ll point you somewhere ✦ roughly: reading a component or building a circuit → electronics · sewing circuits into fabric → e-textiles · wrangling code, JSON, regex, timestamps → code & dev · making weird or generative words → generative text · picking, converting, or checking colors → color & design · making a zine → print & zine · converting units → measurements. or just describe your project in a sentence!",
    keywords: [
      "pick the right tool",
      "which tool",
      "what tool",
      "right tool",
      "choose",
      "recommend",
      "where do i start",
      "start",
      "best tool",
      "not sure",
      "what should i",
      "point me",
    ],
  },
  {
    id: "guide-find",
    name: "finding things on the site",
    category: "about",
    answer:
      "everything lives in the sidebar, grouped by category — electronics, e-textiles, code & dev, generative text, color & design, print & zine, measurements. the homepage has the full grid too. or just ask me by task: “decode a resistor”, “make cut-up poetry”, “check contrast” — i’ll link you straight there ✦",
    keywords: [
      "find",
      "where is",
      "navigate",
      "sidebar",
      "menu",
      "homepage",
      "search the site",
      "looking for",
      "cant find",
      "browse",
    ],
  },
  {
    id: "guide-how-to-use",
    name: "how the tools work",
    category: "about",
    answer:
      "every tool here works the same way: open it, put something in, get something out — instantly, in your browser. no accounts, no saving, no waiting. if a tool seems confusing, ask me about it by name and i’ll explain what it does. if it seems broken, that’s a bug worth reporting on github ✦",
    keywords: [
      "how do i use",
      "how does this work",
      "how it works",
      "instructions",
      "tutorial",
      "guide",
      "confused",
      "help me use",
      "getting started",
    ],
  },
  {
    id: "guide-learning",
    name: "learning creative tech",
    category: "about",
    answer:
      "good places to grow: adafruit learn (electronics + circuitpython tutorials), kobakant’s “how to get what you want” (the e-textiles bible), the coding train on youtube (creative coding, generously taught), and allison parrish’s writings on generative text. and honestly — pick a tiny project and make it badly first. the tools here are good company along the way ✦",
    keywords: [
      "learn",
      "learning",
      "resources",
      "beginner",
      "new to",
      "tutorials",
      "creative tech",
      "creative coding",
      "where to learn",
      "books",
      "courses",
      "adafruit",
      "kobakant",
    ],
  },

  // tiny know-how
  // small, accurate answers to common maker questions.
  // these point at tools when one exists.
  {
    id: "kh-led-resistor",
    name: "picking an LED resistor",
    category: "know-how",
    href: "/tools/ohms-law",
    answer:
      "to pick a resistor for an LED: R = (supply voltage − LED forward voltage) ÷ LED current. a typical red LED drops ~2V and likes ~20mA, so on 5V that’s (5−2)/0.02 = 150Ω — round up to a standard value like 220Ω to be gentle. the ohm’s law calc has an LED resistor mode that does this for you.",
    keywords: [
      "led resistor",
      "burn out led",
      "resistor for led",
      "forward voltage",
      "20ma",
      "220",
      "led circuit",
      "protect led",
    ],
  },
  {
    id: "kh-conductive-thread",
    name: "conductive thread",
    category: "know-how",
    href: "/tools/conductive-thread",
    answer:
      "conductive thread is thread spun with stainless steel or silver — it carries current, so you can sew circuits into fabric. it has real resistance (often ~1–30Ω per foot depending on ply), so keep traces short, avoid crossing paths, and seal knots with a dot of clear nail polish so they don’t fray loose.",
    keywords: [
      "conductive thread",
      "e-textile",
      "etextile",
      "sew circuit",
      "soft circuit",
      "wearable",
      "sewable",
      "lilypad",
      "stainless thread",
      "fabric circuit",
    ],
  },
  {
    id: "kh-velostat",
    name: "velostat",
    category: "know-how",
    href: "/tools/fabric-resistance",
    answer:
      "velostat is a pressure-sensitive conductive film — its resistance drops when you squeeze it. sandwich it between two conductive layers (copper tape, conductive fabric) and read it through a voltage divider on an analog pin to make soft pressure sensors, squeezable buttons, and fabric interfaces.",
    keywords: [
      "velostat",
      "pressure sensor",
      "force sensor",
      "fsr",
      "squeeze",
      "soft sensor",
      "diy sensor",
      "linqstat",
    ],
  },
  {
    id: "kh-pwm",
    name: "PWM (pulse width modulation)",
    category: "know-how",
    answer:
      "PWM (pulse width modulation) fakes an analog output by switching a pin on and off very fast — the “duty cycle” (% of time on) sets the effective level. it’s how microcontrollers dim LEDs, drive motor speed, and hum through speakers. on Arduino that’s analogWrite(); in CircuitPython it’s pwmio.",
    keywords: [
      "pwm",
      "pulse width",
      "duty cycle",
      "dim led",
      "analogwrite",
      "fade",
      "motor speed",
      "pwmio",
    ],
  },
  {
    id: "kh-pullup",
    name: "pull-up & pull-down resistors",
    category: "know-how",
    answer:
      "a pull-up (or pull-down) resistor gives an input pin a default state so it doesn’t “float” and read random noise. a pull-up ties the pin to power through a resistor (usually 10kΩ) so it reads HIGH until a button pulls it LOW. most microcontrollers have internal pull-ups you can enable in code — the reason your button “randomly triggers” is almost always a floating pin.",
    keywords: [
      "pull up",
      "pullup",
      "pull down",
      "floating pin",
      "button",
      "random trigger",
      "10k",
      "input pin",
      "debounce",
    ],
  },
  {
    id: "kh-hex-color",
    name: "how hex colors work",
    category: "know-how",
    href: "/tools/color-converter",
    answer:
      "a hex color like #c8b8e8 is three pairs of hexadecimal digits: red, green, blue — each from 00 (none) to ff (full). #c8b8e8 means red c8 (200), green b8 (184), blue e8 (232): a soft lavender. the color converter translates hex into rgb, hsl, oklch and more if you want to see all its identities.",
    keywords: [
      "hex color",
      "how hex works",
      "what is hex",
      "rgb values",
      "hexadecimal color",
      "color code",
    ],
  },
  {
    id: "kh-markov-explained",
    name: "what a markov chain is",
    category: "know-how",
    href: "/tools/markov",
    answer:
      "a markov chain generates text by looking at the last word (or few words) and picking a likely next word based on what followed it in the training text. no neural networks, no learning — just probabilities counted from a corpus. it’s one of the oldest and most charming generative text techniques, and there’s a markov generator here to play with.",
    keywords: [
      "what is markov",
      "how markov works",
      "markov explained",
      "n-gram",
      "order 2",
      "text prediction",
    ],
  },
  {
    id: "kh-contrast",
    name: "contrast ratios",
    category: "know-how",
    href: "/tools/accessibility",
    answer:
      "WCAG contrast ratio compares the relative luminance of text vs. background, from 1:1 (identical) to 21:1 (black on white). aim for at least 4.5:1 for body text (AA) and 3:1 for large text; 7:1 hits AAA. the accessibility checker computes this and simulates color blindness too.",
    keywords: [
      "contrast ratio",
      "4.5",
      "wcag aa",
      "readable text",
      "text on background",
      "luminance",
    ],
  },
];
