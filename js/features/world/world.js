// ============================================================
// KYHABER - 3D WORLD
// ============================================================

import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";


// ============================================================
// DOM
// ============================================================

const container =
    document.querySelector("#heroWorld");

const canvas =
    document.querySelector("#worldCanvas");


if (!container || !canvas) {

    console.warn(
        "KYHaber 3D dünya alanı bulunamadı."
    );

} else {

    baslatDunya();

}


// ============================================================
// DÜNYAYI BAŞLAT
// ============================================================

function baslatDunya() {

    // --------------------------------------------------------
    // SCENE
    // --------------------------------------------------------

    const scene =
        new THREE.Scene();


    // --------------------------------------------------------
    // CAMERA
    // --------------------------------------------------------

    const camera =
        new THREE.PerspectiveCamera(
            35,
            1,
            0.1,
            100
        );


    camera.position.z =
        5.2;


    // --------------------------------------------------------
    // RENDERER
    // --------------------------------------------------------

    let renderer;


    try {

        renderer =
            new THREE.WebGLRenderer({

                canvas,

                alpha:
                    true,

                antialias:
                    true,

                powerPreference:
                    "high-performance"

            });

    } catch (error) {

        console.error(
            "KYHaber 3D dünya başlatılamadı:",
            error
        );

        return;
    }


    renderer.setPixelRatio(
        Math.min(
            window.devicePixelRatio || 1,
            2
        )
    );


    renderer.setClearColor(
        0x000000,
        0
    );


    renderer.outputColorSpace =
        THREE.SRGBColorSpace;


    // --------------------------------------------------------
    // LIGHTING
    // --------------------------------------------------------

    const ambientLight =
        new THREE.AmbientLight(
            0x5577aa,
            0.28
        );

    scene.add(
        ambientLight
    );


    const sunLight =
        new THREE.DirectionalLight(
            0xffffff,
            2.4
        );


    sunLight.position.set(
        -4,
        2,
        5
    );


    scene.add(
        sunLight
    );


    const rimLight =
        new THREE.PointLight(
            0xef4444,
            1.2,
            10
        );


    rimLight.position.set(
        4,
        -1,
        -2
    );


    scene.add(
        rimLight
    );


    // ========================================================
    // EARTH GROUP
    // ========================================================

    const earthGroup =
        new THREE.Group();


    earthGroup.rotation.z =
        THREE.MathUtils.degToRad(
            -8
        );


    scene.add(
        earthGroup
    );


    // ========================================================
    // TEXTURES
    // ========================================================

    const textureLoader =
        new THREE.TextureLoader();


    const earthTexture =
        textureLoader.load(

            "https://cdn.jsdelivr.net/gh/mrdoob/three.js@r180/examples/textures/planets/earth_atmos_2048.jpg",

            undefined,

            undefined,

            error => {

                console.warn(
                    "Dünya texture'ı yüklenemedi:",
                    error
                );

            }

        );


    earthTexture.colorSpace =
        THREE.SRGBColorSpace;


    const nightTexture =
        textureLoader.load(

            "https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-night.jpg",

            undefined,

            undefined,

            error => {

                console.warn(
                    "Gece texture'ı yüklenemedi:",
                    error
                );

            }

        );


    nightTexture.colorSpace =
        THREE.SRGBColorSpace;


    // ========================================================
    // EARTH
    // ========================================================

    const earthGeometry =
        new THREE.SphereGeometry(
            1.48,
            96,
            96
        );


    const earthMaterial =
        new THREE.MeshPhongMaterial({

            map:
                earthTexture,

            shininess:
                18,

            specular:
                new THREE.Color(
                    0x557799
                ),

            bumpScale:
                0.025

        });


    const earth =
        new THREE.Mesh(
            earthGeometry,
            earthMaterial
        );


    earth.rotation.y =
        THREE.MathUtils.degToRad(
            -25
        );


    earthGroup.add(
        earth
    );


    // ========================================================
    // NIGHT SIDE
    // ========================================================

    const nightGeometry =
        new THREE.SphereGeometry(
            1.492,
            96,
            96
        );


    const nightMaterial =
        new THREE.MeshBasicMaterial({

            map:
                nightTexture,

            transparent:
                true,

            opacity:
                0.22,

            blending:
                THREE.AdditiveBlending,

            depthWrite:
                false

        });


    const nightEarth =
        new THREE.Mesh(
            nightGeometry,
            nightMaterial
        );


    nightEarth.rotation.y =
        earth.rotation.y;


    earthGroup.add(
        nightEarth
    );


    // ========================================================
    // ATMOSPHERE
    // ========================================================

    const atmosphereGeometry =
        new THREE.SphereGeometry(
            1.56,
            96,
            96
        );


    const atmosphereMaterial =
        new THREE.ShaderMaterial({

            transparent:
                true,

            side:
                THREE.BackSide,

            blending:
                THREE.AdditiveBlending,

            depthWrite:
                false,

            uniforms: {

                glowColor: {

                    value:
                        new THREE.Color(
                            0x5da9ff
                        )

                },

                intensity: {

                    value:
                        0.65

                }

            },

            vertexShader: `

                varying vec3 vNormal;

                void main() {

                    vNormal =
                        normalize(
                            normalMatrix *
                            normal
                        );

                    gl_Position =
                        projectionMatrix *
                        modelViewMatrix *
                        vec4(
                            position,
                            1.0
                        );

                }

            `,

            fragmentShader: `

                uniform vec3 glowColor;
                uniform float intensity;

                varying vec3 vNormal;

                void main() {

                    float viewAngle =
                        max(
                            dot(
                                vNormal,
                                vec3(
                                    0.0,
                                    0.0,
                                    1.0
                                )
                            ),
                            0.0
                        );

                    float glow =
                        pow(
                            1.0 -
                            viewAngle,
                            3.0
                        );

                    gl_FragColor =
                        vec4(
                            glowColor,
                            glow * intensity
                        );

                }

            `

        });


    const atmosphere =
        new THREE.Mesh(
            atmosphereGeometry,
            atmosphereMaterial
        );


    earthGroup.add(
        atmosphere
    );


    // ========================================================
    // STARS
    // ========================================================

    const starGeometry =
        new THREE.BufferGeometry();


    const starCount =
        window.innerWidth <= 600
            ? 650
            : 1200;


    const starPositions =
        new Float32Array(
            starCount * 3
        );


    for (
        let i = 0;
        i < starCount;
        i++
    ) {

        const radius =
            7 +
            Math.random() * 13;


        const theta =
            Math.random() *
            Math.PI *
            2;


        const phi =
            Math.acos(
                2 * Math.random() - 1
            );


        const x =
            radius *
            Math.sin(phi) *
            Math.cos(theta);


        const y =
            radius *
            Math.sin(phi) *
            Math.sin(theta);


        const z =
            radius *
            Math.cos(phi);


        const index =
            i * 3;


        starPositions[index] =
            x;

        starPositions[index + 1] =
            y;

        starPositions[index + 2] =
            z;

    }


    starGeometry.setAttribute(

        "position",

        new THREE.BufferAttribute(
            starPositions,
            3
        )

    );


    const starMaterial =
        new THREE.PointsMaterial({

            color:
                0xffffff,

            size:
                0.025,

            transparent:
                true,

            opacity:
                0.75,

            sizeAttenuation:
                true

        });


    const stars =
        new THREE.Points(
            starGeometry,
            starMaterial
        );


    scene.add(
        stars
    );


    // ========================================================
    // DUST
    // ========================================================

    const dustGeometry =
        new THREE.BufferGeometry();


    const dustCount =
        window.innerWidth <= 600
            ? 100
            : 180;


    const dustPositions =
        new Float32Array(
            dustCount * 3
        );


    for (
        let i = 0;
        i < dustCount;
        i++
    ) {

        const index =
            i * 3;


        dustPositions[index] =
            (Math.random() - 0.5) *
            12;


        dustPositions[index + 1] =
            (Math.random() - 0.5) *
            8;


        dustPositions[index + 2] =
            -2 -
            Math.random() *
            8;

    }


    dustGeometry.setAttribute(

        "position",

        new THREE.BufferAttribute(
            dustPositions,
            3
        )

    );


    const dustMaterial =
        new THREE.PointsMaterial({

            color:
                0xffdddd,

            size:
                0.04,

            transparent:
                true,

            opacity:
                0.4

        });


    const dust =
        new THREE.Points(
            dustGeometry,
            dustMaterial
        );


    scene.add(
        dust
    );


    // ========================================================
    // DRAG SYSTEM
    // ========================================================

    let kullaniciSurukluyor =
        false;


    let sonX =
        0;


    let sonY =
        0;


    /*
       Hız artık "frame başına" değil,
       saniyedeki radyan mantığıyla çalışıyor.
       Böylece 60 FPS / 144 FPS farkı oluşmuyor.
    */

    let hizX =
        0;


    let hizY =
        0;


    const suruklemeHassasiyeti =
        0.008;


    const momentumKatsayisi =
        0.30;


    // --------------------------------------------------------
    // POINTER DOWN
    // --------------------------------------------------------

    canvas.addEventListener(
        "pointerdown",
        event => {

            kullaniciSurukluyor =
                true;


            sonX =
                event.clientX;


            sonY =
                event.clientY;


            hizX =
                0;


            hizY =
                0;


            try {

                canvas.setPointerCapture(
                    event.pointerId
                );

            } catch (error) {

                // Pointer capture bazı eski
                // tarayıcılarda desteklenmeyebilir.

            }


            canvas.style.cursor =
                "grabbing";

        }
    );


    // --------------------------------------------------------
    // POINTER MOVE
    // --------------------------------------------------------

    canvas.addEventListener(
        "pointermove",
        event => {

            if (
                !kullaniciSurukluyor
            ) {

                return;

            }


            const deltaX =
                event.clientX -
                sonX;


            const deltaY =
                event.clientY -
                sonY;


            sonX =
                event.clientX;


            sonY =
                event.clientY;


            // ------------------------------------------------
            // DIRECT ROTATION
            // ------------------------------------------------

            earth.rotation.y +=
                deltaX *
                suruklemeHassasiyeti;


            earthGroup.rotation.x +=
                deltaY *
                suruklemeHassasiyeti;


            earthGroup.rotation.x =
                THREE.MathUtils.clamp(

                    earthGroup.rotation.x,

                    -0.65,

                    0.65

                );


            // ------------------------------------------------
            // MOMENTUM
            // ------------------------------------------------

            hizX =
                deltaX *
                momentumKatsayisi;


            hizY =
                deltaY *
                momentumKatsayisi;

        }
    );


    // ========================================================
    // POINTER RELEASE
    // ========================================================

    function suruklemeyiBirak() {

        kullaniciSurukluyor =
            false;


        canvas.style.cursor =
            "grab";

    }


    canvas.addEventListener(
        "pointerup",
        suruklemeyiBirak
    );


    canvas.addEventListener(
        "pointercancel",
        suruklemeyiBirak
    );


    canvas.addEventListener(
        "lostpointercapture",
        suruklemeyiBirak
    );


    canvas.style.cursor =
        "grab";


    // ========================================================
    // RESIZE
    // ========================================================

    function resize() {

        const width =
            container.clientWidth;


        const height =
            container.clientHeight;


        if (
            width <= 0 ||
            height <= 0
        ) {

            return;

        }


        camera.aspect =
            width / height;


        camera.updateProjectionMatrix();


        renderer.setSize(
            width,
            height,
            false
        );

    }


    resize();


    /*
       ResizeObserver, sadece pencere boyutu değil,
       container boyutu değiştiğinde de çalışır.
    */

    let resizeObserver =
        null;


    if (
        "ResizeObserver" in window
    ) {

        resizeObserver =
            new ResizeObserver(
                resize
            );


        resizeObserver.observe(
            container
        );

    } else {

        window.addEventListener(
            "resize",
            resize,
            {
                passive:
                    true
            }
        );

    }


    // ========================================================
    // REDUCED MOTION
    // ========================================================

    const reducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );


    // ========================================================
    // ANIMATION
    // ========================================================

    const clock =
        new THREE.Clock();


    function animate() {

        requestAnimationFrame(
            animate
        );


        const delta =
            Math.min(
                clock.getDelta(),
                0.05
            );


        if (
            !reducedMotion.matches
        ) {

            // ------------------------------------------------
            // AUTOMATIC ROTATION
            // ------------------------------------------------

            if (
                !kullaniciSurukluyor
            ) {

                earth.rotation.y +=
                    delta *
                    0.11;


                // ------------------------------------------------
                // MOMENTUM
                // ------------------------------------------------

                earth.rotation.y +=
                    hizX *
                    delta;


                earthGroup.rotation.x +=
                    hizY *
                    delta;


                earthGroup.rotation.x =
                    THREE.MathUtils.clamp(

                        earthGroup.rotation.x,

                        -0.65,

                        0.65

                    );


                /*
                   FPS bağımsız momentum azalması.
                */

                const friction =
                    Math.pow(
                        0.06,
                        delta
                    );


                hizX *=
                    friction;


                hizY *=
                    friction;

            }


            // ------------------------------------------------
            // NIGHT SIDE
            // ------------------------------------------------

            nightEarth.rotation.y =
                earth.rotation.y;


            // ------------------------------------------------
            // STARS
            // ------------------------------------------------

            stars.rotation.y +=
                delta *
                0.003;


            stars.rotation.x +=
                delta *
                0.001;


            // ------------------------------------------------
            // DUST
            // ------------------------------------------------

            dust.rotation.y +=
                delta *
                0.006;

        }


        renderer.render(
            scene,
            camera
        );

    }


    animate();


    // ========================================================
    // CLEANUP
    // ========================================================

    window.addEventListener(
        "beforeunload",
        () => {

            if (
                resizeObserver
            ) {

                resizeObserver.disconnect();

            } else {

                window.removeEventListener(
                    "resize",
                    resize
                );

            }


            earthGeometry.dispose();
            earthMaterial.dispose();

            nightGeometry.dispose();
            nightMaterial.dispose();

            atmosphereGeometry.dispose();
            atmosphereMaterial.dispose();

            starGeometry.dispose();
            starMaterial.dispose();

            dustGeometry.dispose();
            dustMaterial.dispose();

            earthTexture.dispose();
            nightTexture.dispose();

            renderer.dispose();

        },
        {
            once:
                true
        }
    );

}