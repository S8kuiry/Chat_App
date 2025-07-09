"use client";

import React, { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

function MousePosition() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return mousePosition;
}

function hexToRgb(hex) {
  hex = hex.replace("#", "");
  if (hex.length === 3) {
    hex = hex.split("").map((char) => char + char).join("");
  }
  const hexInt = parseInt(hex, 16);
  return [(hexInt >> 16) & 255, (hexInt >> 8) & 255, hexInt & 255];
}

function remapValue(value, from1, to1, from2, to2) {
  return ((value - from1) * (to2 - from2)) / (to1 - from1) + from2;
}

export const Particles = ({
  className = "",
  quantity = 100,
  staticity = 50,
  ease = 50,
  size = 0.4,
  refresh = false,
  color = "#ffffff",
  vx = 0,
  vy = 0,
  ...props
}) => {
  const canvasRef = useRef(null);
  const canvasContainerRef = useRef(null);
  const context = useRef(null);
  const circles = useRef([]);
  const mousePosition = MousePosition();
  const mouse = useRef({ x: 0, y: 0 });
  const canvasSize = useRef({ w: 0, h: 0 });
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;
  const rafID = useRef(null);
  const resizeTimeout = useRef(null);
  const rgb = hexToRgb(color);

  useEffect(() => {
    if (canvasRef.current) {
      context.current = canvasRef.current.getContext("2d");
    }
    initCanvas();
    animate();

    const handleResize = () => {
      clearTimeout(resizeTimeout.current);
      resizeTimeout.current = setTimeout(initCanvas, 200);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(rafID.current);
      clearTimeout(resizeTimeout.current);
      window.removeEventListener("resize", handleResize);
    };
  }, [color]);

  useEffect(() => {
    updateMousePosition();
  }, [mousePosition]);

  useEffect(() => {
    initCanvas();
  }, [refresh]);

  const updateMousePosition = () => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const { w, h } = canvasSize.current;
    const x = mousePosition.x - rect.left - w / 2;
    const y = mousePosition.y - rect.top - h / 2;
    const inside = x < w / 2 && x > -w / 2 && y < h / 2 && y > -h / 2;
    if (inside) {
      mouse.current = { x, y };
    }
  };

  const initCanvas = () => {
    resizeCanvas();
    drawParticles();
  };

  const resizeCanvas = () => {
    if (canvasContainerRef.current && canvasRef.current && context.current) {
      const width = canvasContainerRef.current.offsetWidth;
      const height = canvasContainerRef.current.offsetHeight;

      canvasSize.current = { w: width, h: height };
      canvasRef.current.width = width * dpr;
      canvasRef.current.height = height * dpr;
      canvasRef.current.style.width = `${width}px`;
      canvasRef.current.style.height = `${height}px`;
      context.current.setTransform(dpr, 0, 0, dpr, 0, 0);

      circles.current = [];
      for (let i = 0; i < quantity; i++) {
        drawCircle(circleParams());
      }
    }
  };

  const circleParams = () => {
    const { w, h } = canvasSize.current;
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      translateX: 0,
      translateY: 0,
      size: Math.random() * 2 + size,
      alpha: 0,
      targetAlpha: Math.random() * 0.6 + 0.1,
      dx: (Math.random() - 0.5) * 0.1,
      dy: (Math.random() - 0.5) * 0.1,
      magnetism: 0.1 + Math.random() * 4,
    };
  };

  const drawCircle = (circle, update = false) => {
    if (!context.current) return;
    const { x, y, translateX, translateY, size, alpha } = circle;
    context.current.save();
    context.current.translate(translateX, translateY);
    context.current.beginPath();
    context.current.arc(x, y, size, 0, 2 * Math.PI);
    context.current.fillStyle = `rgba(${rgb.join(",")}, ${alpha})`;
    context.current.fill();
    context.current.restore();
    if (!update) circles.current.push(circle);
  };

  const clearContext = () => {
    if (context.current) {
      context.current.clearRect(0, 0, canvasSize.current.w, canvasSize.current.h);
    }
  };

  const drawParticles = () => {
    clearContext();
    for (let i = 0; i < quantity; i++) {
      drawCircle(circleParams());
    }
  };

  const animate = () => {
    clearContext();
    circles.current.forEach((circle, i) => {
      const edgeDistances = [
        circle.x + circle.translateX - circle.size,
        canvasSize.current.w - circle.x - circle.translateX - circle.size,
        circle.y + circle.translateY - circle.size,
        canvasSize.current.h - circle.y - circle.translateY - circle.size,
      ];
      const closestEdge = Math.min(...edgeDistances);
      const remap = Math.min(1, remapValue(closestEdge, 0, 20, 0, 1));
      circle.alpha = remap >= 1 ? Math.min(circle.alpha + 0.02, circle.targetAlpha) : circle.targetAlpha * remap;

      circle.x += circle.dx + vx;
      circle.y += circle.dy + vy;

      circle.translateX += (mouse.current.x / (staticity / circle.magnetism) - circle.translateX) / ease;
      circle.translateY += (mouse.current.y / (staticity / circle.magnetism) - circle.translateY) / ease;

      drawCircle(circle, true);

      if (
        circle.x < -circle.size || circle.x > canvasSize.current.w + circle.size ||
        circle.y < -circle.size || circle.y > canvasSize.current.h + circle.size
      ) {
        circles.current.splice(i, 1);
        drawCircle(circleParams());
      }
    });

    rafID.current = requestAnimationFrame(animate);
  };

  return (
    <div
      ref={canvasContainerRef}
      className={twMerge("pointer-events-none absolute inset-0", className)}
      aria-hidden="true"
      {...props}
    >
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};
