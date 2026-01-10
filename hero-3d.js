document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('hero-3d');
    if (!container) return;

    // Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    container.appendChild(renderer.domElement);

    // Create Radar Sphere (Wireframe)
    const geometry = new THREE.SphereGeometry(2, 24, 24);
    const material = new THREE.MeshBasicMaterial({
        color: 0x00A8CC, // Matches your neon-cyan
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Add a "Pulse" Ring
    const ringGeo = new THREE.TorusGeometry(2, 0.02, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00A8CC, transparent: true });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    scene.add(ring);

    camera.position.z = 5;

    // Animation Loop
    function animate() {
        requestAnimationFrame(animate);
        
        sphere.rotation.y += 0.005;
        sphere.rotation.x += 0.002;

        // Pulse effect for the ring
        ring.scale.x += 0.02;
        ring.scale.y += 0.02;
        ring.material.opacity -= 0.01;

        if (ring.scale.x > 2.5) {
            ring.scale.set(1, 1, 1);
            ring.material.opacity = 1;
        }

        renderer.render(scene, camera);
    }

    animate();

    // Handle Resize
    window.addEventListener('resize', () => {
        camera.aspect = container.offsetWidth / container.offsetHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.offsetWidth, container.offsetHeight);
    });
});