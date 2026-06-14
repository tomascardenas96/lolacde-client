import { Pinyon_Script } from "next/font/google";

const pinyonScript = Pinyon_Script({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--logo-font",
});

export default function Logo({
  compact = false,
  color = "light",
  size = "normal",
  withSlogan = true,
}: {
  compact?: boolean;
  color?: "light" | "dark";
  size?: "normal" | "large";
  withSlogan?: boolean;
}) {
  return (
    <div
      className={`flex flex-col items-center transition-all duration-500 ease-in-out ${
        size === "normal" ? "gap-0" : "gap-1"
      }`}
    >
      <span
        className={`${pinyonScript.className} ${pinyonScript.variable} font-bold transition-all duration-500 ease-in-out ${
          size === "large" ? "text-[4rem]" : "text-[1.9rem]"
        } ${color === "light" ? "text-white" : "text-[#3d3d3d]"}`}
      >
        Lola
      </span>
      {withSlogan && (
        <span
          className={`transition-all duration-500 ease-in-out tracking-[-0.001em] ${
            size === "large"
              ? "text-[1rem] mt-[-1.6rem] font-thin"
              : "text-[.7rem] mt-[-.3rem] font-light"
          } ${color === "dark" ? "text-[#3d3d3d]" : "text-accent"}`}
        >
          CENTRO DE ESTÉTICA
        </span>
      )}
    </div>
  );
}
