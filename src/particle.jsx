import { loadAll } from '@tsparticles/all';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { React, memo, useEffect, useState } from 'react';


function Particle(props){
    const [particleEngine, setParticleEngine] = useState(false);
    const [particleOptions, setParticleOptions] = useState({});
    useEffect(() => {
        /// Handles mute
        setParticleOptions({
            ...particleOptions,
            sounds: {
                ...particleOptions?.sounds,
                enable: (props.mute) ? false : true
            }
        });
    }, [props.mute, particleEngine]);
    useEffect(() => {
        /// Handles choices
        switch(props.choice?.value){
            case "circleConnect":
                setParticleOptions({
                    particles: {
                        number: {
                            value: 50
                        },
                        color: {
                            value: "#ffffff"
                        },
                        links: {
                            enable: true,
                            distance: 200
                        },
                        shape: {
                            type: "circle"
                        },
                        opacity: {
                            value: 1
                        },
                        size: {
                            value: {
                                min: 4,
                                max: 6
                            }
                        },
                        move: {
                            enable: true,
                            speed: 2
                        }
                    },
                    poisson: {
                        enable: true
                    }
                });
                break;
            case "circlePop":
                setParticleOptions({
                    particles: {
                        destroy: {
                            mode: "split",
                            split: {
                                count: 1,
                                factor: {
                                    value: {
                                        min: 2,
                                        max: 4
                                    }
                                },
                                rate: {
                                    value: 100
                                },
                                particles: {
                                    life: {
                                        count: 1,
                                        duration: {
                                            value: {
                                                min: 2,
                                                max: 3
                                            }
                                        }
                                    },
                                    move: {
                                        speed: {
                                            min: 10,
                                            max: 15
                                        }
                                    }
                                }
                            }
                        },
                        number: {
                            value: 80
                        },
                        color: {
                            value: [
                                "#3998D0",
                                "#2EB6AF",
                                "#A9BD33",
                                "#FEC73B",
                                "#F89930",
                                "#F45623",
                                "#D62E32",
                                "#EB586E",
                                "#9952CF"
                            ]
                        },
                        shape: {
                            type: "circle"
                        },
                        opacity: {
                            value: 1
                        },
                        size: {
                            value: {
                                min: 10,
                                max: 15
                            }
                        },
                        collisions: {
                            enable: true,
                            mode: "bounce"
                        },
                        move: {
                            enable: true,
                            speed: 3,
                            outModes: "bounce"
                        }
                    },
                    interactivity: {
                        events: {
                            onClick: {
                                enable: true,
                                mode: "pop"
                            }
                        }
                    }
                });
                break;
            case "circleFreeMovement":
                setParticleOptions({
                    particles: {
                        number: {
                            value: 80,
                            density: {
                                enable: true
                            }
                        },
                        color: {
                            value: "#ff0000",
                            animation: {
                                enable: true,
                                speed: 360,
                                sync: true
                            }
                        },
                        effect: {
                            type: "trail",
                            options: {
                                trail: {
                                    fade: true,
                                    length: {
                                        min: 10,
                                        max: 30
                                    }
                                }
                            }
                        },
                        shape: {
                            type: "circle"
                        },
                        size: {
                            value: 10
                        },
                        move: {
                            path: {
                                enable: true,
                                options: {
                                    size: 32,
                                    draw: false,
                                    increment: 0.004
                                },
                                generator: "simplexNoise"
                            },
                            enable: true,
                            speed: { min: 6, max: 15 }
                        }
                    }
                });
                break;
            case "circleZigZag":
                setParticleOptions({
                    particles: {
                        color: {
                            value: ["#ffffff", "#ff0000", "#00ff00", "#0000ff"]
                        },
                        move: {
                            enable: true,
                            outModes: "out",
                            speed: { min: 1, max: 3 },
                            path: {
                                enable: true,
                                options: {
                                    waveLength: { min: 3, max: 7 },
                                    waveHeight: { min: 1, max: 5 }
                                },
                                generator: "zigZagPathGenerator"
                            }
                        },
                        number: {
                            value: 80
                        },
                        opacity: {
                            value: 1
                        },
                        effect: {
                            type: "trail",
                            options: {
                                trail: {
                                    fade: true,
                                    length: {
                                        min: 10,
                                        max: 30
                                    }
                                }
                            }
                        },
                        shape: {
                            type: "circle"
                        },
                        size: {
                            value: 3
                        }
                    }
                });
                break;
            case "circleWander":
                setParticleOptions({
                    particles: {
                        color: {
                            value: "#FF0000",
                            animation: {
                                enable: true,
                                speed: 10
                            }
                        },
                        effect: {
                            type: "trail",
                            options: {
                                trail: {
                                    length: 50,
                                    minWidth: 4
                                }
                            }
                        },
                        move: {
                            direction: "none",
                            enable: true,
                            outModes: {
                                default: "destroy"
                            },
                            path: {
                                clamp: false,
                                enable: true,
                                delay: {
                                    value: 0
                                },
                                generator: "polygonPathGenerator",
                                options: {
                                    sides: 6,
                                    turnSteps: 30,
                                    angle: 30
                                }
                            },
                            random: false,
                            speed: 3,
                            straight: false
                        },
                        number: {
                            value: 0
                        },
                        opacity: {
                            value: 1
                        },
                        shape: {
                            type: "circle"
                        },
                        size: {
                            value: 2
                        }
                    },
                    emitters: {
                        direction: "none",
                        rate: {
                            quantity: 1,
                            delay: 0.25
                        },
                        size: {
                            width: 0,
                            height: 0
                        },
                        position: {
                            x: 50,
                            y: 50
                        }
                    }
                });
                break;
            case "circleInfection":
                setParticleOptions({
                    fpsLimit: 60,
                    infection: {
                        enable: true,
                        infections: 10,
                        cure: true,
                        stages: [
                            {
                                color: "#ff0000",
                                duration: 1
                            },
                            {
                                color: "#ffa500",
                                duration: 1,
                                rate: 2
                            },
                            {
                                color: "#ffff00",
                                duration: 1,
                                rate: 2
                            },
                            {
                                color: "#008000",
                                duration: 1,
                                rate: 3
                            },
                            {
                                color: "#0000ff",
                                duration: 1,
                                rate: 4
                            },
                            {
                                color: "#4b0082",
                                duration: 1,
                                rate: 5
                            },
                            {
                                color: "#ee82ee",
                                duration: 1,
                                rate: 6,
                                infectedStage: 0
                            }
                        ]
                    },
                    particles: {
                        number: {
                            value: 100,
                            density: {
                                enable: true,
                                value_area: 800
                            }
                        },
                        color: {
                            value: "#ffffff"
                        },
                        shape: {
                            type: "circle",
                            stroke: {
                                width: 0,
                                color: "#000000"
                            },
                            polygon: {
                                nb_sides: 5
                            }
                        },
                        opacity: {
                            value: 0.8,
                            random: false,
                            anim: {
                                enable: false,
                                speed: 3,
                                opacity_min: 0.1,
                                sync: false
                            }
                        },
                        size: {
                            value: 10,
                            random: false,
                            anim: {
                                enable: false,
                                speed: 20,
                                size_min: 0.1,
                                sync: false
                            }
                        },
                        move: {
                            collisions: true,
                            enable: true,
                            speed: 10,
                            direction: "none",
                            random: false,
                            straight: false,
                            out_mode: "bounce",
                            attract: {
                                enable: false,
                                rotateX: 600,
                                rotateY: 1200
                            }
                        }
                    }
                });
                break;
            case "circlePush":
                setParticleOptions({
                    interactivity: {
                        events: {
                            onHover: {
                                enable: true,
                                mode: "repulse",
                                parallax: { enable: false, force: 60, smooth: 10 }
                            },
                            resize: true
                        },
                        modes: {
                            repulse: { distance: 100, duration: 0.4 }
                        }
                    },
                    particles: {
                        color: { value: "#ffffff" },
                        move: {
                            direction: "none",
                            enable: true,
                            outModes: "out",
                            random: false,
                            speed: 2,
                            straight: false
                        },
                        number: {
                            density: {
                                enable: true,
                                area: 800
                            },
                            value: 100
                        },
                        opacity: {
                            animation: {
                                enable: true,
                                speed: 0.05,
                                sync: true,
                                startValue: "max",
                                count: 1,
                                destroy: "min"
                            },
                            value: {
                                min: 0,
                                max: 0.5
                            }
                        },
                        shape: {
                            type: "circle"
                        },
                        size: {
                            value: { min: 5, max: 15 }
                        }
                    }
                });
                break;        
            case "firework":
                setParticleOptions({
                    emitters: {
                        direction: "top",
                        life: {
                            count: 0,
                            duration: 0.1,
                            delay: 0.1
                        },
                        rate: {
                            delay: 0.15,
                            quantity: 1
                        },
                        size: {
                            width: 100,
                            height: 0
                        },
                        position: {
                            y: 100,
                            x: 50
                        }
                    },
                    particles: {
                        color: {
                            value: "#fff"
                        },
                        number: {
                            value: 0
                        },
                        destroy: {
                            bounds: {
                                top: 30
                            },
                            mode: "split",
                            split: {
                                count: 1,
                                factor: {
                                    value: 0.333333
                                },
                                rate: {
                                    value: 100
                                },
                                particles: {
                                    stroke: {
                                        width: 0
                                    },
                                    color: {
                                        value: ["#ff595e", "#ffca3a", "#8ac926", "#1982c4", "#6a4c93"]
                                    },
                                    number: {
                                        value: 0
                                    },
                                    collisions: {
                                        enable: false
                                    },
                                    destroy: {
                                        bounds: {
                                            top: 0
                                        }
                                    },
                                    opacity: {
                                        value: {
                                            min: 0.1,
                                            max: 1
                                        },
                                        animation: {
                                            enable: true,
                                            speed: 0.7,
                                            sync: false,
                                            startValue: "max",
                                            destroy: "min"
                                        }
                                    },
                                    effect: {
                                        type: "trail",
                                        options: {
                                            trail: {
                                                length: {
                                                    min: 5,
                                                    max: 10
                                                }
                                            }
                                        }
                                    },
                                    shape: {
                                        type: "circle"
                                    },
                                    size: {
                                        value: 2,
                                        animation: {
                                            enable: false
                                        }
                                    },
                                    life: {
                                        count: 1,
                                        duration: {
                                            value: {
                                                min: 1,
                                                max: 2
                                            }
                                        }
                                    },
                                    move: {
                                        enable: true,
                                        gravity: {
                                            enable: true,
                                            acceleration: 9.81,
                                            inverse: false
                                        },
                                        decay: 0.1,
                                        speed: {
                                            min: 10,
                                            max: 25
                                        },
                                        direction: "outside",
                                        outModes: "destroy"
                                    }
                                }
                            }
                        },
                        life: {
                            count: 1
                        },
                        effect: {
                            type: "trail",
                            options: {
                                trail: {
                                    length: {
                                        min: 10,
                                        max: 30
                                    },
                                    minWidth: 1,
                                    maxWidth: 1
                                }
                            }
                        },
                        rotate: {
                            path: true
                        },
                        shape: {
                            type: "circle"
                        },
                        size: {
                            value: 1
                        },
                        move: {
                            enable: true,
                            gravity: {
                                acceleration: 15,
                                enable: true,
                                inverse: true,
                                maxSpeed: 100
                            },
                            speed: {
                                min: 10,
                                max: 20
                            },
                            outModes: {
                                default: "destroy",
                                top: "none"
                            }
                        }
                    },
                    sounds: {
                        events: [
                            {
                                event: "particleRemoved",
                                filter: (args) => args.data.particle.options.move.gravity.inverse,
                                audio: [
                                    "https://particles.js.org/audio/explosion0.mp3",
                                    "https://particles.js.org/audio/explosion1.mp3",
                                    "https://particles.js.org/audio/explosion2.mp3"
                                ]
                            }
                        ],
                        volume: 50
                    }
                });
                break;
            case "confetti":
                setParticleOptions({
                    particles: {
                        color: {
                            value: ["#1E00FF", "#FF0061", "#E1FF00", "#00FF9E"],
                            animation: {
                                enable: true,
                                speed: 30
                            }
                        },
                        move: {
                            direction: "bottom",
                            enable: true,
                            outModes: {
                                default: "out"
                            },
                            size: true,
                            speed: {
                                min: 1,
                                max: 3
                            }
                        },
                        number: {
                            value: 700,
                            density: {
                                enable: true,
                                area: 800
                            }
                        },
                        opacity: {
                            value: 1
                        },
                        rotate: {
                            value: {
                                min: 0,
                                max: 360
                            },
                            direction: "random",
                            move: true,
                            animation: {
                                enable: true,
                                speed: 60
                            }
                        },
                        tilt: {
                            direction: "random",
                            enable: true,
                            move: true,
                            value: {
                                min: 0,
                                max: 360
                            },
                            animation: {
                                enable: true,
                                speed: 60
                            }
                        },
                        shape: {
                            type: ["circle", "square", "polygon"],
                            options: {
                                polygon: [
                                    {
                                        sides: 5
                                    },
                                    {
                                        sides: 6
                                    }
                                ]
                            }
                        },
                        size: {
                            value: {
                                min: 3,
                                max: 5
                            }
                        },
                        roll: {
                            darken: {
                                enable: true,
                                value: 30
                            },
                            enlighten: {
                                enable: true,
                                value: 30
                            },
                            enable: true,
                            speed: {
                                min: 15,
                                max: 25
                            }
                        },
                        wobble: {
                            distance: 30,
                            enable: true,
                            move: true,
                            speed: {
                                min: -15,
                                max: 15
                            }
                        }
                    }                  
                });
                break;
            case "mouseCircle":
                setParticleOptions({
                    particles: {
                        number: {
                            value: 0
                        },
                        color: {
                            value: "#ff0000",
                            animation: {
                                enable: true,
                                speed: 20,
                                sync: true
                            }
                        },
                        shape: {
                            type: "circle"
                        },
                        opacity: {
                            value: 0.5
                        },
                        size: {
                            value: { min: 1, max: 3 }
                        },
                        move: {
                            enable: true,
                            speed: 6,
                            direction: "none"
                        }
                    },
                    interactivity: {
                        events: {
                            onHover: {
                                enable: true,
                                mode: "trail"
                            }
                        },
                        modes: {
                            trail: {
                                delay: 0.01,
                                pauseOnStop: true,
                                particles: {
                                    color: {
                                        value: "#00ff00",
                                        animation: {
                                            enable: true,
                                            speed: 200,
                                            sync: false
                                        }
                                    },
                                    move: {
                                        outModes: "destroy"
                                    },
                                    size: {
                                        random: true,
                                        value: 10
                                    }
                                }
                            }
                        }
                    }                  
                });
                break;    
            case "mouseMagnifyingGlass":
                setParticleOptions({
                    fpsLimit: 60,
                    interactivity: {
                        detect_on: "window",
                        events: {
                            onHover: {
                                enable: true,
                                mode: ["bubble", "connect"]
                            },
                            resize: true
                        },
                        modes: {
                            bubble: {
                                distance: 200,
                                duration: 2,
                                opacity: 1,
                                size: 30,
                                speed: 3,
                                color: {
                                    value: ["#5bc0eb", "#fde74c", "#9bc53d", "#e55934", "#fa7921"]
                                }
                            },
                            connect: {
                                distance: 60,
                                lineLinked: {
                                    opacity: 0.2
                                },
                                radius: 200
                            }
                        }
                    },
                    particles: {
                        color: {
                            value: "#000000"
                        },
                        move: {
                            direction: "none",
                            enable: true,
                            outMode: "out",
                            random: false,
                            speed: 2,
                            straight: false
                        },
                        number: {
                            density: {
                                enable: true,
                                value_area: 800
                            },
                            value: 300
                        },
                        opacity: {
                            value: 0
                        },
                        shape: {
                            type: "circle"
                        },
                        size: {
                            random: {
                                enable: true,
                                minimumValue: 10
                            },
                            value: 15
                        }
                    },
                    retina_detect: true
                });
                break;
            case "heart":
                setParticleOptions({
                    particles: {
                        color: {
                            value: [
                                "#FFAEBC",
                                "#A0E7E5",
                                "#B4F8C8",
                                "#FBE7C6",
                                "#FFC9AE",
                                "#FFAEE5",
                                "#A0C6E7",
                                "#A0E7C2",
                                "#B4F8EA",
                                "#C2F8B4",
                                "#F4FBC6",
                                "#FBCDC6"
                            ]
                        },
                        move: {
                            angle: {
                                offset: 0,
                                value: 15
                            },
                            direction: "bottom",
                            enable: true,
                            outModes: {
                                default: "out"
                            },
                            speed: {
                                min: 3,
                                max: 20
                            }
                        },
                        number: {
                            value: 50
                        },
                        opacity: {
                            value: 1
                        },
                        shape: {
                            type: "heart"
                        },
                        size: {
                            value: 64
                        },
                        roll: {
                            darken: {
                                enable: true,
                                value: 30
                            },
                            enlighten: {
                                enable: true,
                                value: 30
                            },
                            enable: true,
                            mode: "horizontal",
                            speed: {
                                min: 5,
                                max: 15
                            }
                        },
                        zIndex: {
                            value: {
                                min: 0,
                                max: 100
                            },
                            opacityRate: 0,
                            velocityRate: 2
                        }   
                    }               
                });
                break;
            default:
                setParticleOptions({});
                break;
        };
    }, [props.choice]);
    useEffect(() => {
        if(particleEngine){ return; };
        initParticlesEngine(async (engine) => {
            await loadAll(engine);
        }).then(() => {
            setParticleEngine(true);
        });
    }, []);
    return(
        <div>
            {particleEngine && <Particles options={particleOptions}/>}
        </div>
    );
};

export default memo(Particle);