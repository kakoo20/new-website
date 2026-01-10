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
    const geometry = new THREE.SphereGeometry(2.2, 24, 24);
    const material = new THREE.MeshBasicMaterial({
        color: 0x00A8CC,
        wireframe: true,
        transparent: true,
        opacity: 0.2
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Add a central core
    const coreGeo = new THREE.SphereGeometry(0.5, 16, 16);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0x00A8CC });
    const core = new THREE.Mesh(coreGeo, coreMat);
    scene.add(core);

    // Add a pulsing ring
    const ringGeo = new THREE.TorusGeometry(2, 0.02, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00A8CC, transparent: true, opacity: 0.8 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2; 
    // Rotate ring to face slightly towards camera
    ring.rotation.x = 1.8;
    ring.rotation.y = 0.5;
    scene.add(ring);

    camera.position.z = 5;

    // Animation Loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Rotate sphere
        sphere.rotation.y += 0.003;
        sphere.rotation.x += 0.001;

        // Pulse effect
        ring.scale.x += 0.01;
        ring.scale.y += 0.01;
        ring.material.opacity -= 0.005;

        if (ring.scale.x > 2) {
            ring.scale.set(1, 1, 1);
            ring.material.opacity = 0.8;
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