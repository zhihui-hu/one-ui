import { Fragment, type ReactNode } from "react";

type Renderers = Record<string, (chunk: string) => ReactNode>;

// renders "<tag>text</tag>" placeholders from a message with the given renderers
export function rich(message: string, renderers: Renderers): ReactNode {
  const parts = message.split(/(<(\w+)>.*?<\/\2>)/g);
  const nodes: ReactNode[] = [];
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    const match = /^<(\w+)>(.*?)<\/\1>$/.exec(part);
    if (match && renderers[match[1]]) {
      nodes.push(<Fragment key={i}>{renderers[match[1]](match[2])}</Fragment>);
      i++;
    } else if (part) {
      nodes.push(part);
    }
  }
  return nodes;
}
