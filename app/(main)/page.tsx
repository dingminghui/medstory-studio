import { MainHeader } from "@/components/main-header";
import { HomeBranding } from "./_components/home-branding";
import { HomeInputCard } from "./_components/home-input-card";

export default function HomePage() {
  return (
    <>
      <MainHeader />
      <main className="flex flex-1 items-center justify-center px-4 pb-28">
        <section className="flex w-full max-w-3xl flex-col items-center gap-6">
          <HomeBranding />
          <HomeInputCard />
        </section>
      </main>
    </>
  );
}
