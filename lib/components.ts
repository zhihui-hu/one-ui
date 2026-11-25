import { createElement, type ReactNode } from "react";
import { MotionIcon } from "@/components/Description/icons";
import type { ComponentTranslation } from "@/lib/i18n/types";
import enComponents from "@/locales/en/components.json";
import { registryItemUrl } from "@/lib/site";

export type Dependency = {
  name: string;
  icon?: ReactNode;
};

export type ComponentProp = {
  name: string;
  type: string;
  default?: string;
  required?: boolean;
  options?: string[];
  control?: "swatch";
  optionColors?: Record<string, string>;
  description: string;
};

export type ComponentCategory =
  | "ai"
  | "navigation"
  | "inputs"
  | "feedback"
  | "display"
  | "project";

export const CATEGORY_ORDER: ComponentCategory[] = [
  "display",
  "ai",
  "navigation",
  "inputs",
  "feedback",
  "project",
];

export type ComponentItem = {
  name: string;
  href: string;
  category: ComponentCategory;
  isNew?: boolean;
  description?: string;
  registry?: string;
  source?: string;
  preview?: string;
  previewScale?: number;
  featured?: boolean;
  dependencies?: Dependency[];
  interaction?: string;
  usage?: string;
  props?: ComponentProp[];
  credits?: string[];
};

export const REGISTRY_HOMEPAGE = "https://github.com/zhihui-hu/one-ui";

export const CONTACT_EMAIL = "ui@huzhihui.com";

type ComponentSource = Omit<
  ComponentItem,
  "name" | "description" | "interaction" | "props" | "credits"
> & {
  props?: Omit<ComponentProp, "description">[];
};

export const componentSlug = (href: string) =>
  href.slice(href.lastIndexOf("/") + 1);

// text lives in locales/<lang>/components.json; this file keeps only structure and code
function withText(
  item: ComponentSource,
  text: ComponentTranslation | undefined,
): ComponentItem {
  return {
    ...item,
    name: text?.name ?? componentSlug(item.href),
    description: text?.description,
    interaction: text?.interaction,
    credits: text?.credits,
    props: item.props?.map((prop) => ({
      ...prop,
      description: text?.props?.[prop.name] ?? "",
    })),
  };
}

export function localizeComponent(
  item: ComponentItem,
  translations: Record<string, ComponentTranslation>,
): ComponentItem {
  const text = translations[componentSlug(item.href)];
  if (!text) return item;
  return {
    ...item,
    name: text.name ?? item.name,
    description: text.description ?? item.description,
    interaction: text.interaction ?? item.interaction,
    credits: text.credits ?? item.credits,
    props: item.props?.map((prop) => ({
      ...prop,
      description: text.props?.[prop.name] ?? prop.description,
    })),
  };
}

const sources: ComponentSource[] = [
  {
    href: "/components/foldercomponent",
    category: "display",
    registry: "folder-component",
    source: `${REGISTRY_HOMEPAGE}/blob/main/components/ui/folder-component.tsx`,
    preview: "/componentdemos/foldercomponent.mp4",
    featured: true,
    dependencies: [
      {
        name: "motion",
        icon: createElement(MotionIcon, { className: "h-4 w-4" }),
      },
    ],
    props: [
      {
        name: "color",
        type: '"black" | "white" | "blue"',
        default: '"black"',
        options: ["black", "white", "blue"],
        control: "swatch",
        optionColors: {
          black: "#000000",
          white: "#ffffff",
          blue: "#50B1FD",
        },
      },
      {
        name: "size",
        type: '"sm" | "md" | "lg"',
        default: '"md"',
        options: ["sm", "md", "lg"],
      },
    ],
    usage: `import { Folder } from "@/components/ui/folder-component",

export function Demo() {
  return <Folder color="blue" size="md" />
}`,
  },
  {
    href: "/components/bouncesidebar",
    category: "navigation",
    registry: "bounce-sidebar",
    source: `${REGISTRY_HOMEPAGE}/blob/main/components/ui/bounce-sidebar.tsx`,
    preview: "/componentdemos/bouncesidebar.mp4",
    dependencies: [
      {
        name: "motion",
        icon: createElement(MotionIcon, { className: "h-4 w-4" }),
      },
    ],
    props: [
      {
        name: "items",
        type: "Array<string | { label: string; href?: string } | { label: string; heading: true }>",
        required: true,
      },
      {
        name: "value",
        type: "number",
      },
      {
        name: "defaultValue",
        type: "number",
        default: "0",
      },
      {
        name: "onChange",
        type: "(index: number) => void",
      },
      {
        name: "dotColor",
        type: "string",
        default: '"#FC4C01"',
      },
      {
        name: "className",
        type: "string",
      },
    ],
    usage: `import { BounceSidebar } from "@/components/ui/bounce-sidebar"
  
  const items = [
    { label: "General", heading: true },
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
  ]
  
  export function Demo() {
    return <BounceSidebar items={items} dotColor="#FC4C01" />
  }`,
  },
  {
    href: "/components/hooksidebar",
    category: "navigation",
    registry: "hook-sidebar",
    source: `${REGISTRY_HOMEPAGE}/blob/main/components/ui/hook-sidebar.tsx`,
    preview: "/componentdemos/hooksiebarvid.mp4",
    dependencies: [
      {
        name: "motion",
        icon: createElement(MotionIcon, { className: "h-4 w-4" }),
      },
    ],
    props: [
      {
        name: "items",
        type: "Array<string | { label: string; href?: string }>",
        required: true,
      },
      {
        name: "label",
        type: "string",
      },
      {
        name: "value",
        type: "number",
      },
      {
        name: "defaultValue",
        type: "number",
        default: "0",
      },
      {
        name: "onChange",
        type: "(index: number) => void",
      },
      {
        name: "color",
        type: "string",
        default: '"#FC4C01"',
      },
      {
        name: "dashed",
        type: "boolean",
        default: "true",
      },
      {
        name: "className",
        type: "string",
      },
    ],
    usage: `import { HookSidebar } from "@/components/ui/hook-sidebar"

  // any item with an href makes the rail follow the current route
  const display = [
    { label: "Folder", href: "/folder" },
    { label: "Code block", href: "/codeblock" },
  ]

  const navigation = [{ label: "Gooey nav", href: "/gooeynav" }]

  // one HookSidebar per group, stacked
  export function Demo() {
    return (
      <div className="flex flex-col gap-5">
        <HookSidebar label="Display" items={display} />
        <HookSidebar label="Navigation" items={navigation} />
      </div>
    )
  }`,
  },
  {
    href: "/components/proximitysidebar",
    category: "navigation",
    registry: "proximity-sidebar",
    source: `${REGISTRY_HOMEPAGE}/blob/main/components/ui/proximity-sidebar.tsx`,
    preview: "/componentdemos/proximitysidebar.mp4",
    dependencies: [
      {
        name: "motion",
        icon: createElement(MotionIcon, { className: "h-4 w-4" }),
      },
    ],
    props: [
      {
        name: "sections",
        type: 'Array<{ id: string; label: string; kind?: "title" | "subtitle" | "section" | "body"; level?: 1 | 2 | 3 | 4 | 5 | 6 }>',
        required: true,
      },
      {
        name: "side",
        type: '"left" | "right"',
        default: '"left"',
        options: ["left", "right"],
      },
      {
        name: "activeOffset",
        type: "number",
        default: "0.4",
      },
      {
        name: "className",
        type: "string",
      },
      {
        name: "labels",
        type: "Partial<ProximitySidebarLabels>",
      },
    ],
    usage: `import ProximitySidebar, { type ProximitySection } from "@/components/ui/proximity-sidebar"

const sections = [
  { id: "intro", label: "Introduction", level: 1 },
  { id: "setup", label: "Setup", level: 2 },
  { id: "api", label: "API", kind: "section" },
  { id: "faq", label: "FAQ", kind: "body" },
] satisfies ProximitySection[]

export function Demo() {
  return (
    <aside className="sticky top-20 h-[70vh]">
      <ProximitySidebar
        sections={sections}
        side="left"
        activeOffset={0.4}
      />
    </aside>
  )
}`,
  },
  {
    href: "/components/durationpicker",
    category: "inputs",
    registry: "duration-picker",
    source: `${REGISTRY_HOMEPAGE}/blob/main/components/ui/duration-picker.tsx`,
    preview: "/componentdemos/durationpicker.mp4",
    featured: true,
    dependencies: [
      {
        name: "motion",
        icon: createElement(MotionIcon, { className: "h-4 w-4" }),
      },
      { name: "figma-squircle" },
      { name: "flubber" },
      { name: "react-use-measure" },
      { name: "@radix-ui/react-slot" },
    ],
    props: [
      {
        name: "value",
        type: "{ hours: number; minutes: number }",
      },
      {
        name: "defaultValue",
        type: "{ hours: number; minutes: number }",
        default: "{ hours: 0, minutes: 0 }",
      },
      {
        name: "onChange",
        type: "(value: DurationValue) => void",
      },
      {
        name: "onConfirm",
        type: "(value: DurationValue) => void",
      },
      {
        name: "onEditingChange",
        type: "(editing: boolean) => void",
      },
      {
        name: "defaultEditing",
        type: "boolean",
        default: "false",
      },
      {
        name: "maxHours",
        type: "number",
        default: "24",
      },
      {
        name: "maxMinutes",
        type: "number",
        default: "60",
      },
      {
        name: "hoursLabel",
        type: "string",
        default: '"Hr."',
      },
      {
        name: "minutesLabel",
        type: "string",
        default: '"Min."',
      },
      {
        name: "disabled",
        type: "boolean",
        default: "false",
      },
      {
        name: "className",
        type: "string",
      },
      {
        name: "labels",
        type: "Partial<DurationPickerLabels>",
      },
    ],
    usage: `"use client"

import DurationPicker, { type DurationValue } from "@/components/ui/duration-picker"
import { useState } from "react"

export function Demo() {
  const [duration, setDuration] = useState<DurationValue>({ hours: 1, minutes: 30 })

  return (
    <DurationPicker
      value={duration}
      onChange={setDuration}                     // fires while typing
      onConfirm={(d) => console.log("saved", d)} // fires when the tick is clicked
    />
  )
}

// Zero-config: it also works fully uncontrolled
// <DurationPicker onConfirm={(d) => console.log("saved", d)} />`,
  },
  {
    href: "/components/fluidorb",
    category: "ai",
    registry: "fluid-orb",
    source: `${REGISTRY_HOMEPAGE}/blob/main/components/ui/fluid-orb.tsx`,
    preview: "/componentdemos/fluidorb.mp4",
    featured: true,
    props: [
      {
        name: "color",
        type: "string",
        default: '"#1A73F2"',
        options: ["#1A73F2", "#FF3B30", "#F75001", "#34C759"],
        control: "swatch",
        optionColors: {
          "#1A73F2": "#1A73F2",
          "#FF3B30": "#FF3B30",
          "#F75001": "#F75001",
          "#34C759": "#34C759",
        },
      },
      {
        name: "size",
        type: "number",
        default: "240",
      },
      {
        name: "className",
        type: "string",
      },
    ],
    usage: `import FluidOrb from "@/components/ui/fluid-orb"

export function Demo() {
  return <FluidOrb size={280} color="#F75001" />
}`,
  },
  {
    href: "/components/scrollprogressindicator",
    category: "navigation",
    registry: "scroll-progress",
    source: `${REGISTRY_HOMEPAGE}/blob/main/components/ui/scroll-progress.tsx`,
    preview: "/componentdemos/scrollprogress.mp4",
    dependencies: [
      {
        name: "motion",
        icon: createElement(MotionIcon, { className: "h-4 w-4" }),
      },
    ],
    props: [
      {
        name: "sections",
        type: "Array<{ id: string; label: string }>",
        default: "[]",
      },
      {
        name: "containerRef",
        type: "React.RefObject<HTMLElement | null>",
      },
      {
        name: "offset",
        type: "number",
        default: "120",
      },
      {
        name: "className",
        type: "string",
      },
      {
        name: "labels",
        type: "Partial<ScrollProgressLabels>",
      },
    ],
    usage: `"use client"

import { useRef } from "react"
import ScrollProgress from "@/components/ui/scroll-progress"

const sections = [
  { id: "intro", label: "Introduction" },
  { id: "usage", label: "Usage" },
  { id: "faq", label: "FAQ" },
]

export function Demo() {
  const scrollRef = useRef<HTMLElement>(null)

  return (
    <main ref={scrollRef} className="relative h-full overflow-auto">
      <ScrollProgress containerRef={scrollRef} sections={sections} />

      <section id="intro">{/* ... */}</section>
      <section id="usage">{/* ... */}</section>
      <section id="faq">{/* ... */}</section>
    </main>
  )
}

// Tracks the window with no container ref:
// <ScrollProgress sections={sections} />`,
  },
  {
    href: "/components/railtoc",
    category: "navigation",
    registry: "rail-toc",
    source: `${REGISTRY_HOMEPAGE}/blob/main/components/ui/rail-toc.tsx`,
    preview: "/componentdemos/railtoc.mp4",
    previewScale: 1.12,
    dependencies: [
      {
        name: "motion",
        icon: createElement(MotionIcon, { className: "h-4 w-4" }),
      },
    ],
    props: [
      {
        name: "items",
        type: "{ id: string; label: string; depth?: number }[]",
        required: true,
      },
      {
        name: "containerRef",
        type: "React.RefObject<HTMLElement | null>",
      },
      {
        name: "offset",
        type: "number",
        default: "96",
      },
      {
        name: "indent",
        type: "number",
        default: "14",
      },
      {
        name: "title",
        type: "string",
        default: '"On this page"',
      },
      {
        name: "className",
        type: "string",
      },
    ],
    usage: `"use client"

import { useRef } from "react"
import RailToc, { type RailTocItem } from "@/components/ui/rail-toc"

const items: RailTocItem[] = [
  { id: "install", label: "Installation" },
  { id: "requirements", label: "Prerequisites", depth: 1 },
  { id: "usage", label: "Usage" },
]

export function Docs() {
  const scrollRef = useRef<HTMLElement>(null)

  return (
    <main ref={scrollRef} className="flex h-full gap-12 overflow-auto">
      <article>
        <h2 id="install">Installation</h2>
        <h3 id="requirements">Prerequisites</h3>
        <h2 id="usage">Usage</h2>
      </article>
      <aside className="sticky top-4 h-max">
        <RailToc items={items} containerRef={scrollRef} />
      </aside>
    </main>
  )
}

// tracks the window with no container ref
// <RailToc items={items} />`,
  },
  {
    href: "/components/codeblock",
    category: "display",
    registry: "code-block",
    source: `${REGISTRY_HOMEPAGE}/blob/main/components/ui/code-block.tsx`,
    preview: "/componentdemos/codeblock.mp4",
    dependencies: [
      {
        name: "motion",
        icon: createElement(MotionIcon, { className: "h-4 w-4" }),
      },
      { name: "prism-react-renderer" },
    ],
    props: [
      {
        name: "code",
        type: "string",
        required: true,
      },
      {
        name: "language",
        type: "string",
        default: '"tsx"',
      },
      {
        name: "accent",
        type: "string",
        default: '"#F75001"',
        options: ["#F75001", "#1A73F2", "#FF3B30", "#34C759"],
        control: "swatch",
        optionColors: {
          "#F75001": "#F75001",
          "#1A73F2": "#1A73F2",
          "#FF3B30": "#FF3B30",
          "#34C759": "#34C759",
        },
      },
      {
        name: "mode",
        type: '"auto" | "dark" | "light"',
        default: '"auto"',
      },
      {
        name: "filename",
        type: "string",
      },
      {
        name: "showFrame",
        type: "boolean",
        default: "true",
      },
      {
        name: "showHeader",
        type: "boolean",
        default: "true",
      },
      {
        name: "showLineNumbers",
        type: "boolean",
        default: "true",
      },
      {
        name: "showCopyButton",
        type: "boolean",
        default: "true",
      },
      {
        name: "highlightLines",
        type: "number[]",
      },
      {
        name: "className",
        type: "string",
      },
      {
        name: "labels",
        type: "Partial<CodeBlockLabels>",
      },
    ],
    usage: `import CodeBlock from "@/components/ui/code-block"

export function Demo() {
  return (
    <CodeBlock
      code={\`const greet = (name: string) => \\\`Hello, \\\${name}!\\\`\`}
      language="ts"
      accent="#F75001"
      filename="greet.ts"
    />
  )
}`,
  },
  {
    href: "/components/gravityletters",
    category: "display",
    registry: "gravity-letters",
    source: `${REGISTRY_HOMEPAGE}/blob/main/components/ui/gravity-letters.tsx`,
    preview: "/componentdemos/gravityletters.mp4",
    featured: true,
    props: [
      {
        name: "type",
        type: '"letters" | "numbers" | "both"',
        default: '"letters"',
        options: ["letters", "numbers", "both"],
      },
      {
        name: "items",
        type: "React.ReactNode[]",
      },
      {
        name: "gravity",
        type: "number",
        default: "800",
      },
      {
        name: "size",
        type: "number",
        default: "28",
      },
      {
        name: "color",
        type: "string",
        default: '"currentColor"',
        options: ["#1A73F2", "#AF52DE", "#FF3B30", "#F75001", "#34C759"],
        control: "swatch",
        optionColors: {
          "#1A73F2": "#1A73F2",
          "#AF52DE": "#AF52DE",
          "#FF3B30": "#FF3B30",
          "#F75001": "#F75001",
          "#34C759": "#34C759",
        },
      },
      {
        name: "maxGlyphs",
        type: "number",
        default: "Infinity",
      },
      {
        name: "deviceTilt",
        type: "boolean",
        default: "true",
      },
      {
        name: "className",
        type: "string",
      },
    ],
    usage: `import GravityLetters from "@/components/ui/gravity-letters"

export function Demo() {
  return (
    <GravityLetters type="letters" className="h-96 w-full rounded-3xl border">
      {/* anything you render inside stays clickable-through */}
      <p className="absolute inset-0 grid place-items-center text-sm text-muted-foreground">
        Click anywhere
      </p>
    </GravityLetters>
  )
}

// Digits instead:
// <GravityLetters type="numbers" />

// Or drop your own content: emoji, icons, any component:
// <GravityLetters items={["🍎", "🍊", "🍇", <Sparkles key="s" className="size-7" />]} />`,
  },
  {
    href: "/components/otpinput",
    category: "inputs",
    registry: "otp-input",
    source: `${REGISTRY_HOMEPAGE}/blob/main/components/ui/otp-input.tsx`,
    preview: "/componentdemos/otpinput.mp4",
    featured: true,
    dependencies: [
      {
        name: "motion",
        icon: createElement(MotionIcon, { className: "h-4 w-4" }),
      },
    ],
    props: [
      {
        name: "length",
        type: "number",
        default: "6",
      },
      {
        name: "size",
        type: '"sm" | "md" | "lg"',
        default: '"md"',
        options: ["sm", "md", "lg"],
      },
      {
        name: "value",
        type: "string",
      },
      {
        name: "defaultValue",
        type: "string",
        default: '""',
      },
      {
        name: "onChange",
        type: "(value: string) => void",
      },
      {
        name: "onComplete",
        type: "(value: string) => void",
      },
      {
        name: "type",
        type: '"numbers" | "letters" | "both"',
        default: '"numbers"',
        options: ["numbers", "letters", "both"],
      },
      {
        name: "status",
        type: '"idle" | "success" | "error"',
        default: '"idle"',
        options: ["idle", "success", "error"],
      },
      {
        name: "mask",
        type: "boolean",
        default: "false",
      },
      {
        name: "disabled",
        type: "boolean",
        default: "false",
      },
      {
        name: "autoFocus",
        type: "boolean",
        default: "false",
      },
      {
        name: "className",
        type: "string",
      },
      {
        name: "slotClassName",
        type: "string",
      },
      {
        name: "labels",
        type: "Partial<OtpInputLabels>",
      },
    ],
    usage: `import { useState } from "react"
import OtpInput, { type OtpStatus } from "@/components/ui/otp-input"

export function Demo() {
  const [status, setStatus] = useState<OtpStatus>("idle")

  return (
    <OtpInput
      length={6}
      size="md"
      status={status}
      onChange={() => setStatus("idle")}
      onComplete={(code) => setStatus(checkCode(code) ? "success" : "error")}
    />
  )
}`,
  },
  {
    href: "/components/passwordinput",
    category: "inputs",
    registry: "password-input",
    source: `${REGISTRY_HOMEPAGE}/blob/main/components/ui/password-input.tsx`,
    preview: "/componentdemos/passwordinput.mp4",
    dependencies: [
      {
        name: "motion",
        icon: createElement(MotionIcon, { className: "h-4 w-4" }),
      },
    ],
    props: [
      {
        name: "value",
        type: "string",
      },
      {
        name: "defaultValue",
        type: "string",
        default: '""',
      },
      {
        name: "onChange",
        type: "(value: string) => void",
      },
      {
        name: "defaultVisible",
        type: "boolean",
        default: "false",
      },
      {
        name: "onVisibleChange",
        type: "(visible: boolean) => void",
      },
      {
        name: "strength",
        type: "boolean",
        default: "true",
      },
      {
        name: "placeholder",
        type: "string",
      },
      {
        name: "disabled",
        type: "boolean",
        default: "false",
      },
      {
        name: "className",
        type: "string",
      },
      {
        name: "inputClassName",
        type: "string",
      },
      {
        name: "labels",
        type: "Partial<PasswordInputLabels>",
      },
    ],
    usage: `import { useState } from "react"
import PasswordInput from "@/components/ui/password-input"

export function Demo() {
  const [password, setPassword] = useState("")

  return (
    <PasswordInput
      name="password"
      autoComplete="new-password"
      placeholder="Enter a password"
      value={password}
      onChange={setPassword}
    />
  )
}`,
  },
  {
    href: "/components/themeselector",
    category: "inputs",
    isNew: true,
    registry: "theme-selector",
    source: `${REGISTRY_HOMEPAGE}/blob/main/components/ui/theme-selector.tsx`,
    preview: "/componentdemos/themetoggle.mp4",
    props: [
      {
        name: "themes",
        type: "ThemeOption[]",
        default: "DEFAULT_THEMES",
      },
      {
        name: "value",
        type: "string | null",
      },
      {
        name: "defaultValue",
        type: "string",
      },
      {
        name: "onChange",
        type: "(value: string) => void",
      },
      {
        name: "labels",
        type: "boolean",
        default: "true",
      },
      {
        name: "disabled",
        type: "boolean",
        default: "false",
      },
      {
        name: "className",
        type: "string",
      },
      {
        name: "itemClassName",
        type: "string",
      },
    ],
    usage: `"use client"

import { useSyncExternalStore } from "react"
import { useTheme } from "next-themes"
import ThemeSelector from "@/components/ui/theme-selector"

const subscribe = () => () => {}

export function Demo() {
  const { resolvedTheme, setTheme } = useTheme()
  // the server can't know the theme, so select nothing until hydration is done
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false)

  return (
    <ThemeSelector
      value={hydrated ? (resolvedTheme ?? null) : null}
      onChange={setTheme}
    />
  )
}

// No theme library? Toggle the class yourself:
// const [theme, setTheme] = useState<string | null>(null)
// useEffect(() => setTheme(localStorage.theme ?? "dark"), [])
// useEffect(() => {
//   if (!theme) return
//   document.documentElement.classList.toggle("dark", theme === "dark")
//   localStorage.theme = theme
// }, [theme])
// <ThemeSelector value={theme} onChange={setTheme} />`,
  },
  {
    href: "/components/toast",
    category: "feedback",
    isNew: true,
    registry: "toast",
    source: `${REGISTRY_HOMEPAGE}/blob/main/components/ui/toast.tsx`,
    preview: "/componentdemos/toast.mp4",
    dependencies: [
      { name: "sonner" },
      {
        name: "motion",
        icon: createElement(MotionIcon, { className: "h-4 w-4" }),
      },
      { name: "figma-squircle" },
    ],
    props: [
      {
        name: "toast(title, options)",
        type: "(title: ReactNode, options?: ToastOptions) => string | number",
      },
      {
        name: "toast.promise",
        type: "(task: Promise<T> | (() => Promise<T>), messages, options?) => Promise<T>",
      },
      {
        name: "description",
        type: "ReactNode",
      },
      {
        name: "action",
        type: "{ label: string; onClick: () => void }",
      },
      {
        name: "duration",
        type: "number",
        default: "4000",
      },
      {
        name: "id",
        type: "string | number",
      },
      {
        name: "dismissible",
        type: "boolean",
        default: "true",
      },
      {
        name: "position",
        type: '"top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right"',
        default: '"bottom-right"',
      },
      {
        name: "gap",
        type: "number",
        default: "10",
      },
      {
        name: "labels",
        type: "Partial<ToastLabels>",
      },
    ],
    usage: `"use client"

import { Toaster, toast } from "@/components/ui/toast"

const save = () => fetch("/api/save", { method: "POST" })

// mount Toaster once, in your root layout
export function Demo() {
  return (
    <>
      <button
        onClick={() =>
          toast.promise(save(), {
            loading: "Saving",
            success: "Saved",
            error: "Couldn't save",
          })
        }
      >
        Save
      </button>
      <Toaster />
    </>
  )
}`,
  },
  {
    href: "/components/githubactivity",
    category: "display",
    registry: "github-activity",
    source: `${REGISTRY_HOMEPAGE}/blob/main/components/ui/github-activity.tsx`,
    preview: "/componentdemos/githubgraphcomponentblack.mp4",
    dependencies: [
      {
        name: "motion",
        icon: createElement(MotionIcon, { className: "h-4 w-4" }),
      },
    ],
    props: [
      {
        name: "username",
        type: "string",
      },
      {
        name: "contributions",
        type: "Contribution[]",
        default: "[]",
      },
      {
        name: "repos",
        type: "RepoContribution[]",
        default: "[]",
      },
      {
        name: "year",
        type: "number",
      },
      {
        name: "accent",
        type: "string | string[]",
        default: '"#39d353"',
      },
      {
        name: "cellSize",
        type: "number",
        default: "11",
      },
      {
        name: "months",
        type: "number",
        default: "12",
      },
      {
        name: "showMonths",
        type: "boolean",
        default: "false",
      },
      {
        name: "label",
        type: "string",
        default: '"Top contributions in:"',
      },
      {
        name: "defaultOpen",
        type: "boolean",
        default: "false",
      },
      {
        name: "open",
        type: "boolean",
      },
      {
        name: "onOpenChange",
        type: "(open: boolean) => void",
      },
      {
        name: "className",
        type: "string",
      },
      {
        name: "labels",
        type: "Partial<GitHubActivityLabels>",
      },
    ],
    usage: `import GitHubActivity from "@/components/ui/github-activity"

export function Demo() {
  return <GitHubActivity username="zhihui-hu" />
}

// or pass everything yourself
<GitHubActivity
  contributions={contributions}
  repos={[{ name: "Zero mail", count: 412, logo: <ZeroIcon /> }]}
  accent={["#0e4429", "#006d32", "#26a641", "#39d353"]}
/>`,
  },
  {
    href: "/components/emojireaction",
    category: "feedback",
    registry: "emoji-reaction",
    source: `${REGISTRY_HOMEPAGE}/blob/main/components/ui/emoji-reaction.tsx`,
    preview: "/componentdemos/emojireaction.mp4",
    dependencies: [
      {
        name: "motion",
        icon: createElement(MotionIcon, { className: "h-4 w-4" }),
      },
      { name: "react-apple-emojis" },
      { name: "lucide-react" },
      { name: "@radix-ui/react-slot" },
    ],
    props: [
      {
        name: "emojis",
        type: "string[]",
        default: "5 default faces",
      },
      {
        name: "emojiData",
        type: "EmojiData",
      },
      {
        name: "onReact",
        type: "(name: string) => void",
      },
      {
        name: "size",
        type: '"sm" | "md" | "lg"',
        default: '"md"',
        options: ["sm", "md", "lg"],
      },
      {
        name: "align",
        type: '"left" | "center" | "right"',
        default: '"center"',
        options: ["left", "center", "right"],
      },
      {
        name: "asChild",
        type: "boolean",
        default: "false",
      },
      {
        name: "className",
        type: "string",
      },
      {
        name: "labels",
        type: "Partial<EmojiReactionLabels>",
      },
    ],
    usage: `import { EmojiReaction } from "@/components/ui/emoji-reaction"

export function Demo() {
  return <EmojiReaction onReact={(name) => console.log(name)} />
}

// or hang the bar off your own element
<EmojiReaction asChild>
  <button className="rounded-2xl bg-card p-4">Nice work</button>
</EmojiReaction>`,
  },
  {
    href: "/components/notificationbell",
    category: "feedback",
    registry: "notification-bell",
    source: `${REGISTRY_HOMEPAGE}/blob/main/components/ui/notification-bell.tsx`,
    preview: "/componentdemos/notification.mp4",
    dependencies: [
      {
        name: "motion",
        icon: createElement(MotionIcon, { className: "h-4 w-4" }),
      },
      { name: "@radix-ui/react-slot" },
    ],
    props: [
      {
        name: "count",
        type: "number",
        default: "0",
      },
      {
        name: "max",
        type: "number",
        default: "99",
      },
      {
        name: "variant",
        type: '"count" | "dot"',
        default: '"count"',
        options: ["count", "dot"],
      },
      {
        name: "size",
        type: "number",
        default: "48",
      },
      {
        name: "color",
        type: '"red" | "orange" | "green" | "blue" | "violet"',
        default: '"red"',
        options: ["red", "orange", "green", "blue", "violet"],
        control: "swatch",
        optionColors: {
          red: "#FF3B30",
          orange: "#FF9500",
          green: "#34C759",
          blue: "#007AFF",
          violet: "#AF52DE",
        },
      },
      {
        name: "asChild",
        type: "boolean",
        default: "false",
      },
      {
        name: "className",
        type: "string",
      },
      {
        name: "labels",
        type: "Partial<NotificationBellLabels>",
      },
    ],
    usage: `import { NotificationBell } from "@/components/ui/notification-bell"

export function Demo() {
  return <NotificationBell count={8} />
}

// or wrap it in your own menu trigger
<DropdownMenuTrigger asChild>
  <NotificationBell count={8} />
</DropdownMenuTrigger>`,
  },
  {
    href: "/components/stepplayer",
    category: "display",
    registry: "step-player",
    source: `${REGISTRY_HOMEPAGE}/blob/main/components/ui/step-player.tsx`,
    preview: "/componentdemos/stepplayer.mp4",
    dependencies: [
      {
        name: "motion",
        icon: createElement(MotionIcon, { className: "h-4 w-4" }),
      },
      { name: "flubber" },
    ],
    props: [
      {
        name: "steps",
        type: "number | StepPlayerStep[]",
        default: "4",
      },
      {
        name: "value",
        type: "number",
      },
      {
        name: "defaultValue",
        type: "number",
        default: "0",
      },
      {
        name: "onValueChange",
        type: "(value: number) => void",
      },
      {
        name: "playing",
        type: "boolean",
      },
      {
        name: "defaultPlaying",
        type: "boolean",
        default: "false",
      },
      {
        name: "onPlayingChange",
        type: "(playing: boolean) => void",
      },
      {
        name: "duration",
        type: "number",
        default: "4000",
      },
      {
        name: "loop",
        type: "boolean",
        default: "false",
      },
      {
        name: "onComplete",
        type: "() => void",
      },
      {
        name: "size",
        type: "number",
        default: "48",
      },
      {
        name: "showControl",
        type: "boolean",
        default: "true",
      },
      {
        name: "controlPosition",
        type: '"left" | "right"',
        default: '"right"',
        options: ["left", "right"],
      },
      {
        name: "speeds",
        type: "number[]",
        default: "[1, 1.5, 2]",
      },
      {
        name: "onSpeedChange",
        type: "(speed: number) => void",
      },
      {
        name: "seekable",
        type: "boolean",
        default: "false",
      },
      {
        name: "className",
        type: "string",
      },
      {
        name: "labels",
        type: "Partial<StepPlayerLabels>",
      },
    ],
    usage: `import { StepPlayer } from "@/components/ui/step-player"

export function Demo() {
  return <StepPlayer steps={5} duration={3000} />
}

// drive your own carousel off the index
<StepPlayer
  steps={slides.length}
  value={index}
  onValueChange={setIndex}
  loop
/>`,
  },
  // {
  //   name: "Family drawer",
  //   href: "/components/familydrawer",
  //   registry: "family drawer",
  //   description:
  //     "A bottom drawer with smooth, morphing transitions between stacked views, inspired by the Family app. Built on Vaul.",
  //   source: `${REGISTRY_HOMEPAGE}/blob/main/components/ui/family-drawer.tsx`,
  //   dependencies: [{ name: "motion" }, { name: "vaul" }],
  //   interaction: "Click the trigger to open the drawer and step between views.",
  //   usage: `import FamilyDrawer from "@/components/ui/family-drawer"

  // export function Demo() {
  //   return <FamilyDrawer />
  // }`,
  // },
  {
    href: "/components/gridreveal",
    category: "ai",
    registry: "grid-reveal",
    source: `${REGISTRY_HOMEPAGE}/blob/main/components/ui/grid-reveal.tsx`,
    preview: "/componentdemos/imagegen.mp4",
    dependencies: [
      {
        name: "motion",
        icon: createElement(MotionIcon, { className: "h-4 w-4" }),
      },
    ],
    props: [
      {
        name: "src",
        type: "string | null",
      },
      {
        name: "alt",
        type: "string",
      },
      {
        name: "progress",
        type: "number",
      },
      {
        name: "aspect",
        type: "number",
        default: "1",
      },
      {
        name: "caption",
        type: "string",
      },
      {
        name: "estimatedDuration",
        type: "number",
        default: "6000",
      },
      {
        name: "onRevealComplete",
        type: "() => void",
      },
      {
        name: "onError",
        type: "() => void",
      },
      {
        name: "className",
        type: "string",
      },
    ],
    usage: `"use client"

import { useState } from "react"
import GridReveal from "@/components/ui/grid-reveal"

export function Demo() {
  const [src, setSrc] = useState<string | null>(null)

  async function generate() {
    setSrc(null)                   // null is the waiting state, the grid runs while it is empty
    setSrc(await createImage())    // setting it resolves the grid into the picture
  }

  return (
    // the frame fills its parent, so give the parent a width
    <div className="w-64">
      <GridReveal src={src} alt="Generated image" caption="Creating image" />
      <button onClick={generate}>Generate</button>
    </div>
  )
}

// Passing a src that is already loaded skips the wait, so the run flashes by.
// Pass progress when your API reports it: <GridReveal src={src} progress={job.progress} />`,
  },
  {
    href: "/components/gooeynav",
    category: "navigation",
    registry: "gooey-nav",
    source: `${REGISTRY_HOMEPAGE}/blob/main/components/ui/gooey-nav.tsx`,
    preview: "/componentdemos/gooeynav.mp4",
    dependencies: [
      {
        name: "motion",
        icon: createElement(MotionIcon, { className: "h-4 w-4" }),
      },
    ],
    props: [
      {
        name: "items",
        type: "(string | { label: string; href?: string; icon?: ReactNode })[]",
        required: true,
      },
      {
        name: "value",
        type: "number",
      },
      {
        name: "defaultValue",
        type: "number",
        default: "0",
      },
      {
        name: "onChange",
        type: "(index: number) => void",
      },
      {
        name: "size",
        type: '"xs" | "sm" | "md" | "lg"',
        default: '"md"',
        options: ["xs", "sm", "md", "lg"],
      },
      {
        name: "activeColor",
        type: "string",
        default: '"#FC4C01"',
      },
      {
        name: "activeLabelColor",
        type: "string",
        default: '"#ffffff"',
      },
      {
        name: "separation",
        type: "number",
      },
      {
        name: "radius",
        type: "number",
      },
      {
        name: "className",
        type: "string",
      },
    ],
    usage: `"use client"

import { GooeyNav } from "@/components/ui/gooey-nav"

export function Demo() {
  return (
    // hrefs make it track the url on its own, no value needed
    <GooeyNav
      items={[
        { label: "Home", href: "/", icon: <HouseIcon /> },
        { label: "Changelog", href: "/changelog" },
        { label: "About", href: "/about" },
      ]}
    />
  )
}

// strings render buttons instead, for a segmented control:
// <GooeyNav items={["Day", "Week", "Month"]} onChange={setRange} />

// size is a single value, so step it down yourself on small screens:
// <GooeyNav items={items} size={useIsMobile() ? "xs" : "md"} />`,
  },
  {
    href: "/components/deletebutton",
    category: "inputs",
    registry: "delete-button",
    source: `${REGISTRY_HOMEPAGE}/blob/main/components/ui/delete-button.tsx`,
    preview: "/componentdemos/deletbutton.mp4",
    dependencies: [
      {
        name: "motion",
        icon: createElement(MotionIcon, { className: "h-4 w-4" }),
      },
    ],
    props: [
      {
        name: "onConfirm",
        type: "() => void",
      },
      {
        name: "onCancel",
        type: "() => void",
      },
      {
        name: "className",
        type: "string",
      },
      {
        name: "labels",
        type: "Partial<DeleteButtonLabels>",
      },
    ],
    usage: `"use client"

import { DeleteButton } from "@/components/ui/delete-button"

export function Demo() {
  return <DeleteButton onConfirm={() => remove(id)} />
}`,
  },
  {
    href: "/components/animatedcounter",
    category: "display",
    registry: "animated-counter",
    source: `${REGISTRY_HOMEPAGE}/blob/main/components/ui/animated-counter.tsx`,
    preview: "/componentdemos/animatednumbers.mp4",
    dependencies: [
      {
        name: "motion",
        icon: createElement(MotionIcon, { className: "h-4 w-4" }),
      },
    ],
    props: [
      {
        name: "value",
        type: "number",
        required: true,
      },
      {
        name: "decimals",
        type: "number",
        default: "0",
      },
      {
        name: "duration",
        type: "number",
        default: "0.6",
      },
      {
        name: "padStart",
        type: "number",
        default: "1",
      },
      {
        name: "separator",
        type: "string",
        default: '","',
      },
      {
        name: "decimalSeparator",
        type: "string",
        default: '"."',
      },
      {
        name: "grouping",
        type: '"western" | "indian"',
        default: '"western"',
        options: ["western", "indian"],
      },
      {
        name: "prefix",
        type: "ReactNode",
      },
      {
        name: "suffix",
        type: "ReactNode",
      },
      {
        name: "className",
        type: "string",
      },
    ],
    usage: `"use client"

import { AnimatedCounter } from "@/components/ui/animated-counter"

export function Revenue({ total }: { total: number }) {
  return <AnimatedCounter value={total} className="text-6xl font-medium" />
}

// money: two decimals and a currency mark that stays put
// <AnimatedCounter value={total} decimals={2} prefix={<span>₹</span>} grouping="indian" />

// fixed width, so a timer never shifts as it rolls over
// <AnimatedCounter value={seconds} padStart={4} separator="" />`,
  },
  {
    href: "/components/matrixorb",
    category: "ai",
    registry: "matrix-orb",
    source: `${REGISTRY_HOMEPAGE}/blob/main/components/ui/matrix-orb.tsx`,
    preview: "/componentdemos/matrixorb.mp4",
    props: [
      {
        name: "state",
        type: '"idle" | "listening" | "thinking"',
        default: '"idle"',
        options: ["idle", "listening", "thinking"],
      },
      {
        name: "level",
        type: "number",
      },
      {
        name: "size",
        type: "number",
        default: "240",
      },
      {
        name: "color",
        type: "string",
        default: '"#F75001"',
      },
      {
        name: "dots",
        type: "number",
        default: "11",
      },
      {
        name: "labels",
        type: "Partial<Record<MatrixOrbState, string>>",
      },
      {
        name: "className",
        type: "string",
      },
    ],
    usage: `"use client"

import { useState } from "react"
import MatrixOrb, { type MatrixOrbState } from "@/components/ui/matrix-orb"

export function Demo() {
  const [state, setState] = useState<MatrixOrbState>("idle")

  return (
    <MatrixOrb
      state={state}
      onClick={() => setState(state === "idle" ? "listening" : "idle")}
      className="cursor-pointer"
    />
  )
}

// drive the bloom yourself with any value from 0 to 1
// <MatrixOrb state="listening" level={level} />`,
  },
  {
    href: "/components/tasklist",
    category: "inputs",
    registry: "task-list",
    source: `${REGISTRY_HOMEPAGE}/blob/main/components/ui/task-list.tsx`,
    preview: "/componentdemos/tasklist.mp4",
    dependencies: [
      {
        name: "motion",
        icon: createElement(MotionIcon, { className: "h-4 w-4" }),
      },
    ],
    props: [
      {
        name: "tasks",
        type: "Task[]",
      },
      {
        name: "defaultTasks",
        type: "Task[]",
        default: "[]",
      },
      {
        name: "onTasksChange",
        type: "(tasks: Task[]) => void",
      },
      {
        name: "size",
        type: '"sm" | "md" | "lg"',
        default: '"md"',
        options: ["sm", "md", "lg"],
      },
      {
        name: "accent",
        type: "string",
        default: '"#FF5F2E"',
      },
      {
        name: "onSettled",
        type: "() => void",
      },
      {
        name: "className",
        type: "string",
      },
      {
        name: "labels",
        type: "Partial<TaskListLabels>",
      },
    ],
    usage: `"use client"

import { TaskList } from "@/components/ui/task-list"

export function Demo() {
  return (
    <TaskList
      defaultTasks={[
        { id: "ship", label: "Ship a new component to the registry", done: true },
        { id: "preview", label: "Record a preview for the gallery" },
        { id: "star", label: "Star One UI" },
      ]}
    />
  )
}

// one row on its own, no list around it
// <TaskItem label="Star One UI" size="sm" onCheckedChange={setDone} />`,
  },
  {
    href: "/components/voicenote",
    category: "display",
    registry: "voice-note",
    source: `${REGISTRY_HOMEPAGE}/blob/main/components/ui/voice-note.tsx`,
    preview: "/componentdemos/voicenote.mp4",
    dependencies: [
      {
        name: "motion",
        icon: createElement(MotionIcon, { className: "h-4 w-4" }),
      },
    ],
    props: [
      {
        name: "src",
        type: "string",
      },
      {
        name: "duration",
        type: "number",
        default: "53",
      },
      {
        name: "waveform",
        type: "number[]",
      },
      {
        name: "bars",
        type: "number",
        default: "40",
      },
      {
        name: "seed",
        type: "number",
        default: "7",
      },
      {
        name: "playing",
        type: "boolean",
      },
      {
        name: "defaultPlaying",
        type: "boolean",
        default: "false",
      },
      {
        name: "onPlayingChange",
        type: "(playing: boolean) => void",
      },
      {
        name: "onEnded",
        type: "() => void",
      },
      {
        name: "accent",
        type: "string",
        default: '"#FC4C01"',
        options: ["#FC4C01", "#1A73F2", "#4ADE80"],
        control: "swatch",
        optionColors: {
          "#FC4C01": "#FC4C01",
          "#1A73F2": "#1A73F2",
          "#4ADE80": "#4ADE80",
        },
      },
      {
        name: "size",
        type: '"sm" | "md" | "lg"',
        default: '"md"',
        options: ["sm", "md", "lg"],
      },
      {
        name: "speeds",
        type: "number[]",
        default: "[1, 1.5, 2]",
      },
      {
        name: "onSpeedChange",
        type: "(speed: number) => void",
      },
      {
        name: "seekable",
        type: "boolean",
        default: "true",
      },
      {
        name: "className",
        type: "string",
      },
      {
        name: "children",
        type: "ReactNode",
      },
      {
        name: "labels",
        type: "Partial<VoiceNoteLabels>",
      },
    ],
    usage: `"use client"

import { VoiceNote } from "@/components/ui/voice-note"

export function Demo() {
  return <VoiceNote src="/audio/note.mp3" className="w-[340px]" />
}

// no file yet: pass a length and it runs on a timer
// <VoiceNote duration={53} accent="#2563EB" />

// wrap a thread in VoiceNoteGroup and starting one stops the rest
// <VoiceNoteGroup>
//   <VoiceNote src="/audio/first.mp3" />
//   <VoiceNote src="/audio/second.mp3" />
// </VoiceNoteGroup>`,
  },
  {
    href: "/components/faq",
    category: "display",
    registry: "faq",
    source: `${REGISTRY_HOMEPAGE}/blob/main/components/ui/faq.tsx`,
    preview: "/componentdemos/faqcomponent.mp4",
    dependencies: [
      {
        name: "motion",
        icon: createElement(MotionIcon, { className: "h-4 w-4" }),
      },
    ],
    props: [
      {
        name: "items",
        type: "FaqItem[]",
        required: true,
      },
      {
        name: "value",
        type: "string | null",
      },
      {
        name: "defaultValue",
        type: "string | null",
        default: "null",
      },
      {
        name: "onValueChange",
        type: "(value: string | null) => void",
      },
      {
        name: "accent",
        type: "string",
        default: '"#FC4C01"',
      },
      {
        name: "avatar",
        type: "ReactNode",
        default: "One UI logo",
      },
      {
        name: "className",
        type: "string",
      },
    ],
    usage: `"use client"

import { Faq } from "@/components/ui/faq"

export function Demo() {
  return (
    <Faq
      items={[
        {
          id: "free",
          question: "Is it free?",
          answer: "Yes, for personal and commercial projects.",
        },
        {
          id: "install",
          question: "How do I install a component?",
          answer: "Add it with the shadcn CLI.",
        },
      ]}
    />
  )
}`,
  },
  {
    href: "/components/websearch",
    category: "ai",
    isNew: true,
    registry: "web-search",
    source: `${REGISTRY_HOMEPAGE}/blob/main/components/ui/web-search.tsx`,
    preview: "/componentdemos/websearch.mp4",
    dependencies: [
      {
        name: "motion",
        icon: createElement(MotionIcon, { className: "h-4 w-4" }),
      },
    ],
    props: [
      {
        name: "sources",
        type: "WebSource[]",
        required: true,
      },
      {
        name: "status",
        type: '"searching" | "done"',
        default: '"done"',
        options: ["searching", "done"],
      },
      {
        name: "query",
        type: "string",
      },
      {
        name: "label",
        type: "string",
      },
      {
        name: "progress",
        type: "number",
      },
      {
        name: "linked",
        type: "boolean",
        default: "true",
      },
      {
        name: "open",
        type: "boolean",
      },
      {
        name: "defaultOpen",
        type: "boolean",
        default: "true",
      },
      {
        name: "onOpenChange",
        type: "(open: boolean) => void",
      },
      {
        name: "play",
        type: "boolean",
        default: "true",
      },
      {
        name: "speed",
        type: "number",
        default: "80",
      },
      {
        name: "onComplete",
        type: "() => void",
      },
      {
        name: "source",
        type: "WebSource",
      },
      {
        name: "index",
        type: "number",
      },
      {
        name: "className",
        type: "string",
      },
      {
        name: "labels",
        type: "Partial<WebSearchLabels>",
      },
    ],
    usage: `"use client"

import {
  WebSearch,
  WebSearchAnswer,
  WebSearchCitation,
} from "@/components/ui/web-search"

const sources = [
  {
    id: "mdn",
    title: "prefers-reduced-motion",
    url: "https://developer.mozilla.org/docs/Web/CSS/@media/prefers-reduced-motion",
    snippet: "Detects if the user asked for less motion.",
  },
]

export function Answer() {
  return (
    <div>
      <WebSearch sources={sources} />
      <WebSearchAnswer>
        Turn animations off when the user asks for less motion{" "}
        <WebSearchCitation source={sources[0]} />.
      </WebSearchAnswer>
    </div>
  )
}

// while results stream in, pass status="searching" and grow the array`,
  },
  {
    href: "/components/aistatus",
    category: "ai",
    registry: "ai-status",
    source: `${REGISTRY_HOMEPAGE}/blob/main/components/ui/ai-status.tsx`,
    preview: "/componentdemos/aistatus.mp4",
    dependencies: [
      {
        name: "motion",
        icon: createElement(MotionIcon, { className: "h-4 w-4" }),
      },
      { name: "react-use-measure" },
    ],
    props: [
      {
        name: "state",
        type: '"thinking" | "researching" | "analyzing" | "writing" | "done" | "error" | string',
        default: '"thinking"',
      },
      {
        name: "states",
        type: "Record<string, { label?: string | ((elapsed?: string) => string); icon?: ReactNode; active?: boolean }>",
      },
      {
        name: "label",
        type: "string",
      },
      {
        name: "icon",
        type: "ReactNode",
      },
      {
        name: "detail",
        type: "string",
      },
      {
        name: "favicon",
        type: "string | ReactNode",
      },
      {
        name: "timer",
        type: "boolean",
        default: "true",
      },
      {
        name: "elapsed",
        type: "number",
      },
      {
        name: "shimmer",
        type: "boolean",
      },
      {
        name: "className",
        type: "string",
      },
    ],
    usage: `"use client"

import { AiStatus, AiStatusIcon } from "@/components/ui/ai-status"

export function Status({ step }: { step: string }) {
  return (
    <AiStatus
      state={step}
      detail="12 sources"
      states={{
        // a custom state that reuses a built-in icon
        browsing: { label: "Browsing", icon: <AiStatusIcon state="researching" /> },
        // a custom state with your own svg
        coding: {
          label: "Writing code",
          icon: (
            <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M8 6l-6 6 6 6M16 6l6 6-6 6" />
            </svg>
          ),
        },
        // override a built-in label
        done: { label: (time) => (time ? \`Answered in \${time}\` : "Answered"), active: false },
      }}
    />
  )
}`,
  },
  {
    href: "/components/promptbox",
    category: "ai",
    isNew: true,
    registry: "prompt-box",
    source: `${REGISTRY_HOMEPAGE}/blob/main/components/ui/prompt-box.tsx`,
    preview: "/componentdemos/promptbox.mp4",
    dependencies: [
      {
        name: "motion",
        icon: createElement(MotionIcon, { className: "h-4 w-4" }),
      },
    ],
    props: [
      {
        name: "onSubmit",
        type: "(prompt: string, effort: PromptEffort) => void",
      },
      {
        name: "efforts",
        type: "PromptEffort[]",
        default: "Quick, Think, Think deeply",
      },
      {
        name: "status",
        type: '"idle" | "streaming"',
        default: '"idle"',
        options: ["idle", "streaming"],
      },
      {
        name: "onStop",
        type: "() => void",
      },
      {
        name: "placeholder",
        type: "string | string[]",
        default: '"Ask anything"',
      },
      {
        name: "hint",
        type: "ReactNode",
        default: '"Hold to think harder"',
      },
      {
        name: "actions",
        type: "ReactNode",
      },
      {
        name: "value",
        type: "string",
      },
      {
        name: "defaultValue",
        type: "string",
        default: '""',
      },
      {
        name: "onValueChange",
        type: "(value: string) => void",
      },
      {
        name: "disabled",
        type: "boolean",
        default: "false",
      },
      {
        name: "inputRef",
        type: "Ref<HTMLTextAreaElement>",
      },
      {
        name: "inputProps",
        type: "TextareaHTMLAttributes",
      },
      {
        name: "className",
        type: "string",
      },
      {
        name: "labels",
        type: "Partial<PromptBoxLabels>",
      },
    ],
    usage: `"use client"

import { useState } from "react"
import { PromptBox, type PromptBoxStatus } from "@/components/ui/prompt-box"

export function Chat() {
  const [status, setStatus] = useState<PromptBoxStatus>("idle")

  return (
    <PromptBox
      status={status}
      placeholder={["Ask anything", "Plan a weekend in Kyoto"]}
      onSubmit={async (prompt, effort) => {
        setStatus("streaming")
        // effort.id is "quick", "think", or "deep"
        await sendToModel(prompt, effort.id)
        setStatus("idle")
      }}
      onStop={() => setStatus("idle")}
    />
  )
}`,
  },
  {
    href: "/components/streamingresponse",
    category: "ai",
    isNew: true,
    registry: "streaming-response",
    source: `${REGISTRY_HOMEPAGE}/blob/main/components/ui/streaming-response.tsx`,
    preview: "/componentdemos/streamingresponse.mp4",
    dependencies: [
      {
        name: "motion",
        icon: createElement(MotionIcon, { className: "h-4 w-4" }),
      },
      { name: "lucide-react" },
    ],
    props: [
      {
        name: "text",
        type: "string",
        required: true,
      },
      {
        name: "status",
        type: '"streaming" | "done" | "stopped"',
        default: '"done"',
        options: ["streaming", "done", "stopped"],
      },
      {
        name: "speed",
        type: "number",
        default: "8",
      },
      {
        name: "ink",
        type: "string",
      },
      {
        name: "actions",
        type: "boolean",
        default: "true",
      },
      {
        name: "onRetry",
        type: "() => void",
      },
      {
        name: "onFeedback",
        type: '(feedback: "up" | "down" | null) => void',
      },
      {
        name: "defaultFeedback",
        type: '"up" | "down" | null',
        default: "null",
      },
      {
        name: "onCopy",
        type: "(text: string) => void",
      },
      {
        name: "className",
        type: "string",
      },
      {
        name: "labels",
        type: "Partial<StreamingResponseLabels>",
      },
    ],
    usage: `"use client"

import { StreamingResponse } from "@/components/ui/streaming-response"

export function Reply({ text, done, onRetry }: { text: string; done: boolean; onRetry: () => void }) {
  return (
    <StreamingResponse
      // text grows as tokens arrive, like useChat's message content
      text={text}
      status={done ? "done" : "streaming"}
      onRetry={onRetry}
      onFeedback={(rating) => console.log(rating)}
    />
  )
}`,
  },
  {
    href: "/components/modelpicker",
    category: "ai",
    isNew: true,
    registry: "model-picker",
    source: `${REGISTRY_HOMEPAGE}/blob/main/components/ui/model-picker.tsx`,
    preview: "/componentdemos/modelpicker.mp4",
    dependencies: [
      {
        name: "motion",
        icon: createElement(MotionIcon, { className: "h-4 w-4" }),
      },
      { name: "lucide-react" },
    ],
    props: [
      {
        name: "models",
        type: "PickerModel[]",
        required: true,
      },
      {
        name: "value",
        type: "string",
      },
      {
        name: "defaultValue",
        type: "string",
      },
      {
        name: "onChange",
        type: "(id: string) => void",
      },
      {
        name: "searchable",
        type: "boolean",
        default: "true",
      },
      {
        name: "className",
        type: "string",
      },
      {
        name: "labels",
        type: "Partial<ModelPickerLabels>",
      },
    ],
    usage: `"use client"

import { useState } from "react"
import { ModelPicker, type PickerModel } from "@/components/ui/model-picker"

const models: PickerModel[] = [
  { id: "opus", name: "Claude Opus 5.5", provider: "Anthropic", description: "Most capable", speed: 2, intelligence: 5 },
  { id: "sonnet", name: "Claude Sonnet 5.5", provider: "Anthropic", description: "Smart and quick", speed: 4, intelligence: 4 },
  { id: "haiku", name: "Claude Haiku 5.5", provider: "Anthropic", description: "Fastest", speed: 5, intelligence: 3 },
]

export function Toolbar() {
  const [model, setModel] = useState("opus")
  return <ModelPicker models={models} value={model} onChange={setModel} />
}`,
  },
  {
    href: "/components/updatenotice",
    category: "project",
    isNew: true,
    registry: "update-notice",
    source: `${REGISTRY_HOMEPAGE}/blob/main/components/ui/update-notice.tsx`,
    dependencies: [
      {
        name: "motion",
        icon: createElement(MotionIcon, { className: "h-4 w-4" }),
      },
    ],
    props: [
      {
        name: "open",
        type: "boolean",
      },
      {
        name: "onUpdate",
        type: "() => void",
      },
      {
        name: "onLater",
        type: "() => void",
      },
      {
        name: "labels",
        type: "Partial<UpdateNoticeLabels>",
      },
      {
        name: "className",
        type: "string",
      },
    ],
    usage: `// next.config.ts: one build id per build, compiled into the bundle and served at /app-version.json
process.env.NEXT_PUBLIC_BUILD_TIME ??= new Date().toISOString()

// app/layout.tsx: mount it once
import { UpdateNotice } from "@/components/ui/update-notice"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <UpdateNotice />
      </body>
    </html>
  )
}

// anywhere: a request failed in a way a new deploy explains, so check now
import { requestUpdateCheck } from "@/lib/app-update"

requestUpdateCheck()`,
  },
  {
    href: "/components/appinfo",
    category: "project",
    isNew: true,
    registry: "app-info",
    source: `${REGISTRY_HOMEPAGE}/blob/main/components/ui/app-info.tsx`,
    props: [
      {
        name: "info",
        type: "Record<string, unknown>",
        required: true,
      },
      {
        name: "enabled",
        type: "boolean",
        default: "true",
      },
      {
        name: "color",
        type: "string",
        default: '"#61dafb"',
      },
    ],
    usage: `// app/layout.tsx: mount it once
import { AppInfo, buildVersion, formatBuildTime } from "@/components/ui/app-info"

// next.config.ts sets it once per build:
// process.env.NEXT_PUBLIC_BUILD_TIME ??= new Date().toISOString()
const BUILD_TIME = process.env.NEXT_PUBLIC_BUILD_TIME
const TIME_ZONE = "Asia/Shanghai"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <AppInfo
          info={{
            // 2026.11.25.1627: the version is the build date, nothing to bump by hand
            "my-app": buildVersion(BUILD_TIME, TIME_ZONE),
            // 2026-11-25 16:27:02 +08:00
            "build time": formatBuildTime(BUILD_TIME, TIME_ZONE),
            api: process.env.NEXT_PUBLIC_API_URL,
          }}
        />
      </body>
    </html>
  )
}

// anywhere: print one variable while debugging
import { printInfo } from "@/components/ui/app-info"

printInfo("user", user)`,
  },
];

const EN_TEXT: Record<string, ComponentTranslation> = enComponents;

export const components: ComponentItem[] = sources.map((item) =>
  withText(item, EN_TEXT[componentSlug(item.href)]),
);

export type PackageManager = "npm" | "pnpm" | "yarn" | "bun";

const PM_EXECUTORS: Record<PackageManager, string> = {
  npm: "npx",
  pnpm: "pnpm dlx",
  yarn: "yarn dlx",
  bun: "bunx --bun",
};

export const PACKAGE_MANAGERS = Object.keys(PM_EXECUTORS) as PackageManager[];

export function installCommand(
  item: ComponentItem,
  pm: PackageManager = "npm",
): string | null {
  if (!item.registry) return null;
  // @latest matters: npx otherwise picks a stale local shadcn, and url registries need a recent cli
  return `${PM_EXECUTORS[pm]} shadcn@latest add ${registryItemUrl(item.registry)}`;
}

export type ComponentSection = {
  id: ComponentCategory | "new";
  items: ComponentItem[];
};

// gallery sections: New repeats its members so they still appear under their own category
export const gallerySections: ComponentSection[] = [
  {
    id: "new" as const,
    items: components
      .filter((c) => c.isNew)
      .reverse()
      .sort(
        (a, b) =>
          Number(b.href === "/components/toast") -
          Number(a.href === "/components/toast"),
      ),
  },
  ...CATEGORY_ORDER.map((id) => ({
    id,
    items: components.filter((c) => c.category === id),
  })),
].filter((section) => section.items.length > 0);

export function registryComponent(name: string): ComponentItem | undefined {
  return components.find((c) => c.registry === name);
}

export function swatchProp(item?: ComponentItem): ComponentProp | undefined {
  return item?.props?.find((p) => p.control === "swatch" && p.optionColors);
}

export function cleanDefault(prop?: ComponentProp): string | undefined {
  return prop?.default?.replace(/^["']|["']$/g, "");
}
