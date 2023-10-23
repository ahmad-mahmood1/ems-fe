import { cn } from "@/lib/utils";
import { Icons } from "../icons";

function Loader({
  className,
  size = 24,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <Icons.spinner
      className={cn("animate-spin m-auto", className)}
      width={size}
      height={size}
    />
  );
}

export default Loader;
