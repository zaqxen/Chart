var MakeBarChart = function(d,c,t){
	var enumCount = Object.keys(d).length;
	c.width = (60 * enumCount) + 60;
	c.height = 320;
	var ctx = c.getContext("2d");
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
		ctx.fillRect(upperLeftX,upperLeftY,width,height);
		ctx.restore();
	};
	
	class BarChart {
		constructor(opt) {
			var ChartX = 15; // To adjust the Entire Chart X Axis 
			var ChartY = 10; // To adjust the Entire Chart Y Axis 
			var gridScale = 5; // Default is Divide the max value by 5
			this.opt = opt;
			this.canvas = c;
			this.ctx = c.getContext("2d");
			this.ctx.translate(0.5, 0.5);
			//Chart BackgroundColor START
			//this.ctx.fillStyle = "#F0F0F0"; 
			//this.ctx.fillRect(0, 0, c.width, c.height);
			//Chart BackgroundColor END
			this.draw = function () {
				var TopValue = 0;
				for (var ChartEnum in d) {
					TopValue = Math.max(TopValue, d[ChartEnum]);
				}
				if (TopValue >= 7) // This adjust the gridScale that it won't create excessive Y values 
				{
					gridScale = TopValue / 7; //(Max is 8 including the base line zero 0)
				}
				TopValue = TopValue + (TopValue % gridScale);
				var ChartHeight = this.canvas.height - this.opt.padding * 2 - ChartY;
				var ChartWidth = this.canvas.width - this.opt.padding * 2 + ChartX;
				//drawing the grid lines
				var gridValue = 0;
				var lineColor = this.opt.gridColor;
				var alt = true;
				this.ctx.save();
				while (gridValue <= TopValue) {
					var gridY = Math.floor(ChartHeight * (1 - gridValue / TopValue) + this.opt.padding);
					if (gridValue == 0)
						lineColor = "#000";
					else if (alt)
						lineColor = "#777";
					else
						lineColor = "#CCC";
					alt = !alt;
					drawLine(this.ctx, 20 + ChartX, gridY, this.canvas.width - 30 + ChartX, gridY, lineColor);
					//writing grid markers (numbers on left side)
					this.ctx.fillStyle = "#787878";
					this.ctx.font = "bold 10px Arial";
					var gridLabel = nShort(Math.floor(gridValue));
					this.ctx.textAlign = "right";
					this.ctx.fillText(gridLabel, ChartX + 17, gridY + 2);
					gridValue += gridScale;
				}
				this.ctx.restore();
				//drawing the bars
				var barIndex = 0;
				var numberOfBars = Object.keys(d).length;
				var barWidth = (ChartWidth) / numberOfBars;
				for (ChartEnum in d) {
					var val = d[ChartEnum];
					var barHeight = Math.round(ChartHeight * val / TopValue);
					var x = this.opt.padding + barIndex * barWidth;
					var y = this.canvas.height - barHeight - this.opt.padding - ChartY;
					drawBar(this.ctx, x + ChartX, y, barWidth - 20, barHeight, 'rgba(0, 50, 255, 0.7)');
					x = x + 20 + ChartX;
					// Label on each bottom of the Bar
					this.ctx.restore();
					this.ctx.fillStyle = "#000000";
					this.ctx.font = "normal 10px Arial";
					this.ctx.textAlign = "center";
					if (ChartEnum.indexOf(" ") > 1) {
						var LabelArray = ChartEnum.split(' ');
						var label_y = this.canvas.height - 15 - ChartY;
						for (var i = 0; i < LabelArray.length; i++) {
							this.ctx.fillText(LabelArray[i], x, label_y);
							label_y = label_y + 10;
						}
					}
					else {
						this.ctx.fillText(ChartEnum, x, this.canvas.height - 15 - ChartY);
					}
					// Number Value on Each Bar
					x = x - 10;
					this.ctx.font = "normal 11px Arial";
					this.ctx.textAlign = "center";
					if (barHeight <= 24) {
						this.ctx.fillStyle = "rgba(0, 0, 255, 0.6)";
						this.ctx.fillText(val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","), x + 10, y - 5);
					}
					else {
						this.ctx.fillStyle = "#FFFFFF";
						if (val >= 100000) { // Writes the Values Vertically since it will not fit the container
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
			{ value: 1, symbol: "" },
			{ value: 1E3, symbol: "K" },
			{ value: 1E6, symbol: "M" },
			{ value: 1E9, symbol: "B" },
			{ value: 1E12, symbol: "T" },
			{ value: 1E15, symbol: "Q" },
			{ value: 1E18, symbol: "P" }
		];
		var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
		var i;
		for (i = si.length - 1; i > 0; i--) {
			if (num >= si[i].value) {
				break;
			}
		}
		return (num / si[i].value).toFixed(0).replace(rx, "$1") + si[i].symbol;
	}
	
	new BarChart({
			padding:35
		}).draw();
}