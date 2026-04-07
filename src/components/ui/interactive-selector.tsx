"use client";

import React, { useEffect, useState } from "react";
import { FaCampground, FaFire, FaTint, FaHotTub, FaHiking } from "react-icons/fa";

const options = [
  {
    title: "Luxury Tent",
    description: "Cozy glamping under the stars",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    icon: <FaCampground size={24} className="text-white" />,
  },
  {
    title: "Campfire Feast",
    description: "Gourmet s'mores & stories",
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80",
    icon: <FaFire size={24} className="text-white" />,
  },
  {
    title: "Lakeside Retreat",
    description: "Private dock & canoe rides",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    icon: <FaTint size={24} className="text-white" />,
  },
  {
    title: "Mountain Spa",
    description: "Outdoor sauna & hot tub",
    image: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80",
    icon: <FaHotTub size={24} className="text-white" />,
  },
  {
    title: "Guided Adventure",
    description: "Expert-led nature tours",
    image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=800&q=80",
    icon: <FaHiking size={24} className="text-white" />,
  },
];

export default function InteractiveSelector() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animatedOptions, setAnimatedOptions] = useState<number[]>([]);

  const handleOptionClick = (index: number) => {
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    options.forEach((_, i) => {
      const timer = setTimeout(() => {
        setAnimatedOptions((prev) => [...prev, i]);
      }, 180 * i);
      timers.push(timer);
    });

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#222] font-sans text-white">
      <div className="mt-8 mb-2 w-full max-w-2xl px-6 text-center">
        <h1 className="animate-fadeInTop mb-3 text-4xl font-extrabold tracking-tight text-white drop-shadow-lg delay-300 md:text-5xl">
          Escape in Style
        </h1>
        <p className="animate-fadeInTop max-w-xl text-lg font-medium text-gray-300 delay-600 md:text-xl">
          Discover luxurious camping experiences in nature&apos;s most breathtaking spots.
        </p>
      </div>

      <div className="h-12" />

      <div className="options relative mx-0 flex h-[400px] min-w-0 max-w-[900px] w-full items-stretch overflow-hidden sm:min-w-[600px]">
        {options.map((option, index) => (
          <div
            key={option.title}
            className={`option relative flex flex-col justify-end overflow-hidden transition-all duration-700 ease-in-out ${
              activeIndex === index ? "active" : ""
            }`}
            style={{
              backgroundImage: `url('${option.image}')`,
              backgroundSize: activeIndex === index ? "auto 100%" : "auto 120%",
              backgroundPosition: "center",
              backfaceVisibility: "hidden",
              opacity: animatedOptions.includes(index) ? 1 : 0,
              transform: animatedOptions.includes(index) ? "translateX(0)" : "translateX(-60px)",
              minWidth: "60px",
              minHeight: "100px",
              margin: 0,
              borderRadius: 0,
              borderWidth: "2px",
              borderStyle: "solid",
              borderColor: activeIndex === index ? "#fff" : "#292929",
              cursor: "pointer",
              backgroundColor: "#18181b",
              boxShadow:
                activeIndex === index ? "0 20px 60px rgba(0,0,0,0.50)" : "0 10px 30px rgba(0,0,0,0.30)",
              flex: activeIndex === index ? "7 1 0%" : "1 1 0%",
              zIndex: activeIndex === index ? 10 : 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              position: "relative",
              overflow: "hidden",
              willChange: "flex-grow, box-shadow, background-size, background-position",
            }}
            onClick={() => handleOptionClick(index)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") handleOptionClick(index);
            }}
            role="button"
            tabIndex={0}
          >
            <div
              className="shadow pointer-events-none absolute left-0 right-0 transition-all duration-700 ease-in-out"
              style={{
                bottom: activeIndex === index ? "0" : "-40px",
                height: "120px",
                boxShadow:
                  activeIndex === index
                    ? "inset 0 -120px 120px -120px #000, inset 0 -120px 120px -80px #000"
                    : "inset 0 -120px 0px -120px #000, inset 0 -120px 0px -80px #000",
              }}
            />

            <div className="label pointer-events-none absolute bottom-5 left-0 right-0 z-[2] flex h-12 w-full items-center justify-start gap-3 px-4">
              <div className="icon flex h-[44px] min-w-[44px] max-w-[44px] flex-shrink-0 flex-grow-0 items-center justify-center rounded-full border-2 border-[#444] bg-[rgba(32,32,32,0.85)] shadow-[0_1px_4px_rgba(0,0,0,0.18)] backdrop-blur-[10px] transition-all duration-200">
                {option.icon}
              </div>
              <div className="info relative whitespace-pre text-white">
                <div
                  className="main text-lg font-bold transition-all duration-700 ease-in-out"
                  style={{
                    opacity: activeIndex === index ? 1 : 0,
                    transform: activeIndex === index ? "translateX(0)" : "translateX(25px)",
                  }}
                >
                  {option.title}
                </div>
                <div
                  className="sub text-base text-gray-300 transition-all duration-700 ease-in-out"
                  style={{
                    opacity: activeIndex === index ? 1 : 0,
                    transform: activeIndex === index ? "translateX(0)" : "translateX(25px)",
                  }}
                >
                  {option.description}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes fadeInFromTop {
          0% {
            opacity: 0;
            transform: translateY(-20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInTop {
          opacity: 0;
          transform: translateY(-20px);
          animation: fadeInFromTop 0.8s ease-in-out forwards;
        }

        .delay-300 {
          animation-delay: 0.3s;
        }

        .delay-600 {
          animation-delay: 0.6s;
        }
      `}</style>
    </div>
  );
}
