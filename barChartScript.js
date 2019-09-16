var MakeBarChart = function(d,c,t){
	var enumCount = Object.keys(d).length;
	c.width = (60 * enumCount) + 60;
	c.height = 320;
	function drawLine(ctx, startX, startY, endX, endY,color){
		ctx.save();
		ctx.strokeStyle = color;
		ctx.beginPath();
		ctx.moveTo(startX,startY);
		ctx.lineTo(endX,endY);
		ctx.stroke();
		ctx.restore();
	}
	function drawBar(ctx, upperLeftX, upperLeftY, width, height,color){
		ctx.save();
		ctx.fillStyle=color;
		ctx.shadowOffsetX = 2;
		ctx.shadowOffsetY = -1;
		ctx.shadowColor = "#777";
		ctx.shadowBlur = 3;
		ctx.fillRect(upperLeftX,upperLeftY,width,height);
		ctx.restore();
	};
	
	class BarChart {
		constructor(opt) {
			var ChartX = 15; // To adjust the Entire Chart X Axis 
			var ChartY = 10; // To adjust the Entire Chart Y Axis 
			var gridScale = 5; // Default is Divide the max v by 5
			this.opt = opt;
			this.canvas = c;
			this.ctx = c.getContext("2d");
			this.ctx.translate(0.5, 0.5);
			//Chart BackgroundColor START
			this.ctx.fillStyle = "rgba(150, 150, 150, 0.1)"; 
			this.ctx.fillRect(0, 0, c.width, c.height);
			//Chart BackgroundColor END
			this.draw = function () {
				var Topv = 0;
				for (var ChartEnum in d) {
					Topv = Math.max(Topv, d[ChartEnum]);
				}
				if (Topv >= 7) // This adjust the gridScale that it won't create excessive Y vs 
				{
					gridScale = Topv / 7; //(Max is 8 including the base line zero 0)
				}
				Topv = Topv + (Topv % gridScale);
				var ChartHeight = this.canvas.height - this.opt.padding * 2 - ChartY;
				var ChartWidth = this.canvas.width - this.opt.padding * 2 + ChartX;
				//drawing the grid lines
				var gridv = 0;
				var lineColor = this.opt.gridColor;
				var alt = true;
				this.ctx.save();
				while (gridv <= Topv) {
					var gridY = Math.floor(ChartHeight * (1 - gridv / Topv) + this.opt.padding);
					if (gridv == 0)
						lineColor = "#000";
					else if (alt)
						lineColor = "#AAA";
					else
						lineColor = "#DDD";
					alt = !alt;
					drawLine(this.ctx, 20 + ChartX, gridY, this.canvas.width - 30 + ChartX, gridY, lineColor);
					//writing grid markers (numbers on left side)
					this.ctx.fillStyle = "#787878";
					this.ctx.font = "bold 10px Arial";
					var gridLabel = nShort(Math.floor(gridv));
					this.ctx.textAlign = "right";
					this.ctx.fillText(gridLabel, ChartX + 17, gridY + 2);
					gridv += gridScale;
				}
				this.ctx.restore();
				//drawing the bars
				var barIndex = 0;
				var numberOfBars = Object.keys(d).length;
				var barWidth = (ChartWidth) / numberOfBars;
				for (ChartEnum in d) {
					var val = d[ChartEnum];
					var barHeight = Math.round(ChartHeight * val / Topv);
					var x = this.opt.padding + barIndex * barWidth;
					var y = this.canvas.height - barHeight - this.opt.padding - ChartY;
					drawBar(this.ctx, x + ChartX, y, barWidth - 20, barHeight, 'rgba(0, 50, 255, 1)');
					x = x + 20 + ChartX;
					// Label on each bottom of the Bar
					this.ctx.restore();
					this.ctx.fillStyle = "#000000";
					this.ctx.font = "normal 10px Arial";
					this.ctx.textAlign = "center";
					if (ChartEnum.indexOf(" ") > 1) {
						var LabelArray = ChartEnum.split(' ');
						var label_y = this.canvas.height - 20 - ChartY;
						for (var i = 0; i < LabelArray.length; i++) {
							this.ctx.fillText(LabelArray[i], x, label_y);
							label_y = label_y + 10;
						}
					}
					else {
						this.ctx.fillText(ChartEnum, x, this.canvas.height - 20 - ChartY);
					}
					// Number v on Each Bar
					x = x - 10;
					this.ctx.font = "normal 11px Arial";
					this.ctx.textAlign = "center";
					if (barHeight <= 24) {
						this.ctx.fillStyle = "rgba(0, 0, 255, 0.6)";
						this.ctx.fillText(val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","), x + 10, y - 5);
					}
					else {
						this.ctx.fillStyle = "#FFFFFF";
						if (val >= 100000) { // Writes the vs Vertically since it will not fit the container
							this.ctx.save();
							ctx.textBaseline = "bottom";
							this.ctx.translate(0, 0);
							this.ctx.rotate(Math.PI / 2);
							this.ctx.fillText(val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","), y + 32, -x - 5);
							this.ctx.restore();
						}
						else {
							this.ctx.fillText(val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","), x + 10, y + 15);
						}
					}
					this.ctx.restore();
					barIndex++;
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
	
	new BarChart({
			padding:35
		}).draw();
}