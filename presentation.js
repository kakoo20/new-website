document.addEventListener('DOMContentLoaded', () => {
    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.05); // Neon fog

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    // Grid Helper (optional, for visual reference or "ground")
    const gridHelper = new THREE.GridHelper(100, 50, 0x00A8CC, 0x111111);
    scene.add(gridHelper);

    // Components Group
    const circuitBoard = new THREE.Group();
    scene.add(circuitBoard);

    // Materials
    const chipMaterial = new THREE.MeshPhongMaterial({ color: 0x111111, specular: 0x333333, shininess: 100 });
    const pinMaterial = new THREE.MeshBasicMaterial({ color: 0xC0C0C0 });
    const neonMaterial = new THREE.MeshBasicMaterial({ color: 0x00A8CC });
    const capacitorBodyMat = new THREE.MeshPhongMaterial({ color: 0x222222 });
    const capacitorTopMat = new THREE.MeshBasicMaterial({ color: 0x888888 });

    // Procedural Generation of "Components"
    function createChip(x, z) {
        const geometry = new THREE.BoxGeometry(1, 0.2, 1);
        const chip = new THREE.Mesh(geometry, chipMaterial);
        chip.position.set(x, 0.1, z);

        // Add neon lines on top
        const lineGeo = new THREE.BoxGeometry(0.6, 0.22, 0.05);
        const line = new THREE.Mesh(lineGeo, neonMaterial);
        line.position.set(x, 0.1, z);
        circuitBoard.add(line);

        circuitBoard.add(chip);
    }

    function createCapacitor(x, z) {
        const geometry = new THREE.CylinderGeometry(0.3, 0.3, 1, 32);
        const cap = new THREE.Mesh(geometry, capacitorBodyMat);
        cap.position.set(x, 0.5, z);
        circuitBoard.add(cap);

        const topGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.05, 32);
        const top = new THREE.Mesh(topGeo, capacitorTopMat);
        top.position.set(x, 1, z);
        circuitBoard.add(top);
    }

    function createResistor(x, z) {
        const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.8);
        const resistor = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: 0x8B4513 })); // Brownish
        resistor.position.set(x, 0.1, z);
        circuitBoard.add(resistor);
    }

    // Populate the board
    for (let i = 0; i < 50; i++) {
        const x = (Math.random() - 0.5) * 40;
        const z = (Math.random() - 0.5) * 100 - 20; // Spread along Z axis
        const type = Math.random();

        if (type < 0.3) {
            createChip(x, z);
        } else if (type < 0.6) {
            createCapacitor(x, z);
        } else {
            createResistor(x, z);
        }
    }

    // Traces (Neon lines on the floor)
    for (let i = 0; i < 30; i++) {
        const pathGeo = new THREE.BoxGeometry(0.05, 0.02, Math.random() * 10 + 2);
        const path = new THREE.Mesh(pathGeo, neonMaterial);
        path.position.set((Math.random() - 0.5) * 40, 0.01, (Math.random() - 0.5) * 100 - 20);
        path.rotation.y = Math.random() > 0.5 ? 0 : Math.PI / 2;
        circuitBoard.add(path);
    }

    // Lights
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x00A8CC, 2, 50);
    pointLight.position.set(0, 10, 0);
    scene.add(pointLight);

    const blueLight = new THREE.PointLight(0x0000FF, 1, 50);
    blueLight.position.set(-10, 5, -20);
    scene.add(blueLight);

    // Initial Camera Position
    camera.position.set(0, 5, 10);
    camera.lookAt(0, 0, -20);

    // Scroll Animation Logic
    let scrollPercent = 0;

    function onScroll() {
        // Calculate scroll percentage
        const scrollTop = window.scrollY;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        scrollPercent = scrollTop / docHeight;

        // Content reveal and fade out logic
        document.querySelectorAll('.presentation-section').forEach(section => {
            const box = section.querySelector('.content-box');
            if (!box) return;

            const rect = section.getBoundingClientRect();

            // Reveal logic
            if (rect.top < window.innerHeight * 0.75) {
                section.classList.add('is-visible');
            }
        });
    }

    window.addEventListener('scroll', onScroll);
    onScroll(); // Trigger once on load

    // Animation Loop
    function animate() {
        requestAnimationFrame(animate);

        // Move camera based on scroll
        // Fly through the circuit board along negative Z
        const targetZ = 10 - (scrollPercent * 60); // Move from z=10 to z=-50
        const targetY = 5 - (scrollPercent * 3);   // Lower slightly

        // Smooth interpolation
        camera.position.z += (targetZ - camera.position.z) * 0.05;
        camera.position.y += (targetY - camera.position.y) * 0.05;

        // Add subtle rotation based on scroll to "look around"
        camera.rotation.z = scrollPercent * 0.2;
        camera.rotation.y = Math.sin(Date.now() * 0.0005) * 0.1; // Idle gentle sway

        // Rotate capacitors for fun
        circuitBoard.children.forEach(child => {
            if (child.geometry && child.geometry.type === 'CylinderGeometry') {
                // child.rotation.y += 0.01; 
            }
        });

        renderer.render(scene, camera);
    }

    animate();

    // Resize handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
});
