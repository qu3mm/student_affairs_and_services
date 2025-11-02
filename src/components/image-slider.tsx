"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import image from "../../public/images/01.jpg";
import nstp_studnet from "../../public/images/nstp_student.jpg";

const images = [image, nstp_studnet];

const ImageSlider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000); // auto-slide every 4 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-(--breakpoint-xl) mx-auto rounded-xl overflow-hidden shadow-lg aspect-video">
      <Image
        src={images[current]}
        alt={`Slide ${current + 1}`}
        width={1280}
        height={720}
        className="object-cover w-full h-full transition-all duration-700 ease-in-out"
        priority
      />
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {images.map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full ${
              i === current ? "bg-blue-700" : "bg-white/50"
            } transition-all duration-300`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
