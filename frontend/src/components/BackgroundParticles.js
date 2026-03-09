import React from "react";
import Particles from "react-tsparticles";

export default function BackgroundParticles() {
  return (
    <Particles
      options={{
        background: { color: { value: "transparent" } },
        fpsLimit: 60,
        particles: {
          color: { value: "#ffffff" },
          links: {
            color: "#ffffff",
            distance: 150,
            enable: true,
            opacity: 0.2,
            width: 1
          },
          move: {
            enable: true,
            speed: 1
          },
          number: {
            value: 40
          },
          opacity: {
            value: 0.3
          },
          size: {
            value: 2
          }
        }
      }}
    />
  );
}