import { useEffect } from "react";

interface SeoProps {
  title: string;
  description?: string;
  path?: string;
}

const baseUrl = "https://2cfeb3e1-cedb-421b-b32b-2f659dfdf897.lovableproject.com/";

export function Seo({ title, description, path = "" }: SeoProps) {
  useEffect(() => {
    document.title = title;
    const desc = description ?? "Plan, time-block, and optimize your day with TimeCraft.";
    let tag = document.querySelector('meta[name="description"]');
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute('name', 'description');
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', desc);

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = baseUrl + path;
  }, [title, description, path]);
  return null;
}
