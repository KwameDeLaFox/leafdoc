import { HomeHero } from "@/components/home-hero";
import { MyPlantsGallery } from "@/components/my-plants-gallery";

export default function Home() {
  return (
    <div className="flex flex-col gap-12 pb-12">
      <HomeHero />

      <MyPlantsGallery />

      <section className="p-6 rounded-3xl bg-muted/50 border border-dashed flex flex-col items-center text-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          ADVERTISEMENT
        </span>
        <div className="w-full h-32 bg-muted rounded-xl flex items-center justify-center text-muted-foreground/50 text-sm italic">
          Google AdSense Placeholder
        </div>
      </section>
    </div>
  );
}
