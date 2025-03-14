// Three.js Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg-canvas'),
    antialias: true
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

// Add fog for depth effect
scene.fog = new THREE.FogExp2('#11111f', 0.01);

// Create multiple portals for tunnel effect
const portals = [];
for (let i = 0; i < 5; i++) {
    const portalGeometry = new THREE.TorusGeometry(8 - i * 0.5, 2, 16, 100);
    const portalMaterial = new THREE.MeshBasicMaterial({ 
        color: '#cba6f7',
        wireframe: true,
        transparent: true,
        opacity: 0.8 - i * 0.1
    });
    const portal = new THREE.Mesh(portalGeometry, portalMaterial);
    portal.position.z = -i * 10;
    portal.rotation.x = i * Math.PI / 8;
    portals.push(portal);
    scene.add(portal);
}

// Create energy field with more detail
const energyGeometry = new THREE.IcosahedronGeometry(15, 2);
const energyMaterial = new THREE.MeshPhongMaterial({
    color: '#cba6f7',
    wireframe: true,
    transparent: true,
    opacity: 0.3,
    specular: '#ffffff',
    shininess: 100
});
const energyField = new THREE.Mesh(energyGeometry, energyMaterial);
scene.add(energyField);

// Add ambient and point lights
const ambientLight = new THREE.AmbientLight('#cba6f7', 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight('#ffffff', 1);
pointLight.position.set(0, 0, 30);
scene.add(pointLight);

// Create particles
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 2000;
const posArray = new Float32Array(particlesCount * 3);
const velocityArray = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i += 3) {
    // Position in a sphere
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);
    const radius = 20;
    
    posArray[i] = radius * Math.sin(phi) * Math.cos(theta);
    posArray[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
    posArray[i + 2] = radius * Math.cos(phi);
    
    // Random velocities
    velocityArray[i] = (Math.random() - 0.5) * 0.1;
    velocityArray[i + 1] = (Math.random() - 0.5) * 0.1;
    velocityArray[i + 2] = (Math.random() - 0.5) * 0.1;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.1,
    color: '#cba6f7',
    blending: THREE.AdditiveBlending
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Animation variables
let isTransitioning = false;
let time = 0;
const positions = particlesGeometry.attributes.position.array;
const originalPositions = [...positions];

// Animation
const animate = () => {
    requestAnimationFrame(animate);
    time += 0.01;

    // Rotate all portals
    portals.forEach((portal, i) => {
        portal.rotation.x += 0.01 * (i + 1);
        portal.rotation.y += 0.005 * (i + 1);
        portal.rotation.z += 0.003 * (i + 1);
        
        if (!isTransitioning) {
            portal.scale.x = 1 + Math.sin(time * 2) * 0.1;
            portal.scale.y = 1 + Math.cos(time * 2) * 0.1;
        }
    });
    
    // Energy field rotation with wave effect
    energyField.rotation.x -= 0.005;
    energyField.rotation.y -= 0.01;
    if (!isTransitioning) {
        energyField.scale.x = 1 + Math.sin(time * 3) * 0.1;
        energyField.scale.y = 1 + Math.cos(time * 3) * 0.1;
        energyField.scale.z = 1 + Math.sin(time * 3) * 0.1;
    }

    // Particle animation
    if (!isTransitioning) {
        for(let i = 0; i < positions.length; i += 3) {
            positions[i] = originalPositions[i] + Math.sin(time + i) * 0.3;
            positions[i + 1] = originalPositions[i + 1] + Math.cos(time + i) * 0.3;
            positions[i + 2] = originalPositions[i + 2] + Math.sin(time + i) * 0.3;
        }
    }
    
    // Point light animation
    pointLight.intensity = 1 + Math.sin(time * 5) * 0.3;
    pointLight.position.x = Math.sin(time) * 10;
    pointLight.position.y = Math.cos(time) * 10;
    
    particlesGeometry.attributes.position.needsUpdate = true;
    renderer.render(scene, camera);
};

animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Transition Animation
const startButton = document.getElementById('start-button');
const overlay = document.getElementById('transition-overlay');

startButton.addEventListener('click', () => {
    if (isTransitioning) return;
    isTransitioning = true;

    // Button explosion effect
    gsap.to(startButton, {
        scale: 1.2,
        opacity: 0,
        duration: 0.4,
        ease: 'power4.out'
    });

    // Intense camera shake
    const shakeIntensity = 0.2;
    const shakeTimeline = gsap.timeline();
    for (let i = 0; i < 20; i++) {
        shakeTimeline.to(camera.position, {
            x: (Math.random() - 0.5) * shakeIntensity,
            y: (Math.random() - 0.5) * shakeIntensity,
            duration: 0.05,
            ease: 'none'
        });
    }

    // Portal tunnel effect
    portals.forEach((portal, i) => {
        gsap.to(portal.scale, {
            x: 3,
            y: 3,
            z: 3,
            duration: 2,
            delay: i * 0.2,
            ease: 'power2.inOut'
        });

        gsap.to(portal.rotation, {
            x: Math.PI * 8,
            y: Math.PI * 8,
            z: Math.PI * 4,
            duration: 3,
            delay: i * 0.2,
            ease: 'power2.inOut'
        });
    });

    // Energy field explosion
    gsap.to(energyField.scale, {
        x: 2,
        y: 2,
        z: 2,
        duration: 1,
        ease: 'power4.out',
        onComplete: () => {
            gsap.to(energyField.scale, {
                x: 0.1,
                y: 0.1,
                z: 0.1,
                duration: 2,
                ease: 'power4.in'
            });
        }
    });

    // Light intensity surge
    gsap.to(pointLight, {
        intensity: 3,
        duration: 1,
        yoyo: true,
        repeat: 2,
        ease: 'power2.inOut'
    });

    // Particle vortex effect
    gsap.to(camera.position, {
        z: -50,
        duration: 3,
        ease: 'power3.in',
        onUpdate: () => {
            const progress = (camera.position.z + 30) / -80;
            for(let i = 0; i < positions.length; i += 3) {
                const angle = time * 5 + i;
                const radius = 30 * (1 - progress);
                const speed = 1 + progress * 5;
                positions[i] = Math.cos(angle * speed) * radius;
                positions[i + 1] = Math.sin(angle * speed) * radius;
                positions[i + 2] = originalPositions[i + 2] * (1 - progress) - progress * 50;
            }
        }
    });

    // Final transition with flash
    gsap.to(overlay, {
        opacity: 0.8,
        duration: 0.1,
        delay: 2.3
    }).then(() => {
        gsap.to(overlay, {
            opacity: 0.2,
            duration: 0.1
        }).then(() => {
            gsap.to(overlay, {
                opacity: 1,
                duration: 0.5,
                onComplete: () => {
                    window.location.href = 'portfolio.html';
                }
            });
        });
    });
});
