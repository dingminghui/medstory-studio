import Image from "next/image";

export function HomeBranding() {
  return (
    <div className="flex flex-col items-center gap-3">
      <Image
        alt="MedStory Studio"
        height={48}
        src="/assets/logo.png"
        width={140}
        className="object-contain"
        priority
      />
      <p className="text-muted-foreground text-center text-sm">
        输入文章标题或写作需求，AI 将辅助你完成医学写作
      </p>
    </div>
  );
}
