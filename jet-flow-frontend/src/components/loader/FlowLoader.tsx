"use client";

import { useEffect, useRef } from "react";

export default function JetTakeoffLoader() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const jetImg = new Image();
    jetImg.src = "/jet-loader.png"; // Jet with brand gradient colors
    const cloudImg = new Image();
    cloudImg.src = "/cloud.png";
    const logoImg = new Image();
    logoImg.src = "/jfo-logo.png"; // Your landing page logo

    // Initial positioning
    const roadHeight = height * 0.1;
    let jetX = width * 0.1;
    let jetY = height - roadHeight - 60;
    let liftOff = false;
    let tiltAngle = 0;
    let speed = 0;
    let roadOffset = 0;
    let cloudOffset = 0;
    let lightBlink = 0;

    const particles: {
      x: number;
      y: number;
      size: number;
      alpha: number;
      speedX: number;
      speedY: number;
      color: string;
    }[] = [];

    const createParticles = (x: number, y: number) => {
      for (let i = 0; i < 6; i++) {
        particles.push({
          x: x - 60 + Math.random() * 10,
          y: y + Math.random() * 10,
          size: Math.random() * 8 + 4,
          alpha: 1,
          speedX: -Math.random() * 2,
          speedY: Math.random() * 0.5 - 0.25,
          color:
            Math.random() > 0.4
              ? "rgba(255,200,0,0.9)" // Yellow fire
              : Math.random() > 0.7
              ? "rgba(255,100,0,0.8)" // Orange fire
              : "rgba(200,200,200,0.5)", // Smoke
        });
      }
    };

    const drawParticles = () => {
      particles.forEach((p, i) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
        p.x += p.speedX;
        p.y += p.speedY;
        p.alpha -= 0.02;
        if (p.alpha <= 0) particles.splice(i, 1);
      });
    };

    const drawRunway = () => {
      ctx.fillStyle = "#333";
      ctx.fillRect(0, height - roadHeight, width, roadHeight);

      // Runway stripes
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 4;
      ctx.setLineDash([60, 40]);
      ctx.lineDashOffset = -roadOffset;
      ctx.beginPath();
      ctx.moveTo(0, height - roadHeight / 2);
      ctx.lineTo(width, height - roadHeight / 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Blinking lights
      const lightGap = 80;
      const isOn = Math.floor(lightBlink / 20) % 2 === 0;
      for (let i = 0; i < width; i += lightGap) {
        ctx.beginPath();
        ctx.arc(i, height - roadHeight + 10, 6, 0, Math.PI * 2);
        ctx.fillStyle = isOn ? "#FFD700" : "#FFA500";
        ctx.fill();
      }
    };

    const drawClouds = () => {
      for (let i = 0; i < 5; i++) {
        ctx.drawImage(
          cloudImg,
          (i * width) / 4 - cloudOffset,
          height * 0.15 * (i % 3),
          180,
          100
        );
      }
    };

    const drawMotionBlur = () => {
      const gradient = ctx.createLinearGradient(jetX - 150, jetY, jetX, jetY);
      gradient.addColorStop(0, "rgba(255,255,255,0)");
      gradient.addColorStop(1, "rgba(255,255,255,0.2)");

      ctx.fillStyle = gradient;
      ctx.fillRect(jetX - 200, jetY - 40, 200, 80);
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Background
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, "#ffffff");
      gradient.addColorStop(1, "#e6f4e6");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Scroll offsets
      roadOffset += 4;
      if (roadOffset > 100) roadOffset = 0;

      cloudOffset += 0.3;
      if (cloudOffset > width / 4) cloudOffset = 0;

      lightBlink++;

      drawClouds();
      drawRunway();

      // Jet movement
      if (!liftOff) {
        speed += 0.5;
        jetX += speed;
        if (jetX > width * 0.3) liftOff = true;
      } else {
        tiltAngle = Math.min(tiltAngle + 0.005, 0.25);
        jetX += speed * 0.5;
        jetY -= speed * 0.2;
      }

      createParticles(jetX, jetY + 20);
      drawParticles();
      drawMotionBlur();

      ctx.save();
      ctx.translate(jetX, jetY);
      ctx.rotate(-tiltAngle);
      ctx.drawImage(jetImg, -120, -80, 300, 180);
      ctx.restore();

      // Draw logo in center
      if (logoImg.complete) {
        const logoWidth = 500;
        const logoHeight = 500;
        ctx.drawImage(
          logoImg,
          width / 2 - logoWidth / 2,
          height / 2 - logoHeight / 2 - 100,
          logoWidth,
          logoHeight
        );
      }

      if (jetX > width + 200) {
        jetX = width * 0.1;
        jetY = height - roadHeight - 60;
        liftOff = false;
        tiltAngle = 0;
        speed = 0;
      }

      requestAnimationFrame(animate);
    };

    jetImg.onload = animate;
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <canvas ref={canvasRef} />
    </div>
  );
}
