import { createFileRoute } from "@tanstack/react-router";
import { SkyApp } from "@/components/sky/SkyApp";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Tashrihul Aflak 3D — Interactive Celestial Sphere" },
      { name: "description", content: "Explore the 30 circles and arcs of تشريح الأفلاك on a live, astronomically accurate 3D celestial sphere." },
      { property: "og:title", content: "Tashrihul Aflak 3D — Interactive Celestial Sphere" },
      { property: "og:description", content: "Great circles, small circles and arcs of classical astronomy in interactive 3D, in Malayalam, Arabic and English." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SkyApp,
});
