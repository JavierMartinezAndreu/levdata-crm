import Image from "next/image";

import { brand } from "@/config/brand";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  variant?: "horizontal" | "symbol";
  className?: string;
  imageClassName?: string;
  priority?: boolean;
};

export function BrandLogo({
  variant = "horizontal",
  className,
  imageClassName,
  priority = false,
}: BrandLogoProps) {
  const isHorizontal = variant === "horizontal";

  return (
    <div
      className={cn(
        "relative flex items-center",
        isHorizontal ? "h-10 w-[170px]" : "size-11",
        className,
      )}
    >
      <Image
        src={isHorizontal ? brand.logo.horizontal : brand.logo.symbol}
        alt={isHorizontal ? "LevData" : "LevData isotipo"}
        fill
        priority={priority}
        sizes={isHorizontal ? "170px" : "44px"}
        className={cn("object-contain", imageClassName)}
      />
    </div>
  );
}