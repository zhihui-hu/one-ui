import Footer from "@/components/Footer";
import GooeyNavbar from "@/components/GooeyNavbar";
import NotFoundHero from "@/components/not-found/NotFoundHero";

// not-found receives no params, so NotFoundHero renders the localized <title>
export default async function NotFound() {
  return (
    <>
      <GooeyNavbar />

      <NotFoundHero />

      <Footer />
    </>
  );
}
