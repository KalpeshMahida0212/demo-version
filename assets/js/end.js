let container,
    camera,
    scene,
    renderer,
    uniforms,
    texture,
    Khushi,
    loader = new THREE.TextureLoader();
function init() {
    (container = document.getElementById("container")), ((camera = new THREE.Camera()).position.z = 1), (scene = new THREE.Scene());
    var e = new THREE.PlaneBufferGeometry(2, 2);
    uniforms = {
        u_time: { type: "f", value: 1 },
        u_resolution: { type: "v2", value: new THREE.Vector2() },
        u_pxaspect: { type: "f", value: window.devicePixelRatio },
        u_noise: { type: "t", value: texture },
        u_text500: { type: "t", value: Khushi },
        u_mouse: { type: "v2", value: new THREE.Vector2(-0.1, -0.1) },
    };
    var n = new THREE.ShaderMaterial({ uniforms: uniforms, vertexShader: document.getElementById("vertexShader").textContent, fragmentShader: document.getElementById("fragmentShader").textContent });
    n.extensions.derivatives = !0;
    var t = new THREE.Mesh(e, n);
    scene.add(t),
        (renderer = new THREE.WebGLRenderer()).setPixelRatio(window.devicePixelRatio),
        container.appendChild(renderer.domElement),
        onWindowResize(),
        window.addEventListener("resize", onWindowResize, !1),
        document.addEventListener("pointermove", (e) => {
            let n = window.innerHeight / window.innerWidth;
            (uniforms.u_mouse.value.x = (e.pageX - window.innerWidth / 2) / window.innerWidth / n), (uniforms.u_mouse.value.y = ((e.pageY - window.innerHeight / 2) / window.innerHeight) * -1), e.preventDefault();
        });
}
function onWindowResize(e) {
    renderer.setSize(window.innerWidth, window.innerHeight), (uniforms.u_resolution.value.x = renderer.domElement.width), (uniforms.u_resolution.value.y = renderer.domElement.height);
}
function animate(e) {
    requestAnimationFrame(animate), render(e);
}
loader.setCrossOrigin("anonymous"),
    loader.load("https://i.ibb.co/3726Yc4/TBc9pm.png", (e) => {
        ((texture = e).wrapS = THREE.RepeatWrapping),
            (texture.wrapT = THREE.RepeatWrapping),
            (texture.minFilter = THREE.LinearFilter),
            loader.load("assets/img/fix.jpeg", (e) => {
                (Khushi = e), init(), animate();
            });
    });
let capturer = new CCapture({ verbose: !0, framerate: 60, quality: 90, format: "webm", workersPath: "js/" }),
    capturing = !1;
(isCapturing = function (e) {
    !1 === e && !0 === window.capturing ? (capturer.stop(), capturer.save()) : !0 === e && !1 === window.capturing && capturer.start(), (capturing = e);
}),
    (toggleCapture = function () {
        isCapturing(!capturing);
    }),
    window.addEventListener("keyup", function (e) {
        68 == e.keyCode && toggleCapture();
    });
let then = 0;
function render(e) {
    (uniforms.u_time.value = 5e-4 * e), renderer.render(scene, camera), capturing && capturer.capture(renderer.domElement);
}