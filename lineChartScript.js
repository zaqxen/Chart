var MakeLineChart = function(d,c,t){
	var enumCount = Object.keys(d).length;
	c.width = (60 * enumCount) + 65;
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
	
	class LineChart {
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
						lineColor = "#AAA";
					else
						lineColor = "#DDD";
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
				//drawing the line
				var barIndex = 0;
				var numberOfBars = Object.keys(d).length;
				var barWidth = (ChartWidth) / numberOfBars;
				var curX = 0;
				var curY = 0;
				for (ChartEnum in d) {
					var val = d[ChartEnum];
					var barHeight = Math.round(ChartHeight * val / TopValue);
					var x = this.opt.padding + barIndex * barWidth;
					var y = this.canvas.height - barHeight - this.opt.padding - ChartY;
					
					if(curY == 0) curY = y;
					if(curX ==0) curX = x + ChartX;

					this.ctx.save();
					this.ctx.lineWidth = 2;
					drawLine(this.ctx, curX, curY, x + ChartX, y, 'rgba(0, 50, 255, 0.4)')
					
					curX = x + ChartX;
					curY = y;

					//drawing the Point Circle
					this.ctx.save();
					//this.ctx.strokeStyle = 'rgba(0, 50, 255, 0.8)';
					this.ctx.strokeStyle = '#DC4C3F';
					this.ctx.lineWidth = 3;
					this.ctx.beginPath();
					this.ctx.arc(curX, curY, 2, 2, 3 * Math.PI);
					this.ctx.stroke();

					x = x + 20 + ChartX;
					// Label on each line
					this.ctx.restore();
					this.ctx.fillStyle = "#000000";
					this.ctx.font = "normal 10px Arial";
					this.ctx.textAlign = "center";
					if (ChartEnum.indexOf(" ") > 1) {
						var LabelArray = ChartEnum.split(' ');
						var label_y = this.canvas.height - 15 - ChartY;
						for (var i = 0; i < LabelArray.length; i++) {
							this.ctx.fillText(LabelArray[i], x - 21, label_y);
							label_y = label_y + 10;
						}
					}
					else {
						this.ctx.fillText(ChartEnum, x - 21, this.canvas.height - 15 - ChartY);
					}

					// Dotted Line
					this.ctx.save();
					this.ctx.lineWidth = 1;
					this.ctx.setLineDash([3, 3]);/*Dash width and spaces between dashes.*/
					drawLine(this.ctx, curX, curY, curX, this.canvas.height - this.opt.padding - ChartY, 'rgba(5, 5, 5, 0.3)')
					this.ctx.restore();

					// Number Value on Each Line
					x = x - 10;
					this.ctx.save();
					this.ctx.font = "bold 11px Arial";
					this.ctx.textAlign = "center";
					this.ctx.fillStyle = "black";
					this.ctx.shadowOffsetX = 0;
					this.ctx.shadowOffsetY = 0;
					this.ctx.shadowColor = "#AAA";
					this.ctx.shadowBlur = 3;
					this.ctx.fillText(val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","), curX + 	0, curY - 8);
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
	
	new LineChart({
			padding:35
		}).draw();
}