var MakePieChart = function(d,c,t){
	var ctx = c.getContext("2d");
	var CenterX = ctx.canvas.width /2;
	var CenterY = ctx.canvas.height /2;
	var CircleRadius = (CenterY /2) - 25;
	if(!t || t == ""){
		CircleRadius = (CenterY /2) - 18;
	}
	else
		CenterY = CenterY + 12;

	ctx.lineWidth = CircleRadius * 2;

	var lastPostionOfSlice = 0;
	var RemainingSlices = 2;
	var ColorIndex = 0;
	var Palettes = new Array("#3366CC","#DC3912","#FF9900","#109618","#990099","#3B3EAC","#0099C6","#DD4477","#66AA00","#B82E2E","#316395","#994499","#22AA99","#AAAA11","#6633CC","#E67300","#8B0707","#329262","#5574A6","#3B3EAC");
	//Bright var Palettes = new Array("#008000", "#0000FF", "#800080", "#00FF00", "#FF00FF", "#008080", "#FFFF00", "#808080", "#00FFFF", "#000080", "#800000", "#FF0000", "#808000", "#C0C0C0", "#FF6347", "#FFE4B5"
	//Grayscale var Palettes = new Array("#C8C8C8", "#BDBDBD", "#B2B2B2", "#A7A7A7", "#9C9C9C", "#919191", "#868686", "#7B7B7B", "#707070", "#656565", "#5A5A5A", "#4F4F4F", "#444444", "#393939", "#2E2E2E", "#232323"
	//Excel var Palettes = new Array("#9999FF", "#993366", "#FFFFCC", "#CCFFFF", "#660066", "#FF8080", "#0066CC", "#CCCCFF", "#000080", "#FF00FF", "#FFFF00", "#00FFFF", "#800080", "#800000", "#008080", "#0000FF"
	//Light var Palettes = new Array("#E6E6FA", "#FFF0F5", "#FFDAB9", "#FFFACD", "#FFE4E1", "#F0FFF0", "#F0F8FF", "#F5F5F5", "#FAEBD7", "#E0FFFF"
	//Pastel var Palettes = new Array("#87CEEB", "#32CD32", "#BA55D3", "#F08080", "#4682B4", "#9ACD32", "#40E0D0", "#FF69B4", "#F0E68C", "#D2B48C", "#8FBC8B", "#6495ED", "#DDA0DD", "#5F9EA0", "#FFDAB9", "#FFA07A"
	//EarthTones var Palettes = new Array("#FF8000", "#B8860B", "#C04000", "#6B8E23", "#CD853F", "#C0C000", "#228B22", "#D2691E", "#808000", "#20B2AA", "#F4A460", "#00C000", "#8FBC8B", "#B22222", "#8B4513", "#C00000"
	//SemiTransparent var Palettes = new Array("#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#00FFFF", "#FF00FF", "#AA7814", "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#00FFFF", "#FF00FF", "#AA7814", "#647832", "#285A96"
	//Berry var Palettes = new Array("#8A2BE2", "#BA55D3", "#4169E1", "#C71585", "#0000FF", "#8A2BE2", "#DA70D6", "#7B68EE", "#C000C0", "#0000CD", "#800080"
	//Chocolate var Palettes = new Array("#A0522D", "#D2691E", "#8B0000", "#CD853F", "#A52A2A", "#F4A460", "#8B4513", "#C04000", "#B22222", "#B65C3A"
	//Fire var Palettes = new Array("#FFD700", "#FF0000", "#FF1493", "#DC143C", "#FF8C00", "#FF00FF", "#FFFF00", "#FF4500", "#C71585", "#DDE221"
	//SeaGreen var Palettes = new Array("#2E8B57", "#66CDAA", "#4682B4", "#008B8B", "#5F9EA0", "#3CB371", "#48D1CC", "#B0C4DE", "#8FBC8B", "#87CEEB"
	//BrightPastel var Palettes = new Array("#418CF0", "#FCB441", "#E0400A", "#056492", "#BFBFBF", "#1A3B69", "#FFE382", "#129CDD", "#CA6B4B", "#005CDB", "#F3D288", "#506381", "#F1B9A8", "#E0830A", "#7893BE"

	function DrawPieSlice(sizeOfSlice, label, value, opt)
	{
		RemainingSlices = RemainingSlices - sizeOfSlice;
		var StartingAngle = lastPostionOfSlice; 
		var EndingAngle = RemainingSlices * Math.PI;
		var thePoint;
	
		if(ColorIndex == 0){ //Drop Shadow full Chart
			ctx.save();
			ctx.shadowOffsetX = 2;
			ctx.shadowOffsetY = 1;
			ctx.shadowColor = "#333";
			ctx.shadowBlur = 5;
			ctx.beginPath();
			ctx.arc(CenterX, CenterY, CircleRadius, 0, 2 * Math.PI);
			ctx.stroke();
			ctx.restore();
		}
	
		ctx.strokeStyle = Palettes[ColorIndex];
		ctx.beginPath();
		ctx.arc(CenterX, CenterY, CircleRadius, StartingAngle, EndingAngle, true);
		ctx.stroke();
	
		ctx.save();
		ctx.textAlign = "center";
		ctx.shadowOffsetX = 0;
		ctx.shadowOffsetY = 0;
		ctx.shadowColor = "#000";
		ctx.shadowBlur = 5;
	
		// Writing the Text Labels
		ctx.font = "normal 11px sans-serif";
		var LabelPoint = (RemainingSlices + (sizeOfSlice/2)) * Math.PI;
		if(!label) label = "";

		var cValue = value;
		if(!opt.hidePercent){
			cValue = (sizeOfSlice * 100).toFixed(1) + "% " + value;
		}
		if(opt.showData == false){ 
			cValue = (sizeOfSlice * 100).toFixed(1) + "%";
		}
		if((sizeOfSlice * 100) < 20){
			ctx.fillStyle=Palettes[ColorIndex];
			ctx.shadowColor = "#FFF";
			ctx.shadowBlur = 3;
			thePoint=PinPoint(CenterX,CenterY,ctx.lineWidth + 30,LabelPoint);

			if (label.indexOf(" ") > 1) {
				var LabelSplit = label.split(' ');
				if(opt.hideLabel == false){ 
					var label_y = thePoint.y + 12;
					for (var i = 0; i < LabelSplit.length; i++) {
						ctx.fillText(LabelSplit[i],thePoint.x,label_y);
						label_y = label_y + 10; // Move the next word to newline
					}
				}
				ctx.fillText(cValue,thePoint.x,thePoint.y);
			}
			else {
				if(opt.hideLabel == false){
					ctx.fillText( label,thePoint.x,thePoint.y);
					ctx.font = "normal 10px sans-serif";
					ctx.fillText(cValue,thePoint.x,thePoint.y - 12);
				}
				else{
					ctx.fillText(cValue,thePoint.x,thePoint.y);
				}
			}
		}
		else{
			ctx.fillStyle="white";
			thePoint=PinPoint(CenterX,CenterY,(ctx.lineWidth - 38),LabelPoint);
			if(opt.hideLabel == false){
				ctx.fillText( label,thePoint.x,thePoint.y);
				ctx.font = "normal 10px sans-serif";
				ctx.fillText(cValue ,thePoint.x,thePoint.y - 12);
			}
			else{
				ctx.fillText(cValue,thePoint.x,thePoint.y);
			}
		}

		if(opt.showlLegend){
			var LegendXPosition = (CenterX * 2) + 5;
			var LegendYPosition = (ColorIndex * 15) + 80;
			ctx.shadowBlur = 0;
			ctx.shadowColor = "";
			ctx.fillStyle=Palettes[ColorIndex];
			ctx.fillRect(LegendXPosition + 10,LegendYPosition,20,10);
			ctx.fillStyle="black";
			ctx.font = "normal 10px sans-serif";
			ctx.textAlign = "left";
			ctx.fillText(label,LegendXPosition + 35,LegendYPosition + 9);
		}
		ctx.restore();
	
		lastPostionOfSlice = EndingAngle;
		ColorIndex = ColorIndex + 1;
	}
	
	function PinPoint(cx,cy,radius,radianAngle){
		var x=cx+radius*Math.cos(radianAngle);
		var y=cy+radius*Math.sin(radianAngle);
		return({x:x,y:y});
	}

	class PieChart {
		constructor(opt) {
			this.opt = opt;
			this.canvas = c;
			this.ctx = c.getContext("2d");
			this.ctx.translate(0.5, 0.5);
			if(this.opt.showlLegend)
			{
				CenterX = CenterY - 20;
			}
			//Chart BackgroundColor START
			this.ctx.fillStyle = "rgba(150, 150, 150, 0.1)"; 
			this.ctx.fillRect(0, 0, c.width, c.height);
			
			//Chart BackgroundColor END
			this.draw = function () {
				var TotalPie = 0;
				for (var ChartEnum in d) {
					TotalPie = TotalPie + d[ChartEnum];
				}
				
				//drawing the Pie Slices
				for (ChartEnum in d) {
					var val = d[ChartEnum];
					var Slice =  ((val / TotalPie) * 100).toFixed(2);
					Slice = (2 * Slice / 100);
					DrawPieSlice(Slice,ChartEnum,nShort(val) , this.opt);
				}
				//drawing chart Title
				this.ctx.save();
				this.ctx.textBaseline = "bottom";
				this.ctx.textAlign = "center";
				this.ctx.fillStyle = "#000000";
				this.ctx.font = "bold 12px Arial";
				this.ctx.fillText(t, this.canvas.width / 2, 25);
				this.ctx.restore();
			};

			
		}
	}
	
	function nShort(num) {
		var si = [
			{ v: 1, s: "" },
			{ v: 1E3, s: "K" },
			{ v: 1E6, s: "M" },
			{ v: 1E9, s: "B" },
			{ v: 1E12, s: "T" },
			{ v: 1E15, s: "Q" },
			{ v: 1E18, s: "P" }
		];
		var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
		var i;
		for (i = si.length - 1; i > 0; i--) {
			if (num >= si[i].v) {
				break;
			}
		}
		return (num / si[i].v).toFixed(0).replace(rx, "$1") + si[i].s;
	}
	
	new PieChart({
		showData:false,
		hidePercent:true,
		hideLabel:true,
		showlLegend:true
	}).draw();
}