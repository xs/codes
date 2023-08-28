"use client";

import AspectRatioVideo from "@/components/AspectRatioVideo";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <AspectRatioVideo
        className="rounded-lg shadow-2xl w-full overflow-hidden"
        src="/videos/waves.mp4"
        ratio={16 / 9}
      />
    </main>
  );
}
