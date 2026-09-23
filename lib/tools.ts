// single source of truth for every tool.
// the sidebar, homepage grid, and featured section all read from here,
// so adding a tool means adding one entry below.

export type ToolTag =
  | "calc"
  | "gen"
  | "ref"
  | "decode"
  | "convert"
  | "test"
  | "plan"
  | "guide";

export interface Tool {
  href: string;
  label: string;
  // shorter label for the sidebar, falls back to label
  nav?: string;
  desc: string;
  tag: ToolTag;
}

export interface ToolSection {
  label: string;
  tools: Tool[];
}

export const toolSections: ToolSection[] = [
  {
    label: "electronics",
    tools: [
      {
        href: "/tools/resistor",
        label: "resistor decoder",
        desc: "color band → resistance value",
        tag: "decode",
      },
      {
        href: "/tools/ohms-law",
        label: "ohm's law",
        desc: "V, I, R, P solver + LED resistor",
        tag: "calc",
      },
      {
        href: "/tools/wire-gauge",
        label: "wire gauge reference",
        nav: "wire gauge ref",
        desc: "AWG ↔ mm², ampacity, resistance",
        tag: "ref",
      },
      {
        href: "/tools/capacitor",
        label: "capacitor decoder",
        desc: "capacitor code → value",
        tag: "decode",
      },
      {
        href: "/tools/555-timer",
        label: "555 timer",
        desc: "astable & monostable frequency calculator",
        tag: "calc",
      },
      {
        href: "/tools/voltage-divider",
        label: "voltage divider",
        desc: "solve for Vout, R1, R2, or Vin + load check",
        tag: "calc",
      },
    ],
  },
  {
    label: "e-textiles",
    tools: [
      {
        href: "/tools/conductive-thread",
        label: "conductive thread",
        desc: "thread resistance + LED circuit check",
        tag: "calc",
      },
      {
        href: "/tools/fabric-resistance",
        label: "fabric & materials",
        desc: "resistance ref for conductive fabrics, sensors & insulators",
        tag: "ref",
      },
    ],
  },
  {
    label: "code & dev",
    tools: [
      {
        href: "/tools/json-formatter",
        label: "json formatter",
        desc: "format, validate and minify json",
        tag: "convert",
      },
      {
        href: "/tools/timestamp-converter",
        label: "timestamp converter",
        desc: "unix timestamps ↔ human readable dates",
        tag: "convert",
      },
      {
        href: "/tools/code-identifier",
        label: "code identifier",
        desc: "detect programming language from a snippet",
        tag: "decode",
      },
      {
        href: "/tools/binary-converter",
        label: "binary / hex",
        desc: "text & numbers → binary, hex, octal",
        tag: "convert",
      },
      {
        href: "/tools/regex-tester",
        label: "regex tester",
        desc: "test regex patterns live",
        tag: "test",
      },
    ],
  },
  {
    label: "generative text",
    tools: [
      {
        href: "/tools/markov",
        label: "markov generator",
        desc: "generate text from any corpus",
        tag: "gen",
      },
      {
        href: "/tools/cutup",
        label: "cut-up machine",
        desc: "burroughs-style text reassembly",
        tag: "gen",
      },
      {
        href: "/tools/glitch-text",
        label: "glitch text",
        desc: "zalgo, wide, morse, binary & more",
        tag: "gen",
      },
      {
        href: "/tools/zine-filler",
        label: "zine filler",
        desc: "placeholder text in 5 flavors",
        tag: "gen",
      },
      {
        href: "/tools/ascii",
        label: "ascii generator",
        desc: "big text, image → ascii, patterns",
        tag: "gen",
      },
    ],
  },
  {
    label: "color & design",
    tools: [
      {
        href: "/tools/palette",
        label: "color palette",
        desc: "harmonious palettes from any seed color",
        tag: "gen",
      },
      {
        href: "/tools/color-converter",
        label: "color converter",
        desc: "hex ↔ rgb ↔ hsl ↔ oklch",
        tag: "convert",
      },
      {
        href: "/tools/hex-name",
        label: "hex color namer",
        desc: "give any hex a poetic name",
        tag: "decode",
      },
      {
        href: "/tools/color-cheatsheet",
        label: "color cheatsheet",
        desc: "css, tailwind, material, pastel & more",
        tag: "ref",
      },
      {
        href: "/tools/accessibility",
        label: "accessibility checker",
        desc: "contrast, color blindness & more",
        tag: "test",
      },
    ],
  },
  {
    label: "print & zine",
    tools: [
      {
        href: "/tools/zine-imposer",
        label: "zine imposer",
        desc: "8-page mini-zine fold layout",
        tag: "plan",
      },
    ],
  },
  {
    label: "measurements",
    tools: [
      {
        href: "/tools/unit-converter",
        label: "unit converter",
        desc: "length, weight, temp, fabric, wire & more",
        tag: "convert",
      },
    ],
  },
];

// flat list with each tool's category attached
export const allTools = toolSections.flatMap((section) =>
  section.tools.map((tool) => ({ ...tool, category: section.label })),
);
