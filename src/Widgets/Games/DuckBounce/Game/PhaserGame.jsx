import React, { forwardRef, useLayoutEffect, useRef } from 'react';
import StartGame from './main';

export const PhaserGame = forwardRef(function PhaserGame({ currentActiveScene }, ref){
    const game = useRef();

    useLayoutEffect(() => {
        if (game.current === undefined) {
            game.current = StartGame('duckbounce-game');

            if (ref !== null) {
                ref.current = {
                    game: game.current,
                    scene: null 
                };
            };
        };

        return () => {
            game.current?.destroy(true);
            game.current = undefined;
        };
    }, [ref]);

    return (
        <div id='duckbounce-game'></div>
    );
});