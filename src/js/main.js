//*************************************
// Dirty code as i use to do :o 
//*************************************
var AllWet = function(containerId, elemsClass){
	this.container = $("#"+containerId);
	this.elems = $("#"+containerId).find("."+elemsClass);
	this.UIInitiated = false;
	this.soundEnabled = true;
	this.map = [];
	this.isWinnable = false;
	this.UIEnabled = true;
	/**************************   INITS    **************************/
	this.init = function(){
		this.initMap();
		this.initUI();
		this.isWin();
	}
	this.initMap = function(){
		for(var h = 0; h < 4; h++)
			for(var v = 0; v < 4; v++){
				if(typeof this.map[h] == "undefined") this.map[h] = [];
				if(h+v != 6){ //if its not last empty case
					var elem = $(".h"+(h+1)+".v"+(v+1));
					elem.attr("data-x",v+1);
					elem.attr("data-y",h+1);
					this.map[h][v] = elem;
				}
				else
					this.map[h][v] = null;
			}
	}
	this.initUI = function(){
		var that = this;
		if(!this.UIInitiated) this.UIInitiated = true;
		this.elems.mouseover(function(e){
			if(that.soundEnabled){
				var num = Math.floor(Math.random()*2)+1; // 1 or 2
				that.playSound("sounds/rollover"+num+".wav")
			}
		});
		this.playSound = function(uri){
			var s = new Audio(uri);
			s.volume = 0.2;
			s.play();
		}
		this.elems.click(function(e){
			e.preventDefault();
			e.stopPropagation();
			if(that.UIEnabled && that.canMove($(this))){
				var move = that.canMove($(this));
				that.map[parseInt($(this).attr("data-x"))-1][parseInt($(this).attr("data-y"))-1] = null;
				$(this).attr("data-x",move.x+1)
					   .attr("data-y",move.y+1)
					   .css({
					   		top: move.y*25+"%",
					   		left: move.x*25+"%"
					   });
				that.map[move.x][move.y] = $(this);
				if(that.soundEnabled){
					var num = Math.floor(Math.random()*9)+1; // 1 or 2
					that.playSound("sounds/"+num+".wav")
				}
				if(that.isWinnable && that.isWin()){
					that.UIEnabled = false;
					that.container.addClass("win");
					that.playSound("sounds/victory.wav")
					setTimeout(function(){
						that.container.removeClass("win");
						that.UIEnabled = true;
						that.isWinnable = false;
					},7000);
				}
			}
		});
	}
	/**************************   UTILS    **************************/
	this.isWin = function(){
		var win = true;
		$.each(this.elems, function(i,elem){
			if(!$(elem).hasClass("v"+$(elem).attr("data-x")) ||
			   !$(elem).hasClass("h"+$(elem).attr("data-y")))
					return win = false;
		});
		return win;
	}
	this.shuffle = function(){
		this.soundEnabled = false;
		for(var i = 0; i< Math.floor(Math.random()*50)+50; i++)
			this.getRandomMovableTiles().click();
		this.isWinnable = true;
		this.soundEnabled = true;
	}
	this.getRandomMovableTiles = function(){
		var movables = this.getMovableTiles();
		return movables[Math.floor(Math.random()*movables.length)];
	}
	this.getMovableTiles = function(){
		var that = this;
		var movables = [];
		$.each(this.elems, function(i,elem){
			if(that.canMove($(elem)) != false) movables.push($(elem));
		});
		return movables;
	}
	this.canMove = function(elem){
		var x = elem.attr("data-x")-1;
		var y = elem.attr("data-y")-1;
		if(this.getElemByCoord(x,y+1) === null)
			return {x: x, y: y+1}
		if(this.getElemByCoord(x,y-1) === null)
			return {x: x, y: y-1}
		if(this.getElemByCoord(x+1,y) === null)
			return {x: x+1, y: y}
		if(this.getElemByCoord(x-1,y) === null)
			return {x: x-1, y: y}
		return false;
	}
	this.getEmptyTile = function(){
		for(var h = 0; h < 4; h++)
			for(var v = 0; v < 4; v++)
				if(this.map[h][v] == null) return [h,v];
		return "error";
	}
	this.getElemByCoord = function(x,y){
		if(x<0 || y<0) return undefined;
		if(typeof this.map[x] == "undefined") return undefined;
		return this.map[x][y];
	}
	this.init();
}
jQuery(function($){
	new AllWet("game","tile");
	console.log("Looking under the hood? Source code here boiz: https://github.com/Leoche/All-Wet-Game-Mr-oizo")
});