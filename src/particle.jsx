import { loadAll } from '@tsparticles/all';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import React, { memo, useEffect, useState } from 'react';
import { dataLoaded, getData } from './data';

function Particle({ mute, choice }) {
    const [particleEngine, setParticleEngine] = useState(false);
    const [particleOption, setParticleOptions] = useState({});

    useEffect(() => {
        if (particleEngine) return;

        initParticlesEngine(async (engine) => {
            await loadAll(engine);
        }).then(() => {
            setParticleEngine(true);
        });
    }, []);

    useEffect(() => {
        /// Handles mute
        setParticleOptions({
            ...particleOption,
            sounds: {
                ...particleOption?.sounds,
                enable: (mute) ? false : true
            }
        });
    }, [mute, particleEngine]);

    useEffect(() => {
        if (!choice) return;

        dataLoaded.then(() => {
            const particles = getData('particles');
            setParticleOptions(particles[choice?.value - 1]);
        });
    }, [choice]);
    
    return (
        <div>
            {particleEngine && <Particles options={particleOption}/>}
        </div>
    );
};

export default memo(Particle);