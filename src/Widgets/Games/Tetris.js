import { Component, memo, React } from 'react';
import Draggable from 'react-draggable';
import { IconContext } from 'react-icons';
import { FaGripHorizontal, FaRegClock } from 'react-icons/fa';
import { Fa0, FaExpand } from 'react-icons/fa6';
import { IoClose } from 'react-icons/io5';
import { TbMoneybag } from 'react-icons/tb';


/// Variables
let intervalLoop;
let intervalTimer;


class WidgetTetris extends Component{
    constructor(props){
        super(props);
		this.state = {
			gameOver: false,
			highscore: 0,
			score: 0,
			goldEarned: 0,
			timer: 0
		};
		this.loop = this.loop.bind(this);
		this.gameOver = this.gameOver.bind(this);
		this.storeData = this.storeData.bind(this);
    };
    handleKeyDown(event){
        if(/38|87|37|65|39|68|40|83|32|70/.test(event.keyCode)){
			var key = event.keyCode || event.which;
			if(GM.IsAlive){
				switch(key){
					/// Up arrow OR W = Rotate     
					case 38: 
					case 87: 
						Page.Game.IsDirty = GM.Pc.TryRotate(); 
						break;
					/// Left arrow OR A = Move left
					case 37: 
					case 65: 
						Page.Game.IsDirty = GM.Pc.TryMove(-1,0);
						break;
					/// Right arrow OR D = Move right  
					case 39:
					case 68:
						Page.Game.IsDirty = GM.Pc.TryMove(1,0);
						break;
					/// Down arrow OR S = Move down  
					case 40:     
					case 83:
						Page.Game.IsDirty = GM.Pc.TryMove(0,1);
						break;
					/// Spacebar to drop the current piece
					case 32:
						Page.Game.IsDirty = GM.Pc.TryDrop();
						break;
					default: break;
				};
				/// If board was dirtied, cast fresh projection for current piece
				if(Page.Game.IsDirty){
					GM.Pc.ProjY = GM.Pc.TryProject();
				};
			}else if(!GM.IsAlive && key === 70){
				/// If player not alive, reset the game
				this.resetGame();
			};
		};
    };
	initialize(){
		/// Initialize the page object
		Page.Initialize();
		/// Initialize the GM object
		GM.Initialize();
	};
	resetGame(){
		this.initialize();
		GM.IsAlive = true;
		this.setState({
			gameOver: false,
			goldEarned: 0,
			timer: 0
		});
		intervalLoop = setInterval(this.loop, 1000 / 60);
		intervalTimer = setInterval(() => {
			this.setState({
				timer: this.state.timer + 1
			});
		}, 1000);
	};
	loop(){
		if(this.state.gameOver === false){
			/// Always update Page
			Page.Update();
			/// Only need to update GM if the player is alive
			if(GM.IsAlive){
				GM.Update();
			}else{
				this.setState({
					gameOver: true,
					highscore: GM.ScoreHigh,
					score: GM.ScoreCur
				}, () => {
					this.gameOver();	
				});
			};
		};
	};
	gameOver(){
		clearInterval(intervalLoop);
		clearInterval(intervalTimer);
		let gold = Math.floor(this.state.score / 1000);
		this.props.gameProps.updateGameValue("gold", gold);
		if(this.state.score >= 5000){
			let amount = Math.floor(this.state.score / 5000);
            this.props.gameProps.randomItem(amount);
		};
		this.setState({
			goldEarned: gold
		});
	};
	storeData(){
		if(localStorage.getItem("widgets") !== null){
			let dataLocalStorage = JSON.parse(localStorage.getItem("widgets"));
			let tetrisData = dataLocalStorage["games"]["tetris"];
			tetrisData["highscore"] = this.state.highscore;
			localStorage.setItem("widgets", JSON.stringify(dataLocalStorage));
		};
	};
    componentDidMount(){
		window.addEventListener("beforeunload", this.storeData);
        this.initialize();
		intervalLoop = setInterval(this.loop, 1000 / 60);
		if(localStorage.getItem("widgets") !== null){
			let dataLocalStorage = JSON.parse(localStorage.getItem("widgets"));
			if(dataLocalStorage["games"]["tetris"]["highscore"] !== undefined){
				this.setState({
					highscore: dataLocalStorage["games"]["tetris"]["highscore"]
				});
				GM.ScoreHigh = dataLocalStorage["games"]["tetris"]["highscore"];
			};
		};
    };
	componentWillUnmount(){
		window.removeEventListener("beforeunload", this.storeData);
		clearInterval(intervalLoop);
		clearInterval(intervalTimer);
		Page.IsSetup = false;
		GM.IsAlive = false;
		this.storeData();
	};
    render(){
        return(
            <Draggable
                position={{
                    x: this.props.position.x,
                    y: this.props.position.y}}
                disabled={this.props.dragDisabled}
                onStart={() => this.props.defaultProps.dragStart("tetris")}
                onStop={(event, data) => {
                    this.props.defaultProps.dragStop("tetris");
                    this.props.defaultProps.updatePosition("tetris", "games", data.x, data.y);
                }}
                cancel="canvas"
                bounds="parent">
                <div id="tetris-widget"
                    className="widget">
                    <div id="tetris-widget-animation"
                        className="widget-animation">
                        {/* Drag Handle */}
                        <span id="tetris-widget-draggable"
                            className="draggable">
                            <IconContext.Provider value={{ size: this.props.largeIcon, className: "global-class-name" }}>
                                <FaGripHorizontal/>
                            </IconContext.Provider>
                        </span>
                        {/* Hotbar */}
                        <section className="hotbar">
                            {/* Reset Position */}
                            {(this.props.defaultProps.hotbar.resetPosition)
                                ? <button className="button-match inverse when-elements-are-not-straight"
                                    onClick={() => this.props.defaultProps.handleHotbar("tetris", "resetPosition", "games")}>
                                    <Fa0/>
                                </button>
                                : <></>}
                            {/* Fullscreen */}
                            {(this.props.defaultProps.hotbar.fullscreen)
                                ? <button className="button-match inverse when-elements-are-not-straight"
                                    onClick={() => this.props.defaultProps.handleHotbar("tetris", "fullscreen", "games")}>
                                    <FaExpand/>
                                </button>
                                : <></>}
                            {/* Close */}
                            {(this.props.defaultProps.hotbar.close)
                                ? <button className="button-match inverse when-elements-are-not-straight"
                                    onClick={() => this.props.defaultProps.handleHotbar("tetris", "close", "games")}>
                                    <IoClose/>
                                </button>
                                : <></>}
                        </section>
                        {/* Information Container */}
                        <section className="aesthetic-scale scale-span element-ends space-nicely space-bottom font medium bold">
                            {/* Gold Earned */}
                            <span className="text-animation flex-center row">
                                <IconContext.Provider value={{ size: this.props.smallIcon, color: "#f9d700", className: "global-class-name" }}>
                                    <TbMoneybag/>
                                </IconContext.Provider>
                                <span className="font small bold">+</span>
                                {this.state.goldEarned}
                            </span>
                            {/* Total Gold */}
                            <span className="text-animation flex-center row float middle">
                                <IconContext.Provider value={{ size: this.props.smallIcon, color: "#f9d700", className: "global-class-name" }}>
                                    <TbMoneybag/>
                                </IconContext.Provider>
                                {this.props.gameProps.formatNumber(this.props.gameProps.gold, 1)}
                            </span>
                            {/* Timer */}
                            <span className="text-animation flex-center row gap">
                                <IconContext.Provider value={{ size: this.props.smallIcon, className: "global-class-name" }}>
                                    <FaRegClock/>
                                </IconContext.Provider>
                                {this.state.timer}
                            </span>
                        </section>
						{/* Canvas */}
                        <canvas id="tetris-canvas"
							height={800}
							width={600}
                            onKeyDown={(event) => this.handleKeyDown(event)}
                            tabIndex={-1}></canvas>
                        {/* Author */}
                        {(this.props.defaultProps.values.authorNames)
                            ? <span className="font smaller transparent-normal author-name">
                                Created by <a className="font transparent-normal link-match"
                                    href="https://codepen.io/REast/pen/bGMyqP"
                                    target="_blank"
                                    rel="noreferrer">Rich East</a>
                                &emsp;Modified by Me
                            </span>
                            : <></>}
                    </div>
                </div>
            </Draggable>
        );
    };
};

//--------------------------------------------------//
//    PAGE OBJECT & LOGIC                           //
//--------------------------------------------------//
//#region
var Page = {
	IsSetup: false,
	cvs: 0,
	ctx: 0,
	unitSize: 40,
	AreaArr: [],
	/// Performs the page setup
	Initialize: function(){
		/// If page has not been setup, do initial setup
		if(this.IsSetup === false){
			this.cvs = document.getElementById("tetris-canvas");
			this.ctx = this.cvs.getContext('2d');
			this.IsSetup = true;
		};
		for(let i = 0; i < Page.AreaArr.length; i++){
			Page.AreaArr[i].CalculateBounds();
		};
		/// Dirty all draw areas
		for(let i = 0; i < Page.AreaArr.length; i++){
			Page.AreaArr[i].IsDirty = true;
		};
	},
	/// Redraws canvas visuals whenever the page is marked as dirty
	Update: function(){
		for(var i = 0; i < Page.AreaArr.length; i++){
			if(Page.AreaArr[i].IsDirty){
				Page.AreaArr[i].Draw();
				Page.AreaArr[i].IsDirty = false;
			};
		};
	}
};

/// Definition for Area objects. Bounds are in UNITS
function DrawAreaObj(Left, Top, Width, Height, DrawFunction){
	/// Bounds in UNITS
	this.leftBase = Left;
	this.topBase = Top;
	this.widthBase = Width;
	this.heightBase = Height;
	/// Bounds in PIXELS
	this.left = 0;
	this.top = 0;
	this.W = 0;
	this.H = 0;
	/// Dirty flag (clean yourself up flag, you're better than that)
	this.IsDirty = false;
	/// Bounds recalculated and area dirtied when unitSize changes
	this.CalculateBounds = function(){
		this.left = this.leftBase * Page.unitSize;
		this.top = this.topBase * Page.unitSize;
		this.W = this.widthBase * Page.unitSize;
		this.H = this.heightBase * Page.unitSize;		
		this.IsDirty = true;
	};
	/// Draw function as passed in by the callee
	this.Draw = DrawFunction;
	/// Push this area into the area arr    
	Page.AreaArr.push(this);
};

Page.Game = new DrawAreaObj(0, 0, 10, 20, function(){
	/// UnitSize minus a couple pixels of separation
	var uDrawSize = Page.unitSize - 2,
		drawL,
		drawT;
	/// Redraws the background elements for game area
	Page.ctx.fillStyle = 'rgb(28,30,34)';
	Page.ctx.fillRect(this.left, this.top, this.W, this.H); 
	/// Draw the static unit blocks
	for(var i = 0; i < GM.StaticUnits.length; i++){
		for(var j = 0; j < GM.StaticUnits[i].length; j++){
			/// Get the unit value for this index pair
			var uValue = GM.StaticUnits[i][j];
			/// If this unit value is not 0, draw the unit
			if(uValue !== 0){
				drawL = i * Page.unitSize + 1;
				drawT = j * Page.unitSize + 1;	
				/// Fill this square with color based on player alive status        
				Page.ctx.fillStyle = (GM.IsAlive) ? uValue : 'rgb(34,36,42)';      
				Page.ctx.fillRect(drawL,drawT,uDrawSize,uDrawSize);
			};
		};
	};
	/// Draw the current active projection and piece (if exists)
	if(GM.Pc.Cur !== 0 && GM.IsAlive){
		var projColor = ColorWithAlpha(GM.Pc.Cur.color, 0.1);   
		for(var k = 0; k < GM.Pc.Cur.UO.arr.length; k++){
			drawL = (GM.Pc.Cur.x + GM.Pc.Cur.UO.arr[k].x) * Page.unitSize + 1;
			drawT = (GM.Pc.Cur.y + GM.Pc.Cur.UO.arr[k].y) * Page.unitSize + 1;
			Page.ctx.fillStyle = GM.Pc.Cur.color;
			Page.ctx.fillRect(drawL,drawT,uDrawSize,uDrawSize); 
			/// Also draw the projection (if one exists)
			if(GM.IsAlive && GM.Pc.ProjY !== 0){
				drawT += GM.Pc.ProjY * Page.unitSize;
				Page.ctx.fillStyle = projColor;
				Page.ctx.fillRect(drawL,drawT,uDrawSize,uDrawSize);
			};
		};
	};
	/// If the player is dead, draw the game over text
	if(!GM.IsAlive){
		DrawText("GAME OVER", 'rgb(255,255,255)', '500',
			'center', uDrawSize, this.W/2, this.H/4);
		DrawText("PRESS 'F' TO RESET", 'rgb(255,255,255)', '500',
			'center', '20', this.W/2, this.H/3);
	};
});

Page.UpcomingA = new DrawAreaObj(10.5, 2.6, 2.5, 2.5, function(){
	var uDrawSize = Math.floor(Page.unitSize / 2),
		pcA = GM.Pc.Upcoming[0];
	/// Next box background
	Page.ctx.fillStyle = 'rgb(28,30,34)';
	Page.ctx.fillRect(this.left, this.top, this.W, this.H);  
	/// Draw the upcoming piece (if one exists)
	if(pcA !== 0){
		Page.ctx.fillStyle = pcA.color;	
		var totalL = 0, 
			totalT = 0,
			countedL = [], 
			countedT = [];
		/// Calculate average positions of units in order to center
		for(var i = 0; i < pcA.UO.arr.length; i++){
			var curX = pcA.UO.arr[i].x,
				curY = pcA.UO.arr[i].y;	
			if(countedL.indexOf(curX) < 0){
				countedL.push(curX);
				totalL += curX;
			};
			if(countedT.indexOf(curY) < 0){
				countedT.push(curY);
				totalT += curY;
			};
		};
		var avgL = uDrawSize * (totalL / countedL.length + 0.5),
			avgT = uDrawSize * (totalT / countedT.length + 0.5),
			offsetL = this.left + this.W/2,
			offsetT = this.top + this.H/2;
		/// Now draw the upcoming piece, using avg vars to center
		for(var j = 0; j < pcA.UO.arr.length; j++){
			var drawL = Math.floor(offsetL - avgL + pcA.UO.arr[j].x * uDrawSize),
				drawT = Math.floor(offsetT - avgT + pcA.UO.arr[j].y * uDrawSize); 
			Page.ctx.fillRect(drawL,drawT,uDrawSize - 1,uDrawSize - 1);
		};
	};
});

Page.UpcomingB = new DrawAreaObj(10.5, 5.2, 2.5, 2.5, function(){
	var uDrawSize = Math.floor(Page.unitSize / 2),
		pcB = GM.Pc.Upcoming[1];
	/// Next box background
	Page.ctx.fillStyle = 'rgb(28,30,34)';
	Page.ctx.fillRect(this.left, this.top, this.W, this.H);
	/// Draw the upcoming piece (if one exists)
	if(pcB !== 0){
		Page.ctx.fillStyle = pcB.color;
		var totalL = 0, 
			totalT = 0, 
			countedL = [], 
			countedT = [];
		/// Calculate average positions of units in order to center
		for(var i = 0; i < pcB.UO.arr.length; i++){
			var curX = pcB.UO.arr[i].x,
				curY = pcB.UO.arr[i].y;
			if(countedL.indexOf(curX) < 0){
				countedL.push(curX);
				totalL += curX;
			};
			if(countedT.indexOf(curY) < 0){
				countedT.push(curY);
				totalT += curY;
			};
		};
		var avgL = uDrawSize * (totalL / countedL.length + 0.5),
			avgT = uDrawSize * (totalT / countedT.length + 0.5),
			offsetL = this.left + this.W/2,
			offsetT = this.top + this.H/2;
		/// Now draw the upcoming piece, using avg vars to center
		for(var j = 0; j < pcB.UO.arr.length; j++){
			var drawL = Math.floor(offsetL - avgL + pcB.UO.arr[j].x * uDrawSize),
			drawT = Math.floor(offsetT - avgT + pcB.UO.arr[j].y * uDrawSize); 
			Page.ctx.fillRect(drawL, drawT, uDrawSize - 1, uDrawSize - 1);
		};
	};
});

Page.UpcomingC = new DrawAreaObj(10.5, 7.8, 2.5, 2.5, function(){
	var uDrawSize = Math.floor(Page.unitSize / 2),
		pcC = GM.Pc.Upcoming[2];
	/// Next box background
	Page.ctx.fillStyle = 'rgb(28,30,34)';
	Page.ctx.fillRect(this.left, this.top, this.W, this.H);
	/// Draw the upcoming piece (if one exists)
	if(pcC !== 0){
		Page.ctx.fillStyle = pcC.color;
		var totalL = 0, 
			totalT = 0, 
			countedL = [], 
			countedT = [];
		/// Calculate average positions of units in order to center
		for(var i = 0; i < pcC.UO.arr.length; i++){
			var curX = pcC.UO.arr[i].x,
				curY = pcC.UO.arr[i].y;
			if(countedL.indexOf(curX) < 0){
				countedL.push(curX);
				totalL += curX;
			};
			if(countedT.indexOf(curY) < 0){
				countedT.push(curY);
				totalT += curY;
			};
		};
		var avgL = uDrawSize * (totalL / countedL.length + 0.5),
			avgT = uDrawSize * (totalT / countedT.length + 0.5),
			offsetL = this.left + this.W/2,
			offsetT = this.top + this.H/2;
		/// Now draw the upcoming piece, using avg vars to center
		for(var j = 0; j < pcC.UO.arr.length; j++){
			var drawL = Math.floor(offsetL - avgL + pcC.UO.arr[j].x * uDrawSize),
				drawT = Math.floor(offsetT - avgT + pcC.UO.arr[j].y * uDrawSize); 
			Page.ctx.fillRect(drawL,drawT,uDrawSize - 1,uDrawSize - 1);
		};
	};
});

Page.ScoreBarHigh = new DrawAreaObj(10.5, 0, 4.5, 1, function(){
	/// Draw the score area back bar
	Page.ctx.fillStyle = 'rgb(28,30,34)';
	Page.ctx.fillRect(this.left,this.top,this.W,this.H);
	/// Draw the trophy symbol
	var miniUnit, left, top, width, height;
	miniUnit = Page.unitSize * 0.01;
	Page.ctx.fillStyle = 'rgb(255,232,96)';
	/// Trophy base
	left = Math.floor(this.left + miniUnit * 33);
	top = Math.floor(this.top + this.H - miniUnit * 28);
	width = Math.floor(miniUnit * 30);
	height = Math.floor(miniUnit * 12);
	Page.ctx.fillRect(left,top,width,height);
	/// Trophy trunk
	left = Math.floor(this.left + miniUnit * 42);
	top = Math.floor(this.top + this.H - miniUnit * 50);
	width = Math.floor(miniUnit * 12);
	height = Math.floor(miniUnit * 32);  
	Page.ctx.fillRect(left,top,width,height);
	/// Trophy bowl
	left = Math.floor(this.left + miniUnit * 48);
	top = Math.floor(this.top + this.H - miniUnit * 68);
	Page.ctx.arc(left, top, miniUnit * 24, 0, Math.PI);
	Page.ctx.fill();
	/// Draw the player's current score
	var text, size;
	text = ("00000000" + GM.ScoreHigh).slice(-7);
	left = this.left + this.W - 4;
	top = this.top + Page.unitSize * 0.8;
	size = Math.floor(Page.unitSize * 0.8) + 0.5;
	DrawText(text, 'rgb(255,232,96)', '500', 'right', size, left, top);
});

Page.ScoreBarCur = new DrawAreaObj(10.5, 1.1, 4.5, 1, function(){
	/// Draw the score area back bar
	Page.ctx.fillStyle = 'rgb(28,30,34)';
	Page.ctx.fillRect(this.left,this.top,this.W,this.H);
	/// Draw the player's current level
	var text, left, top, size, miniUnit;
	miniUnit = Page.unitSize * 0.01;
	text = ('00' + GM.Level).slice(-2);
	left = this.left + Math.floor(miniUnit * 50);
	top = this.top + Page.unitSize * 0.8;
	size = Math.floor(Page.unitSize * 0.5);
	DrawText(text, 'rgb(128,128,128)', '900', 'center', size, left, top);
	/// Draw the player's current score
	text = ("00000000" + GM.ScoreCur).slice(-7);
	left = this.left + this.W - 4;
	top = this.top + Page.unitSize * 0.8;
	size =  Math.floor(Page.unitSize * 0.8) + 0.5;
	DrawText(text, 'rgb(255,255,255)', '500', 'right', size, left, top);
});
//#endregion

//--------------------------------------------------//
//    GAME MANAGER OBJECT & LOGIC                   //
//--------------------------------------------------//
var GM = {
	/// Timers
	TimeCur: 0, TimeEvent: 0, TickRate: 0,
	/// Player status & score
	IsAlive: 0, Level: 0, PiecesRemaining: 0,
	/// Score count and current piece score modifiers
	ScoreHigh: 0, ScoreCur: 0, ScoreBonus: 0, DifficultFlag: 0,
	/// Array of grid squares
	StaticUnits: [],
	/// Set up intial game var values
	Initialize: function(){
		/// Reset current piece vars
		this.Pc.Next = this.Pc.Cur = this.Pc.ProjY = 0;
		/// Populate the GM's static unit array with 0's (empty)
		for(var i = 0; i < 10; i++){
			this.StaticUnits[i] = [];
			for(var j = 0; j < 20; j++){
				this.StaticUnits[i][j] = 0;
			};
		};
		/// Reset timer
		this.TimeCur = this.TimeEvent = 0;
		this.TickRate = 500;
		/// Set up level values for level 1
		this.PiecesRemaining = 10;
		this.Level = 1;
		/// Reset the score
		this.ScoreCur = 0;
	},
	/// Updates time each frame and executing logic if a tick has passed
	Update: function(){
		this.TimeCur = new Date().getTime();
		if(this.TimeCur >= this.TimeEvent){
			if(GM.Pc.Cur === 0 && this.IsAlive){
				this.Pc.Generate();
			}else{
				this.Pc.DoGravity();
				this.Pc.ProjY = this.Pc.TryProject();
				Page.Game.IsDirty = true;
			};      
			this.RefreshTimer();
		};
	},
	/// Reset the tick timer (generates a new TimeEvent target)
	RefreshTimer: function(){
		this.TimeEvent = new Date().getTime() + this.TickRate;
	},
	/// Called when a piece is spawned, advances level if needed
	PieceSpawned: function(){
		this.PiecesRemaining--;
		if(this.PiecesRemaining <= 0){
			this.AdvanceLevel();
		};
	},
	/// Advance level, recalculate TickRate, reset pieces remaining
	AdvanceLevel: function(){
		this.Level++;
		this.TickRate = Math.floor(555 * Math.exp(this.Level / -10));
		this.PiecesRemaining = Math.floor((5000 / this.TickRate));
		Page.ScoreBarCur.IsDirty = true;
	},
	/// Check specified rows to see if any can be cleared
	CheckUnits: function(checkRowsRaw){
		var scoreMult = 0,
		pieceScore = 0,
		checkRows = [];
		/// Add the scoreBonus for dropping
		if(this.ScoreBonus > 0){
			pieceScore += this.ScoreBonus;      
		};
		/// Sort the rows
		for(var a = 0; a < 20; a++){
			if(checkRowsRaw.indexOf(a) >= 0){
				checkRows.push(a);
			};
		};
		for(var i = 0; i < checkRows.length; i++){
			var hasGap = false,
			checkIndex = checkRows[i]; 
			for(var j = 0; j < GM.StaticUnits.length; j++){
				if(GM.StaticUnits[j][checkIndex] === 0){
					hasGap = true;
					break;
				};
			};
			if(hasGap === false){
				for(var k = 0; k < GM.StaticUnits.length; k++){
					GM.StaticUnits[k].splice(checkIndex,1);
					GM.StaticUnits[k].unshift(0);          
				};
				pieceScore += 100 + 200 * scoreMult;
				if(scoreMult > 2){
					pieceScore += 100;
				};       
				scoreMult++;
			};
		};
		if(this.DifficultFlag === 1){
			pieceScore = Math.floor(pieceScore * 1.5);
			this.DifficultFlag = 0;
		};
		if(pieceScore > 0){
			this.ScoreCur += pieceScore;
			Page.ScoreBarCur.IsDirty = true;
			this.ScoreBonus = 0;
			if(scoreMult > 3){
				this.DifficultFlag = 1;
			};   
		};
	},
	GameOver: function(){
		Page.Game.IsDirty = Page.ScoreBarCur.IsDirty = true;
		if(this.ScoreCur > this.ScoreHigh){
			this.ScoreHigh = this.ScoreCur;
			Page.ScoreBarHigh.IsDirty = true;
		};
		this.IsAlive = false;
	}
};

//--------------------------------------------------//
//    PIECE OBJECT BUILDER                          //
//--------------------------------------------------//
// PcObj is used to create new piece object instances based on the
// passed in parameters. PcObj is called by predefined templates
GM.PcObj = function(color, rotCount, units){
	this.x = 5;
	this.y = 0;
	this.color = color;
	this.UO = {};
	/// Rotate this piece by advancing to next unit obj of linked list
	this.Rotate = function(){
		this.UO = this.UO.nextUO;
	};
	/// Set up the piece unit object linked list to define rotations
	this.SetUO = function(rotCount, units){
		var linkedListUO = [];
		linkedListUO[0] = { nextUO: 0, arr:[] };
		linkedListUO[0].arr = units;
		for(var i = 0; i < rotCount; i++){
			linkedListUO[i] = { nextUO: 0, arr:[]};
			if(i > 0){
				linkedListUO[i-1].nextUO = linkedListUO[i];
			};
			for(var j = 0; j < units.length; j++){
				var unX,
					unY;
				if(i === 0){
					unX = units[j].x;
					unY = units[j].y;
				}else{
					unX = linkedListUO[i-1].arr[j].y * -1;
					unY = linkedListUO[i-1].arr[j].x;  
				};
				linkedListUO[i].arr[j] = { x: unX, y: unY };        
			};      
		};
		linkedListUO[rotCount - 1].nextUO = linkedListUO[0];
		this.UO = linkedListUO[0];
	};
	this.SetUO(rotCount, units);
};

//--------------------------------------------------//
//    PIECE TYPE TEMPLATES                          //
//--------------------------------------------------//
// Templates create a new piece object instance based on
// their color, rotation count, and unit block definitions.
//#region
/// O - Square piece definition
GM.O = function(){
	return new GM.PcObj(
		'rgb(255,232,51)',
		1,                
		[ {x:-1, y: 0},
		  {x: 0, y: 0},
		  {x:-1, y: 1}, 
		  {x: 0, y: 1} ]
	);
};

/// I - Line piece definition
GM.I = function(){
	return new GM.PcObj(
		'rgb(51,255,209)',
		2,  
		[ {x:-2, y: 0},
		  {x:-1, y: 0},
		  {x: 0, y: 0},
		  {x: 1, y: 0} ]
	);
};

/// S - Right facing zigzag piece definition
GM.S = function(){ 
	return new GM.PcObj(
		'rgb(106,255,51)',
		2, 
		[ {x: 0, y: 0},
		  {x: 1, y: 0}, 
		  {x:-1, y: 1},
		  {x: 0, y: 1} ]
	);
};

/// Z - Left facing zigzag piece definition
GM.Z = function(){ 
	return new GM.PcObj(
		'rgb(255,51,83)',
		2,
		[ {x:-1, y: 0},
		  {x: 0, y: 0},
		  {x: 0, y: 1},
		  {x: 1, y: 1} ]
	);
};

/// L - Right facing angle piece definition
GM.L = function(){
	return new GM.PcObj(
		'rgb(255,129,51)',
		4,
		[ {x:-1, y: 0},
		  {x: 0, y: 0},
		  {x: 1, y: 0},
		  {x:-1, y:-1} ]
	);
};

/// J - Left facing angle piece definition
GM.J = function(){
	return new GM.PcObj(
		'rgb(64,100,255)',
		4,
		[ {x:-1, y: 0},
		  {x: 0, y: 0},
		  {x: 1, y: 0},
		  {x: 1, y:-1} ]
	);
};

/// T - Hat shaped piece definition
GM.T = function(){
	return new GM.PcObj(
		'rgb(160,62,255)',
		4,
		[ {x:-1, y: 0},
		  {x: 0, y: 0},
		  {x: 1, y: 0},
		  {x: 0, y:-1} ]
	);
};
//#endregion

//--------------------------------------------------//
//    ACTIVE PIECE CONTROLLER                       //
//--------------------------------------------------//
// Controls the generation, movement, and placement of piece 
// objects. Monitors the current piece and upcoming piece
GM.Pc = {
	/// Current piece, projected Y pos of cur piece  
	Cur: 0, ProjY: 0,
	/// Upcoming pieces
	Upcoming: [0,0,0],
	/// Push upcoming piece to current & randomize new upcoming piece
	Generate: function(){
		/// Push upcoming piece to current and push down other upcomings
		this.Cur = this.Upcoming[0];
		this.Upcoming[0] = this.Upcoming[1];
		this.Upcoming[1] = this.Upcoming[2];    
		/// Check if the player lost
		if(this.Cur !== 0){
			var spawnCollisions = this.CheckCollisions(0,0,0);
			if(spawnCollisions > 0){
				GM.GameOver();
				this.Freeze();
			};
		};
		/// If player is alive, generate random upcoming piece
		if(GM.IsAlive !== 0){
			var randInt = Math.floor(Math.random() * 7);
			switch(randInt){
				case 0: this.Upcoming[2] = GM.O(); break;
				case 1: this.Upcoming[2] = GM.I(); break;
				case 2: this.Upcoming[2] = GM.S(); break;
				case 3: this.Upcoming[2] = GM.Z(); break; 
				case 4: this.Upcoming[2] = GM.L(); break;
				case 5: this.Upcoming[2] = GM.J(); break;
				case 6: this.Upcoming[2] = GM.T(); break;
				default: break;      
			};
			/// If a current piece was set, inform the GM
			if(this.Cur !== 0){
				GM.PieceSpawned();
				Page.Game.IsDirty = true;
			};
			Page.UpcomingA.IsDirty = Page.UpcomingB.IsDirty =
			Page.UpcomingC.IsDirty = true;
		};
	},
	/// Freeze the current piece's position and rotation
	Freeze: function(){
		if(GM.IsAlive){
			var affectedRows = [];    
			for(var i = 0; i < this.Cur.UO.arr.length; i++){
				var staticX = this.Cur.x + this.Cur.UO.arr[i].x,
					staticY = this.Cur.y + this.Cur.UO.arr[i].y;
				if(staticY >= 0 && staticY <= GM.StaticUnits[0].length){
					GM.StaticUnits[staticX][staticY] = this.Cur.color;
				};
				if(affectedRows.indexOf(staticY) < 0){
					affectedRows.push(staticY);
				};
			};
			GM.CheckUnits(affectedRows);
			this.Generate();
		};
	},
	/// Apply gravity to the current piece, checking for collisions
	DoGravity: function(){
		if(this.Cur !== 0){
			var collisions = this.CheckCollisions(0,0,1);
			if(collisions === 0){
				this.Cur.y++;
			}else{
				this.Freeze();
			};
		};
		GM.RefreshTimer();
	},
	/// Attempt to rotate the current piece, returns bool
	TryRotate: function(){
		if(this.Cur !== 0){    
			var collisions = this.CheckCollisions(1,0,0);
			if(collisions === 0){
				this.Cur.Rotate();
				return true;
			};
		};
		return false;
	},
	/// Attempt to move current piece base on given XY, returns bool
	TryMove: function(moveX, moveY){    
		if(this.Cur !== 0){
			var collisions = this.CheckCollisions(0,moveX,moveY);
			if(collisions === 0){
				this.Cur.x += moveX;
				this.Cur.y += moveY;
				if(moveY > 0){
					GM.RefreshTimer();
					GM.ScoreBonus++;
				};
				return true;
			};
		};
		return false;
	},
	/// Attempt to drop the current piece until it collides, returns bool
	TryDrop: function(){ 
		var squaresDropped = 0;
		if(this.Cur !== 0){
			while(this.TryMove(0,1) === true && squaresDropped < 22){
				squaresDropped++;
			};      
		};
		if(squaresDropped > 0){
			GM.ScoreBonus += 2 * squaresDropped;
			this.Freeze();
			return true;
		}else{
			return false;
		};
	},
	/// Attempt to find (and return) projected drop point of current piece
	TryProject: function(){
		var squaresDropped = 0;
		if(this.Cur !== 0){
			while(this.CheckCollisions(0,0,squaresDropped) === 0 &&
				squaresDropped < 22){
				squaresDropped++;
			};
		};
		return squaresDropped - 1;    
	},
	/// Return collision count OR -1 if test piece out of bounds
	CheckCollisions: function(doRot, offsetX, offsetY){
		var unitArr,
			collisionCount = 0;    
		if(doRot === 1){
			unitArr = this.Cur.UO.nextUO.arr;
		}else{
			unitArr = this.Cur.UO.arr;
		};
		for(var i = 0; i < unitArr.length; i++){
			var testX = this.Cur.x + unitArr[i].x + offsetX,
				testY = this.Cur.y + unitArr[i].y + offsetY,
				limitX = GM.StaticUnits.length,
				limitY = GM.StaticUnits[0].length;
			if(testX < 0 || testX >= limitX || testY >= limitY){
				return -1;
			}else if(testY > 0){
				if(GM.StaticUnits[testX][testY] !== 0){
					collisionCount++;
				};
			};
		};
		return collisionCount;
	}
};

//--------------------------------------------------//
//    HELPER FUNCTIONS                              //
//--------------------------------------------------//
function DrawText(text, color, weight, alignment, size, left, top){  
	Page.ctx.font = weight + ' ' + size + 'px "Jura", sans-serif';
	Page.ctx.textAlign = alignment;
	Page.ctx.fillStyle = color;
	Page.ctx.fillText(text, left ,top);  
};

function ColorWithAlpha(color, alpha){
	var retColor = 'rgba' + color.substring(3,color.length - 1);
	retColor += ',' + alpha + ')';
	return retColor;
};


export default memo(WidgetTetris);