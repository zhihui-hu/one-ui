"use client";

import { type ComponentItem, CONTACT_EMAIL } from "@/lib/components";
import { format } from "@/lib/i18n/format";
import { cn } from "@/lib/utils";
import CopyButton from "../CopyButton";
import Tooltip from "../Tooltip";
import PanelCode from "./PanelCode";
import InstallCommand from "./InstallCommand";
import DependencyPill from "./DependencyPill";
import PropsTable from "./PropsTable";
import { MailIcon } from "./icons";
import { useI18n } from "@/components/i18n/I18nProvider";

type DescriptionContentProps = {
  item?: ComponentItem;
  showSourceHint?: boolean;
  className?: string;
};

function SectionLabel({
  as: Tag = "p",
  children,
}: {
  as?: "p" | "h1" | "h2";
  children: React.ReactNode;
}) {
  return (
    <Tag className="text-xs font-medium uppercase tracking-normal text-foreground/40">
      {children}
    </Tag>
  );
}

export default function DescriptionContent({
  item,
  showSourceHint = true,
  className,
}: DescriptionContentProps) {
  const { m } = useI18n();
  return (
    <div className={cn("flex flex-col gap-12 text-left", className)}>
      <div className="flex flex-col gap-4">
        <SectionLabel as="h1">{item?.name ?? m.docs.component}</SectionLabel>
        <p className="text-2xl font-semibold leading-relaxed font-sans text-foreground/90">
          {item?.description ?? m.docs.unavailable}
        </p>
      </div>

      {item?.dependencies && item.dependencies.length > 0 && (
        <div className="flex flex-col gap-3">
          <SectionLabel as="h2">{m.docs.sections.dependencies}</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {item.dependencies.map((dep) => (
              <DependencyPill key={dep.name} name={dep.name} icon={dep.icon} />
            ))}
          </div>
        </div>
      )}

      {item?.interaction && (
        <div className="flex flex-col gap-3">
          <SectionLabel as="h2">{m.docs.sections.interaction}</SectionLabel>
          <p className="text-sm leading-relaxed text-foreground/70">
            {item.interaction}
          </p>
        </div>
      )}

      {item?.props && item.props.length > 0 && (
        <div className="flex flex-col gap-3">
          <SectionLabel as="h2">{m.docs.sections.props}</SectionLabel>
          <p className="-mt-1 text-sm leading-relaxed text-foreground/70">
            {m.docs.propsHint}
          </p>
          <PropsTable props={item.props} />
        </div>
      )}

      {item?.registry && (
        <div className="flex flex-col gap-3">
          <SectionLabel as="h2">{m.docs.sections.installation}</SectionLabel>
          <InstallCommand item={item} />
        </div>
      )}

      {item?.usage && (
        <div className="flex flex-col gap-3">
          <SectionLabel as="h2">{m.docs.sections.usage}</SectionLabel>
          <PanelCode code={item.usage} className="rounded-lg p-4" />
        </div>
      )}

      {item?.registry && showSourceHint && (
        <div className="flex flex-col gap-3">
          <SectionLabel as="h2">{m.docs.sections.source}</SectionLabel>
          <p className="text-sm leading-relaxed text-foreground/70">
            {m.docs.panel.sourceHint}
          </p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <SectionLabel as="h2">{m.docs.sections.keepInMind}</SectionLabel>
        <p className="text-sm leading-relaxed text-foreground/70">
          {m.docs.panel.keepInMind}
        </p>
      </div>

      {item?.credits && item.credits.length > 0 && (
        <div className="flex flex-col gap-3">
          <SectionLabel as="h2">{m.docs.sections.credits}</SectionLabel>

          <ul className="flex flex-col gap-2 text-sm leading-relaxed text-foreground/70">
            {item.credits.map((credit) => (
              <li key={credit} className="flex gap-2">
                <span className="text-foreground/40">•</span>
                <span>{credit}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <SectionLabel as="h2">{m.docs.sections.contact}</SectionLabel>
        <p className="text-sm leading-relaxed text-foreground/70">
          {m.docs.panel.contactNote}
        </p>
        <div className="flex items-center gap-2">
          <Tooltip label={CONTACT_EMAIL} align="start">
            <CopyButton
              value={CONTACT_EMAIL}
              label={format(m.docs.copyEmail, { email: CONTACT_EMAIL })}
              title=""
              idleIcon={<MailIcon />}
              iconClassName="size-5"
              className="size-8 hover:text-foreground"
            />
          </Tooltip>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <SectionLabel as="h2">{m.docs.sections.license}</SectionLabel>
        <ul className="flex flex-col gap-2 text-sm leading-relaxed text-foreground/70">
          {m.docs.panel.license.map((line) => (
            <li key={line} className="flex gap-2">
              <span className="text-foreground/40">•</span>
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
