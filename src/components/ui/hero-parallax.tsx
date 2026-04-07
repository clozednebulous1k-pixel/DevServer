"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, MotionValue, useScroll, useSpring, useTransform } from "framer-motion";

export const HeroParallax = ({
  products,
}: {
  products: {
    title: string;
    link: string;
    thumbnail: string;
  }[];
}) => {
  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5, 10);
  const thirdRow = products.slice(10, 15);
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(useTransform(scrollYProgress, [0, 1], [0, 1000]), springConfig);
  const translateXReverse = useSpring(useTransform(scrollYProgress, [0, 1], [0, -1000]), springConfig);
  const rotateX = useSpring(useTransform(scrollYProgress, [0, 0.2], [15, 0]), springConfig);
  const opacity = useSpring(useTransform(scrollYProgress, [0, 0.2], [0.2, 1]), springConfig);
  const rotateZ = useSpring(useTransform(scrollYProgress, [0, 0.2], [20, 0]), springConfig);
  const translateY = useSpring(useTransform(scrollYProgress, [0, 0.2], [-500, 300]), springConfig);

  return (
    <div
      ref={ref}
      className="h-[220vh] overflow-hidden py-24 antialiased relative flex flex-col [perspective:1000px] [transform-style:preserve-3d]"
    >
      <ParallaxHeader />
      <motion.div style={{ rotateX, rotateZ, translateY, opacity }}>
        <motion.div className="mb-8 flex flex-row-reverse space-x-reverse space-x-5 md:mb-12 md:space-x-8">
          {firstRow.map((product) => (
            <ProductCard product={product} translate={translateX} key={product.title} />
          ))}
        </motion.div>
        <motion.div className="mb-8 flex flex-row space-x-5 md:mb-12 md:space-x-8">
          {secondRow.map((product) => (
            <ProductCard product={product} translate={translateXReverse} key={product.title} />
          ))}
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-5 md:space-x-8">
          {thirdRow.map((product) => (
            <ProductCard product={product} translate={translateX} key={product.title} />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

const ParallaxHeader = () => {
  return (
    <div className="relative left-0 top-0 mx-auto w-full max-w-6xl px-4 py-10 md:py-20">
      <h2 className="text-3xl font-bold md:text-6xl">
        Portfólio visual
        <br />
        de soluções DevServer
      </h2>
      <p className="mt-6 max-w-2xl text-base text-muted-foreground md:text-xl">
        Uma prévia do padrão visual que aplicamos em produtos reais: moderno,
        sólido e orientado à experiência do usuário.
      </p>
    </div>
  );
};

export const ProductCard = ({
  product,
  translate,
}: {
  product: {
    title: string;
    link: string;
    thumbnail: string;
  };
  translate: MotionValue<number>;
}) => {
  return (
    <motion.div
      style={{ x: translate }}
      whileHover={{ y: -20 }}
      key={product.title}
      className="group/product relative h-72 w-[22rem] flex-shrink-0 md:h-96 md:w-[30rem]"
    >
      <Link href={product.link} className="block h-full w-full overflow-hidden rounded-2xl group-hover/product:shadow-2xl">
        <Image
          src={product.thumbnail}
          height={600}
          width={600}
          className="absolute inset-0 h-full w-full object-cover object-center"
          alt={product.title}
        />
      </Link>
      <div className="pointer-events-none absolute inset-0 h-full w-full rounded-2xl bg-black opacity-0 group-hover/product:opacity-65" />
      <h3 className="absolute bottom-4 left-4 text-white opacity-0 group-hover/product:opacity-100">{product.title}</h3>
    </motion.div>
  );
};
