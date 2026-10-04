import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Interactive3DBackgroundProps {
  flashActive?: boolean;
}

export const Interactive3DBackground: React.FC<Interactive3DBackgroundProps> = ({
  flashActive = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const flashLightRef = useRef<THREE.PointLight | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
  const triggerImpulseRef = useRef<((x: number, y: number) => void) | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Three.js Scene, Camera & High-Performance WebGL Renderer
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 16);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    container.appendChild(renderer.domElement);

    // 2. High-Key Studio Lighting Rig for Pure White Background
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.1);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    // Dynamic mouse spotlight in 3D space
    const mouseLight = new THREE.PointLight(0xfffbeb, 3.2, 28);
    mouseLight.position.set(0, 0, 7);
    scene.add(mouseLight);

    // Speedlite camera flash burst light
    const flashLight = new THREE.PointLight(0xffffff, 0, 75);
    flashLight.position.set(0, 0, 12);
    scene.add(flashLight);
    flashLightRef.current = flashLight;

    // Studio directional highlights (overhead key light & soft side fill)
    const topKey = new THREE.DirectionalLight(0xffffff, 1.3);
    topKey.position.set(2, 18, 10);
    scene.add(topKey);

    const leftFill = new THREE.DirectionalLight(0xf8fafc, 0.8);
    leftFill.position.set(-16, 4, 6);
    scene.add(leftFill);

    const rightFill = new THREE.DirectionalLight(0xf8fafc, 0.8);
    rightFill.position.set(16, -4, 6);
    scene.add(rightFill);

    // 3. Procedural Soft Shadow Texture for Realistic Depth on Pure White
    const createShadowTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext('2d')!;
      const gradient = ctx.createRadialGradient(64, 64, 10, 64, 64, 64);
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0.36)');
      gradient.addColorStop(0.4, 'rgba(0, 0, 0, 0.16)');
      gradient.addColorStop(0.75, 'rgba(0, 0, 0, 0.04)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 128, 128);
      const texture = new THREE.CanvasTexture(canvas);
      texture.generateMipmaps = false;
      return texture;
    };

    const shadowTexture = createShadowTexture();

    // 4. Load Authentic Wedding Photobooth Textures
    const textureLoader = new THREE.TextureLoader();
    const photoUrls = [
      '/images/wedding_bouquet_laugh.jpg',
      '/images/wedding_polaroid_guests.jpg',
      '/images/wedding_postcard_candid.jpg',
      '/images/wedding_sparklers_toast.jpg',
      '/images/wedding_strip_couple.jpg',
    ];

    const textures = photoUrls.map((url) => {
      const tex = textureLoader.load(url);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.generateMipmaps = true;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      return tex;
    });

    // 5. Responsive Coordinate Layouts: Desktop vs Mobile
    const isMobileCheck = () => window.innerWidth < 768 || (window.innerWidth / window.innerHeight) < 1.1;

    const desktopConfigs = [
      // 1. Top-Right Guest Booth Polaroid (Above right of auth card)
      { texIdx: 1, type: 'polaroid', w: 2.3, h: 2.3, x: 11.2, y: 5.6, z: -3.5, rotX: 0.12, rotY: -0.22, rotZ: 0.12, floatSpeed: 0.6, floatAmp: 0.24 },
      // 2. Far-Right Candid Reception Postcard (Beside right of auth card)
      { texIdx: 2, type: 'postcard', w: 3.0, h: 2.1, x: 14.5, y: 0.8, z: -4.0, rotX: -0.08, rotY: -0.26, rotZ: -0.14, floatSpeed: 0.52, floatAmp: 0.26 },
      // 3. Bottom-Right Sparklers Polaroid (Below right of auth card)
      { texIdx: 3, type: 'polaroid', w: 2.2, h: 2.2, x: 11.6, y: -5.4, z: -3.2, rotX: 0.15, rotY: -0.18, rotZ: -0.1, floatSpeed: 0.72, floatAmp: 0.22 },
      // 4. Deep Layer Behind Auth Card
      { texIdx: 0, type: 'postcard', w: 3.1, h: 2.2, x: 8.5, y: -2.0, z: -7.5, rotX: -0.1, rotY: -0.15, rotZ: 0.08, floatSpeed: 0.45, floatAmp: 0.18 },
      // 5. Far Top-Left Outer Gutter Polaroid
      { texIdx: 0, type: 'polaroid', w: 2.1, h: 2.1, x: -17.2, y: 5.8, z: -4.5, rotX: 0.1, rotY: 0.28, rotZ: -0.16, floatSpeed: 0.65, floatAmp: 0.25 },
      // 6. Far-Left Outer Gutter Vertical 3-Shot Strip
      { texIdx: 4, type: 'strip', w: 1.6, h: 4.2, x: -16.8, y: -0.2, z: -4.5, rotX: -0.06, rotY: 0.3, rotZ: 0.08, floatSpeed: 0.55, floatAmp: 0.28 },
      // 7. Far Bottom-Left Outer Gutter Postcard
      { texIdx: 3, type: 'postcard', w: 2.7, h: 1.9, x: -16.5, y: -6.2, z: -4.8, rotX: -0.12, rotY: 0.22, rotZ: 0.14, floatSpeed: 0.7, floatAmp: 0.22 },
    ];

    const mobileConfigs = [
      // 1. Top-Right Polaroid (Peeking above right of mobile card)
      { texIdx: 1, type: 'polaroid', w: 1.9, h: 1.9, x: 2.6, y: 5.4, z: -3.2, rotX: 0.12, rotY: -0.15, rotZ: 0.14, floatSpeed: 0.6, floatAmp: 0.2 },
      // 2. Far-Right Postcard (Peeking behind right edge of mobile card)
      { texIdx: 2, type: 'postcard', w: 2.3, h: 1.6, x: 3.2, y: 0.2, z: -4.8, rotX: -0.08, rotY: -0.2, rotZ: -0.12, floatSpeed: 0.52, floatAmp: 0.22 },
      // 3. Bottom-Right Polaroid (Peeking below right of mobile card)
      { texIdx: 3, type: 'polaroid', w: 1.8, h: 1.8, x: 2.5, y: -5.4, z: -3.0, rotX: 0.14, rotY: -0.14, rotZ: -0.1, floatSpeed: 0.72, floatAmp: 0.18 },
      // 4. Deep Center-Top Postcard (Floating in top sky)
      { texIdx: 0, type: 'postcard', w: 2.4, h: 1.7, x: -0.2, y: 6.2, z: -7.0, rotX: 0.2, rotY: 0.05, rotZ: -0.04, floatSpeed: 0.45, floatAmp: 0.16 },
      // 5. Top-Left Polaroid (Peeking above left of mobile card)
      { texIdx: 0, type: 'polaroid', w: 1.8, h: 1.8, x: -2.6, y: 5.5, z: -3.5, rotX: 0.1, rotY: 0.18, rotZ: -0.15, floatSpeed: 0.65, floatAmp: 0.2 },
      // 6. Left Edge Strip (Peeking behind left edge of mobile card)
      { texIdx: 4, type: 'strip', w: 1.3, h: 3.4, x: -3.2, y: -0.4, z: -4.5, rotX: -0.05, rotY: 0.22, rotZ: 0.1, floatSpeed: 0.55, floatAmp: 0.24 },
      // 7. Bottom-Left Postcard (Peeking below left of mobile card)
      { texIdx: 3, type: 'postcard', w: 2.2, h: 1.5, x: -2.5, y: -5.5, z: -3.2, rotX: -0.1, rotY: 0.16, rotZ: 0.12, floatSpeed: 0.7, floatAmp: 0.18 },
    ];

    interface PhotoCardData {
      group: THREE.Group;
      baseX: number;
      baseY: number;
      baseZ: number;
      baseRotX: number;
      baseRotY: number;
      baseRotZ: number;
      floatSpeed: number;
      floatOffset: number;
      floatAmp: number;
      targetZ: number;
      shadowMesh: THREE.Mesh;
      wobble: number;
      wobbleVelocity: number;
    }

    const cards: PhotoCardData[] = [];
    const initialConfigs = isMobileCheck() ? mobileConfigs : desktopConfigs;

    // Shared White Studio Cardstock Material
    const paperMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.85,
      metalness: 0.0,
    });

    initialConfigs.forEach((cfg, idx) => {
      const cardGroup = new THREE.Group();

      let paperW = cfg.w + 0.28;
      let paperH = cfg.h + 0.28;
      let photoOffsetY = 0;

      if (cfg.type === 'polaroid') {
        paperH = cfg.h + 0.85;
        photoOffsetY = 0.3;
      }

      // 1. Soft Realistic Drop Shadow Plane
      const shadowGeo = new THREE.PlaneGeometry(paperW * 1.45, paperH * 1.45);
      const shadowMat = new THREE.MeshBasicMaterial({
        map: shadowTexture,
        transparent: true,
        opacity: 0.28,
        depthWrite: false,
      });
      const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
      shadowMesh.position.set(0.1, -0.15, -0.06);
      cardGroup.add(shadowMesh);

      // 2. Studio Paper Backing & Borders
      const paperGeo = new THREE.BoxGeometry(paperW, paperH, 0.035);
      const paperMesh = new THREE.Mesh(paperGeo, paperMaterial);
      cardGroup.add(paperMesh);

      // 3. Photo Print Surface
      const photoGeo = new THREE.PlaneGeometry(cfg.w, cfg.h);
      const photoMat = new THREE.MeshStandardMaterial({
        map: textures[cfg.texIdx],
        roughness: 0.24,
        metalness: 0.04,
        side: THREE.FrontSide,
      });
      const photoMesh = new THREE.Mesh(photoGeo, photoMat);
      photoMesh.position.set(0, photoOffsetY, 0.02);
      cardGroup.add(photoMesh);

      // 4. Subtle Washi Tape Accent on Top Edge
      if (idx % 2 === 0) {
        const tapeGeo = new THREE.PlaneGeometry(paperW * 0.4, 0.26);
        const tapeMat = new THREE.MeshStandardMaterial({
          color: 0xfef08a,
          roughness: 0.6,
          transparent: true,
          opacity: 0.78,
          side: THREE.FrontSide,
        });
        const tapeMesh = new THREE.Mesh(tapeGeo, tapeMat);
        tapeMesh.position.set(0, paperH / 2 - 0.08, 0.025);
        tapeMesh.rotation.z = (Math.random() - 0.5) * 0.08;
        cardGroup.add(tapeMesh);
      }

      // Initial Placement
      cardGroup.position.set(cfg.x, cfg.y, cfg.z);
      cardGroup.rotation.set(cfg.rotX, cfg.rotY, cfg.rotZ);
      scene.add(cardGroup);

      cards.push({
        group: cardGroup,
        baseX: cfg.x,
        baseY: cfg.y,
        baseZ: cfg.z,
        baseRotX: cfg.rotX,
        baseRotY: cfg.rotY,
        baseRotZ: cfg.rotZ,
        floatSpeed: cfg.floatSpeed,
        floatOffset: idx * 1.4,
        floatAmp: cfg.floatAmp,
        targetZ: cfg.z,
        shadowMesh,
        wobble: 0,
        wobbleVelocity: 0,
      });
    });

    // 6. Interactive Mouse Movement Tracking
    const mouse = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    // 7. Interactive Click Flutter Impulse
    const triggerImpulse = (clientX: number, clientY: number) => {
      const clickWorldX = ((clientX / window.innerWidth) * 2 - 1) * 14;
      const clickWorldY = (-((clientY / window.innerHeight) * 2 - 1)) * 8.5;

      cards.forEach((card) => {
        const dx = card.group.position.x - clickWorldX;
        const dy = card.group.position.y - clickWorldY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 9.0) {
          const impulse = (1 - dist / 9.0) * 0.35;
          card.wobbleVelocity += impulse;
        }
      });
    };

    triggerImpulseRef.current = triggerImpulse;

    const handleWindowClick = (e: MouseEvent) => {
      triggerImpulse(e.clientX, e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('click', handleWindowClick);

    // Window Resize Handler with Layout Adaptation
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      const activeConfigs = isMobileCheck() ? mobileConfigs : desktopConfigs;
      cards.forEach((card, i) => {
        const c = activeConfigs[i];
        card.baseX = c.x;
        card.baseY = c.y;
        card.baseZ = c.z;
        card.baseRotX = c.rotX;
        card.baseRotY = c.rotY;
        card.baseRotZ = c.rotZ;
        card.floatSpeed = c.floatSpeed;
        card.floatAmp = c.floatAmp;
      });
    };

    window.addEventListener('resize', handleResize);

    // 8. Main 60 FPS 3D Animation & Physics Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.045;
      mouse.y += (mouse.targetY - mouse.y) * 0.045;

      // 3D Parallax Camera Motion
      camera.position.x = mouse.x * 1.5;
      camera.position.y = mouse.y * 1.0;
      camera.lookAt(0, 0, 0);

      // Studio spotlight glides in 3D with mouse
      mouseLight.position.x = mouse.x * 14;
      mouseLight.position.y = mouse.y * 8.5;

      // Animate and update each 3D photo card
      cards.forEach((card) => {
        const t = elapsedTime * card.floatSpeed + card.floatOffset;

        // Harmonic Floating Motion (Sinusoidal Bobbing)
        const floatY = Math.sin(t) * card.floatAmp;
        const floatX = Math.cos(t * 0.7) * (card.floatAmp * 0.4);

        // Distance from cursor in 3D world space
        const dx = card.group.position.x - (mouse.x * 14);
        const dy = card.group.position.y - (mouse.y * 8.5);
        const distToMouse = Math.sqrt(dx * dx + dy * dy);

        // Proximity hover lift: card lifts slightly forward towards camera when cursor is near!
        let targetZ = card.baseZ;
        let tiltFactorX = 0;
        let tiltFactorY = 0;

        if (distToMouse < 6.5) {
          const proximity = (1 - distToMouse / 6.5);
          targetZ = card.baseZ + proximity * 1.1; // lift up
          tiltFactorX = -(dy / 6.5) * 0.2;
          tiltFactorY = (dx / 6.5) * 0.22;

          card.shadowMesh.scale.setScalar(1.0 + proximity * 0.2);
          (card.shadowMesh.material as THREE.MeshBasicMaterial).opacity = 0.28 + proximity * 0.12;
        } else {
          card.shadowMesh.scale.setScalar(1.0);
          (card.shadowMesh.material as THREE.MeshBasicMaterial).opacity = 0.28;
        }

        // Wobble physics (spring decay)
        card.wobbleVelocity += -card.wobble * 0.18;
        card.wobbleVelocity *= 0.88;
        card.wobble += card.wobbleVelocity;

        // Position interpolation
        card.group.position.x += (card.baseX + floatX - card.group.position.x) * 0.06;
        card.group.position.y += (card.baseY + floatY - card.group.position.y) * 0.06;
        card.group.position.z += (targetZ - card.group.position.z) * 0.06;

        // Angular rotation with mouse tilt + natural sway + click wobble
        const rotSwayZ = Math.sin(t * 0.5) * 0.02;
        const rotSwayX = Math.cos(t * 0.4) * 0.015;

        card.group.rotation.x +=
          (card.baseRotX + rotSwayX + tiltFactorX + card.wobble * 0.5 - card.group.rotation.x) * 0.08;
        card.group.rotation.y +=
          (card.baseRotY + tiltFactorY + card.wobble * 0.3 - card.group.rotation.y) * 0.08;
        card.group.rotation.z +=
          (card.baseRotZ + rotSwayZ + card.wobble - card.group.rotation.z) * 0.08;
      });

      renderer.render(scene, camera);
    };

    animate();

    // 9. Cleanup on Unmount
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleWindowClick);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      paperMaterial.dispose();
      shadowTexture.dispose();
      textures.forEach((t) => t.dispose());
    };
  }, []);

  // Speedlite Flash Strobe Burst Reaction
  useEffect(() => {
    if (flashActive && flashLightRef.current && ambientLightRef.current) {
      flashLightRef.current.intensity = 24;
      ambientLightRef.current.intensity = 4.2;

      // Trigger instantaneous flutter impulse from center
      if (triggerImpulseRef.current) {
        triggerImpulseRef.current(window.innerWidth / 2, window.innerHeight / 2);
      }

      const timer = setTimeout(() => {
        if (flashLightRef.current && ambientLightRef.current) {
          flashLightRef.current.intensity = 0;
          ambientLightRef.current.intensity = 2.1;
        }
      }, 160);

      return () => clearTimeout(timer);
    }
  }, [flashActive]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{ touchAction: 'none' }}
    />
  );
};

export default Interactive3DBackground;
