"use client";

import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import "./rotating-photo-ring.css";

const UNSPLASH_IDS = [
  "1540968221243-29f5d70540bf",
  "1596135187959-562c650d98bc",
  "1628944682084-831f35256163",
  "1590013330451-3946e83e0392",
  "1590421959604-741d0eec0a2e",
  "1572613000712-eadc57acbecd",
  "1570097192570-4b49a6736f9f",
  "1620789550663-2b10e0080354",
  "1617775623669-20bff4ffaa5c",
  "1548600916-dc8492f8e845",
  "1573824969595-a76d4365a2e6",
  "1633936929709-59991b5fdd72",
] as const;

const N = UNSPLASH_IDS.length;

type RotatingPhotoRingProps = {
  /** Encaixa na prévia da biblioteca (altura fixa). */
  variant?: "default" | "preview";
};

/** Carrossel circular só com CSS 3D (sem WebGL). */
export function RotatingPhotoRing({ variant = "default" }: RotatingPhotoRingProps) {
  return (
    <div className={cn("rpr-scene", variant === "preview" && "rpr-scene--preview")}>
      <div className="rpr-a3d" style={{ "--n": N } as CSSProperties}>
        {UNSPLASH_IDS.map((id, i) => (
          // eslint-disable-next-line @next/next/no-img-element -- transform 3D precisa do <img> sem wrapper
          <img
            key={id}
            className="rpr-card"
            src={`https://images.unsplash.com/photo-${id}?w=280&q=75`}
            alt=""
            width={280}
            height={400}
            loading="lazy"
            decoding="async"
            style={{ "--i": i } as CSSProperties}
          />
        ))}
      </div>
    </div>
  );
}
