import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Landing3DHeroProps {
  flashActive?: boolean;
}

export const Landing3DHero: React.FC<Landing3DHeroProps> = ({ flashActive = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const flashLightRef = useRef<THREE.PointLight | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene, Camera, High-Performance WebGL Renderer
    const scene = new THREE.Scene();

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 500;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 14);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    container.appendChild(renderer.domElement);

    // 2. Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.2);
    scene.add(ambientLight);

    const mouseLight = new THREE.PointLight(0xfff8ed, 2.4, 25);
    mouseLight.position.set(0, 0, 8);
    scene.add(mouseLight);

    const flashLight = new THREE.PointLight(0xffffff, 0, 60);
    flashLight.position.set(0, 0, 10);
    scene.add(flashLight);
    flashLightRef.current = flashLight;

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(5, 12, 10);
    scene.add(keyLight);

    // 3. Procedural Drop Shadow Texture
    const createShadowTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext('2d')!;
      const gradient = ctx.createRadialGradient(64, 64, 12, 64, 64, 64);
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0.28)');
      gradient.addColorStop(0.4, 'rgba(0, 0, 0, 0.12)');
      gradient.addColorStop(0.8, 'rgba(0, 0, 0, 0.02)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 128, 128);
      const texture = new THREE.CanvasTexture(canvas);
      texture.generateMipmaps = false;
      return texture;
    };

    const shadowTexture = createShadowTexture();

    // 4. Load Photo Textures
    const textureLoader = new THREE.TextureLoader();
    const photoUrls = [
      '/images/wedding_strip_couple.jpg',
      '/images/wedding_polaroid_guests.jpg',
      '/images/wedding_bouquet_laugh.jpg',
      '/images/wedding_sparklers_toast.jpg',
      '/images/wedding_postcard_candid.jpg',
    ];

    interface CardItem {
      group: THREE.Group;
      baseX: number;
      baseY: number;
      baseZ: number;
      baseRotX: number;
      baseRotY: number;
      baseRotZ: number;
      floatSpeed: number;
      floatAmplitude: number;
      phase: number;
    }

    const cards: CardItem[] = [];

    // Pre-cache photo textures for high performance
    const loadedTextures = photoUrls.map((url) => {
      const tex = textureLoader.load(url);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.minFilter = THREE.LinearFilter;
      return tex;
    });

    // 8 Distinct photobooth prints floating closer to the center, hugging the hero headline
    const cardConfigs = [
      // 1. Front-Left Classic 3-Cut Strip
      {
        texture: loadedTextures[0],
        type: 'strip',
        w: 2.1,
        h: 4.8,
        x: -4.9,
        y: 0.35,
        z: 0.45,
        rotZ: 0.12,
        speed: 1.1,
        amp: 0.14,
        phase: 0,
      },
      // 2. Front-Right Classic Strip
      {
        texture: loadedTextures[0],
        type: 'strip',
        w: 2.1,
        h: 4.8,
        x: 4.9,
        y: 0.55,
        z: 0.45,
        rotZ: -0.1,
        speed: 0.95,
        amp: 0.16,
        phase: 2.1,
      },
      // 3. Lower-Left Postcard
      {
        texture: loadedTextures[2],
        type: 'postcard',
        w: 3.4,
        h: 2.5,
        x: -5.4,
        y: -2.3,
        z: -0.4,
        rotZ: -0.14,
        speed: 1.25,
        amp: 0.12,
        phase: 1.4,
      },
      // 4. Lower-Right Polaroid
      {
        texture: loadedTextures[3],
        type: 'polaroid',
        w: 2.9,
        h: 3.4,
        x: 5.4,
        y: -2.1,
        z: -0.35,
        rotZ: 0.12,
        speed: 1.0,
        amp: 0.15,
        phase: 3.5,
      },
      // 5. Upper-Left Floating Polaroid (peeking gracefully above left shoulder)
      {
        texture: loadedTextures[4],
        type: 'polaroid',
        w: 2.7,
        h: 3.2,
        x: -3.8,
        y: 3.3,
        z: -1.5,
        rotZ: -0.15,
        speed: 0.85,
        amp: 0.12,
        phase: 0.8,
      },
      // 6. Upper-Right Floating Postcard (peeking gracefully above right shoulder)
      {
        texture: loadedTextures[1],
        type: 'polaroid',
        w: 2.8,
        h: 3.3,
        x: 3.8,
        y: 3.3,
        z: -1.5,
        rotZ: 0.14,
        speed: 0.9,
        amp: 0.13,
        phase: 2.7,
      },
      // 7. Mid-Left Flanking Polaroid
      {
        texture: loadedTextures[3],
        type: 'polaroid',
        w: 2.7,
        h: 3.2,
        x: -7.0,
        y: 1.5,
        z: -0.9,
        rotZ: -0.18,
        speed: 1.05,
        amp: 0.14,
        phase: 4.2,
      },
      // 8. Mid-Right Flanking Postcard
      {
        texture: loadedTextures[2],
        type: 'postcard',
        w: 3.2,
        h: 2.3,
        x: 7.0,
        y: 1.4,
        z: -0.9,
        rotZ: 0.16,
        speed: 1.15,
        amp: 0.13,
        phase: 1.9,
      },
    ];

    cardConfigs.forEach((cfg) => {
      const group = new THREE.Group();
      group.position.set(cfg.x, cfg.y, cfg.z);
      group.rotation.set(0, 0, cfg.rotZ);

      // Card Body (White Matte Paper Border)
      const paperGeo = new THREE.PlaneGeometry(cfg.w, cfg.h);
      const paperMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.85,
        metalness: 0.05,
        side: THREE.DoubleSide,
      });
      const paperMesh = new THREE.Mesh(paperGeo, paperMat);
      group.add(paperMesh);

      // Card Image
      const photoTexture = cfg.texture;

      let imgW = cfg.w * 0.86;
      let imgH = cfg.h * 0.76;
      let imgY = (cfg.h - imgH) * 0.12;

      if (cfg.type === 'strip') {
        imgW = cfg.w * 0.84;
        imgH = cfg.h * 0.88;
        imgY = 0;
      }

      const imgGeo = new THREE.PlaneGeometry(imgW, imgH);
      const imgMat = new THREE.MeshStandardMaterial({
        map: photoTexture,
        roughness: 0.35,
        metalness: 0.08,
      });
      const imgMesh = new THREE.Mesh(imgGeo, imgMat);
      imgMesh.position.set(0, imgY, 0.015);
      group.add(imgMesh);

      // Soft Shadow Mesh Behind
      const shadowGeo = new THREE.PlaneGeometry(cfg.w * 1.35, cfg.h * 1.35);
      const shadowMat = new THREE.MeshBasicMaterial({
        map: shadowTexture,
        transparent: true,
        opacity: 0.65,
        depthWrite: false,
      });
      const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
      shadowMesh.position.set(0.12, -0.22, -0.06);
      group.add(shadowMesh);

      scene.add(group);

      cards.push({
        group,
        baseX: cfg.x,
        baseY: cfg.y,
        baseZ: cfg.z,
        baseRotX: 0,
        baseRotY: 0,
        baseRotZ: cfg.rotZ,
        floatSpeed: cfg.speed,
        floatAmplitude: cfg.amp,
        phase: cfg.phase,
      });
    });

    // 4b. Soft Studio Ambient Bokeh Particles (Golden hour studio motes)
    const particleCount = 28;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 16;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 6 - 1;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const createParticleTexture = () => {
      const c = document.createElement('canvas');
      c.width = 64;
      c.height = 64;
      const ctx = c.getContext('2d')!;
      const grad = ctx.createRadialGradient(32, 32, 4, 32, 32, 32);
      grad.addColorStop(0, 'rgba(251, 191, 36, 0.7)');
      grad.addColorStop(0.5, 'rgba(245, 158, 11, 0.2)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);
      const t = new THREE.CanvasTexture(c);
      t.generateMipmaps = false;
      return t;
    };

    const particleMat = new THREE.PointsMaterial({
      size: 0.35,
      map: createParticleTexture(),
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 5. Mouse Parallax Interaction
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetMouseX = Math.max(-1, Math.min(1, x));
      targetMouseY = Math.max(-1, Math.min(1, y));
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // 6. Resize Observer
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth || window.innerWidth;
      const newHeight = container.clientHeight || 500;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);

      // Adjust camera distance based on viewport width
      if (newWidth < 768) {
        camera.position.z = 18;
      } else if (newWidth < 1200) {
        camera.position.z = 15;
      } else {
        camera.position.z = 14;
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // 7. Animation Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse lerp
      currentMouseX += (targetMouseX - currentMouseX) * 0.04;
      currentMouseY += (targetMouseY - currentMouseY) * 0.04;

      mouseLight.position.x = currentMouseX * 6;
      mouseLight.position.y = currentMouseY * 4;

      cards.forEach((card) => {
        const floatY = Math.sin(elapsedTime * card.floatSpeed + card.phase) * card.floatAmplitude;
        const floatRot = Math.cos(elapsedTime * (card.floatSpeed * 0.8) + card.phase) * 0.02;

        card.group.position.x = card.baseX + currentMouseX * 0.28;
        card.group.position.y = card.baseY + floatY + currentMouseY * 0.25;
        card.group.rotation.x = card.baseRotX - currentMouseY * 0.12;
        card.group.rotation.y = card.baseRotY + currentMouseX * 0.14;
        card.group.rotation.z = card.baseRotZ + floatRot;
      });

      // Subtle ambient particle drift
      particles.rotation.y = elapsedTime * 0.02 + currentMouseX * 0.1;
      particles.rotation.x = Math.sin(elapsedTime * 0.015) * 0.02 - currentMouseY * 0.08;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Handle flash effect trigger
  useEffect(() => {
    if (flashActive && flashLightRef.current) {
      flashLightRef.current.intensity = 18;
      const decay = setInterval(() => {
        if (!flashLightRef.current) return;
        flashLightRef.current.intensity *= 0.65;
        if (flashLightRef.current.intensity < 0.1) {
          flashLightRef.current.intensity = 0;
          clearInterval(decay);
        }
      }, 35);
      return () => clearInterval(decay);
    }
  }, [flashActive]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden select-none z-0"
      aria-hidden="true"
    />
  );
};
