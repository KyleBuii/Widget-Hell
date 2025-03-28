import PropTypes from 'prop-types';
import React, { forwardRef, useEffect, useLayoutEffect, useRef } from 'react';
import { EventBus } from './EventBus';
import StartGame from './main';


/// The React component that initializes the Phaser Game and serve like a bridge between React and Phaser
export const PhaserGame = forwardRef(function PhaserGame ({ currentActiveScene }, ref){
    const game = useRef();
    /// Create the game inside a useLayoutEffect hook to avoid the game being created outside the DOM
    useLayoutEffect(() => {
        if(game.current === undefined){
            game.current = StartGame("grindshot-game");
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
        <div id="grindshot-game"></div>
    );
});

/// Props definitions
PhaserGame.propTypes = {
    currentActiveScene: PropTypes.func
};