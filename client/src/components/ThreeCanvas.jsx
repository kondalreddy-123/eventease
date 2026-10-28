import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeCanvas({ className = '', interactive = true }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 24;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // Group for objects
    const group = new THREE.Group();
    scene.add(group);

    // 1. Festive Glowing Particles (Golden & Violet Confetti Dust)
    const particleCount = 200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const palette = [
      new THREE.Color(0x8b5cf6), // Purple
      new THREE.Color(0xc084fc), // Lavender
      new THREE.Color(0xf59e0b), // Amber Gold
      new THREE.Color(0xec4899), // Pink
      new THREE.Color(0x38bdf8), // Sky Blue
    ];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30;

      const col = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.45,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(geometry, particleMaterial);
    group.add(particles);

    // 2. Floating Celebratory 3D Rings & Crystals
    const shapes = [];

    // Main Torus Knot (Symbolizing celebration bond & festivity)
    const knotGeo = new THREE.TorusKnotGeometry(4.5, 0.8, 100, 16);
    const knotMat = new THREE.MeshStandardMaterial({
      color: 0x7c3aed,
      roughness: 0.25,
      metalness: 0.8,
      wireframe: false,
      transparent: true,
      opacity: 0.65
    });
    const knot = new THREE.Mesh(knotGeo, knotMat);
    group.add(knot);
    shapes.push(knot);

    // Floating Ring 1
    const ringGeo1 = new THREE.TorusGeometry(8, 0.2, 16, 100);
    const ringMat1 = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.3,
      metalness: 0.9,
      transparent: true,
      opacity: 0.55
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    group.add(ring1);
    shapes.push(ring1);

    // Floating 3D Icosahedrons (Celebration Gems)
    const gemGeo = new THREE.IcosahedronGeometry(1.2, 0);
    for (let i = 0; i < 6; i++) {
      const gemMat = new THREE.MeshStandardMaterial({
        color: palette[i % palette.length],
        roughness: 0.2,
        metalness: 0.7,
        transparent: true,
        opacity: 0.75
      });
      const gem = new THREE.Mesh(gemGeo, gemMat);
      const angle = (i / 6) * Math.PI * 2;
      const radius = 10 + (i % 2) * 3;
      gem.position.set(Math.cos(angle) * radius, Math.sin(angle) * (radius * 0.6), (Math.random() - 0.5) * 6);
      group.add(gem);
      shapes.push(gem);
    }

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xa855f7, 3, 50);
    pointLight1.position.set(15, 15, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xf59e0b, 2.5, 50);
    pointLight2.position.set(-15, -10, 10);
    scene.add(pointLight2);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      if (!interactive) return;
      const rect = mount.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Handle Resize
    const handleResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (document.hidden) return; // Save CPU/GPU power when user switches tabs
      const elapsedTime = clock.getElapsedTime();

      if (prefersReducedMotion) {
        // Minimal static rendering for users with vestibular motion sensitivity
        group.rotation.y = 0.1;
        renderer.render(scene, camera);
        return;
      }

      // Smooth camera sway following mouse
      targetX += (mouseX * 4 - targetX) * 0.05;
      targetY += (mouseY * 3 - targetY) * 0.05;

      group.rotation.y = elapsedTime * 0.12 + targetX * 0.2;
      group.rotation.x = Math.sin(elapsedTime * 0.1) * 0.1 + targetY * 0.15;

      // Individual mesh rotations
      knot.rotation.x = elapsedTime * 0.25;
      knot.rotation.y = elapsedTime * 0.35;

      ring1.rotation.z = elapsedTime * 0.15;

      // Gentle floating of particles
      particles.rotation.y = -elapsedTime * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      geometry.dispose();
      particleMaterial.dispose();
      knotGeo.dispose();
      knotMat.dispose();
      ringGeo1.dispose();
      ringMat1.dispose();
    };
  }, [interactive]);

  return (
    <div
      ref={mountRef}
      role="presentation"
      aria-hidden="true"
      className={`relative w-full h-full overflow-hidden pointer-events-none select-none ${className}`}
      style={{ minHeight: '320px' }}
    />
  );
}
