"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { vertexShader, fragmentShader } from "@/app/lib/shaders";

export default function FractalGlassImage({
  src,
  className = "",
  config: userConfig = {},
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const config = {
      lerpFactor: 0.035,
      parallaxStrength: 0.1,
      distortionMultiplier: 10,
      glassStrength: 2.0,
      glassSmoothness: 0.0001,
      stripesFrequency: 35,
      edgePadding: 0.1,
      ...userConfig,
    };

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    const { offsetWidth: width, offsetHeight: height } = containerRef.current;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    containerRef.current.appendChild(renderer.domElement);

    // --- Shader Material
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: null },
        uResolution: { value: new THREE.Vector2(width, height) },
        uTextureSize: { value: new THREE.Vector2(1, 1) },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uParallaxStrength: { value: config.parallaxStrength },
        uDistortionMultiplier: { value: config.distortionMultiplier },
        uGlassStrength: { value: config.glassStrength },
        uStripesFrequency: { value: config.stripesFrequency },
        uGlassSmoothness: { value: config.glassSmoothness },
        uEdgePadding: { value: config.edgePadding },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // --- Texture Load
    const loader = new THREE.TextureLoader();
    loader.load(
      src,
      (tex) => {
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.generateMipmaps = false;
        material.uniforms.uTexture.value = tex;
        material.uniforms.uTextureSize.value.set(
          tex.image.naturalWidth,
          tex.image.naturalHeight,
        );
      },
      undefined,
      (err) => console.error("❌ Texture failed to load:", src, err),
    );

    // --- Mouse
    const mouse = new THREE.Vector2(0.5, 0.5);
    const targetMouse = new THREE.Vector2(0.5, 0.5);

    const onMouseMove = (e) => {
      const rect = containerRef.current.getBoundingClientRect();
      targetMouse.x = (e.clientX - rect.left) / rect.width;
      targetMouse.y = 1 - (e.clientY - rect.top) / rect.height;
    };
    window.addEventListener("mousemove", onMouseMove);

    // --- Animate
    let rafId;
    const animate = () => {
      mouse.lerp(targetMouse, config.lerpFactor);
      material.uniforms.uMouse.value.copy(mouse);
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    };
    animate();

    // --- Resize
    const resizeObserver = new ResizeObserver(() => {
      const w = containerRef.current.offsetWidth;
      const h = containerRef.current.offsetHeight;
      renderer.setSize(w, h);
      material.uniforms.uResolution.value.set(w, h);
    });
    resizeObserver.observe(containerRef.current);

    // --- Cleanup
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
      resizeObserver.disconnect();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode)
        renderer.domElement.parentNode.removeChild(renderer.domElement);
    };
  }, [src, userConfig]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden ${className}`}
    />
  );
}
