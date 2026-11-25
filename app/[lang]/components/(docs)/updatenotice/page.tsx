import JsonLd from "@/components/JsonLd";
import { componentJsonLd, componentPageMetadata } from "@/lib/seo";
import { resolveLocale, type LocaleParams } from "@/lib/i18n/params";
import Demo from "./demo";

const HREF = "/components/updatenotice";

export async function generateMetadata({ params }: LocaleParams) {
  return componentPageMetadata(HREF, await resolveLocale(params));
}

export default async function Page({ params }: LocaleParams) {
  const lang = await resolveLocale(params);

  return (
    <>
      <JsonLd data={componentJsonLd(HREF, lang)} />
      <Demo />
    </>
  );
}
