import PropTypes from 'prop-types';
import { forwardRef, useEffect, useLayoutEffect, useRef } from 'react';
import { EventBus } from './EventBus';
import StartGame from './main';


export const PhaserGame = forwardRef(function PhaserGame ({ currentActiveScene }, ref){
    const game = useRef();
    useLayoutEffect(() => {
        if(game.current === undefined){
            game.current = StartGame("bullethell-game");
            if(ref !== null){
                ref.current = {
                    game: game.current,
                    scene: null 
                };
            };
        };
        return () => {
            if(game.current){
                game.current.destroy(true);
                game.current = undefined;
            };
        };
    }, [ref]);
    useEffect(() => {
        EventBus.on('current-scene-ready', (currentScene) => {
            if(currentActiveScene instanceof Function){
                currentActiveScene(currentScene);
            };
            ref.current.scene = currentScene;
        });
        return () => {
            EventBus.removeListener('current-scene-ready');
        };
    }, [currentActiveScene, ref]);
    return(
        <div id="bullethell-game"></div>
    );
});

/// Props definitions
PhaserGame.propTypes = {
    currentActiveScene: PropTypes.func
};