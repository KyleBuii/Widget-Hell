import { FaGripHorizontal } from 'react-icons/fa';
import { IconContext } from 'react-icons';
import Draggable from 'react-draggable';


function WidgetTextRPG(props){
    return(
        <Draggable onStart={() => props.funcDragStart("text-rpg")}
            onStop={() => props.funcDragStop("text-rpg")}
            cancel="button, section"
            bounds="parent">
            <div id="text-rpg-box"
                className="widget">
                <div id="text-rpg-box-animation"
                    className="widget-animation">
                    <span id="text-rpg-box-draggable"
                        className="draggable">
                        <IconContext.Provider value={{ size: props.varLargeIcon, className: "global-class-name" }}>
                            <FaGripHorizontal/>
                        </IconContext.Provider>
                    </span>
                    <div>
                        <div>
                            <span>XP: 0</span>
                            <span>Health: 100</span>
                            <span>Gold: 50</span>
                        </div>
                        <div>
                            <button>Go to store</button>
                            <button>Go to cave</button>
                            <button>Fight dragon</button>
                        </div>
                        <div>
                            <span>Monster Name:</span>
                            <span>Health:</span>
                        </div>
                        <div>
                            Welcome to Dragon Repeller. You must defeat the dragon that is preventing people from leaving the town. You are in the town square. Where do you want to go? Use the buttons above.
                        </div>
                    </div>
                </div>
            </div>
        </Draggable>
    );
};

export default WidgetTextRPG;