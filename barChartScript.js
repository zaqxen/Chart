var MakeChart = function(cData,hCanvas,cTitle){
	var enumCount = Object.keys(cData).length;
	hCanvas.width = (60 * enumCount) + 60;
	hCanvas.height = 320;
	var ctx = hCanvas.getContext("2d");
	function drawLine(ctx, startX, startY, endX, endY,color){
		ctx.save();
		ctx.strokeStyle = color;
		ctx.beginPath();
		ctx.moveTo(startX,startY);
		ctx.lineTo(endX,endY);
		ctx.stroke();
		ctx.restore();
	}
	function drawBar(ctx, upperLeftCornerX, upperLeftCornerY, width, height,color){
		ctx.save();
		ctx.fillStyle=color;
		ctx.fillRect(upperLeftCornerX,upperLeftCornerY,width,height);
		ctx.restore();
	};
	
	var Barchart = function(options){
	var ChartXPosition = 15; // To adjust the Entire Chart X Axis 
	var ChartYPosition = 10; // To adjust the Entire Chart Y Axis 
	var gridScale = 5; // Default is Divide the max value by 5
	this.options = options;
	this.canvas = options.canvas;
	this.ctx = this.canvas.getContext("2d");
	this.ctx.translate(0.5, 0.5);
		//Chart BackgroundColor START
		//this.ctx.fillStyle = "#F0F0F0"; 
		//this.ctx.fillRect(0, 0, hCanvas.width, hCanvas.height);
		//Chart BackgroundColor END
		//this.colors = options.colors;
		this.draw = function(){
			var maxValue = 0;
			for (var categ in this.options.data){
				maxValue = Math.max(maxValue,this.options.data[categ]);
		}
	
		if( maxValue >= 7) // This adjust the gridScale that it won't create excessive Y values 
		{
		gridScale = maxValue / 7; //(Max is 8 including the base line zero 0)
		}
		maxValue = maxValue + (maxValue % gridScale);
		
			var canvasActualHeight = this.canvas.height - this.options.padding * 2 - ChartYPosition;
			var canvasActualWidth = this.canvas.width - this.options.padding * 2 + ChartXPosition;
			//drawing the grid lines
			var gridValue = 0;
			var lineColor = this.options.gridColor;
		var alternating = true;
		this.ctx.save();
			while (gridValue <= maxValue){
		var gridY = Math.floor(canvasActualHeight * (1 - gridValue/maxValue) + this.options.padding);
		if( gridValue == 0) lineColor = "#000";
				else if(alternating) lineColor = "#777";
				else lineColor = "#CCC";
		alternating = !alternating;
				drawLine(
					this.ctx,
					20 + ChartXPosition,
					gridY,
					this.canvas.width - 30 + ChartXPosition,
					gridY,
					lineColor
				);
				//writing grid markers
				
				this.ctx.fillStyle = "#787878";
		this.ctx.font = "bold 10px Arial";
		var gridLabel = nFormat(Math.floor(gridValue));
		this.ctx.textAlign = "right";
				this.ctx.fillText(gridLabel, ChartXPosition + 17,gridY + 2);
				gridValue+=gridScale;
		}
		this.ctx.restore();
			//drawing the bars
			var barIndex = 0;
			var numberOfBars = Object.keys(this.options.data).length;
			var barSize = (canvasActualWidth)/numberOfBars;
			for (categ in this.options.data){
				var val = this.options.data[categ];
				var barHeight = Math.round( canvasActualHeight * val/maxValue) ;
				var x = this.options.padding + barIndex * barSize;
				var y = this.canvas.height - barHeight - this.options.padding - ChartYPosition;
				drawBar(
					this.ctx,
					x + ChartXPosition,
					y,
					barSize - 20,
					barHeight,
					'rgba(0, 50, 255, 0.7)'
				);
	
				x = x + 20 + ChartXPosition;
				// Label on each bottom of the Bar
				this.ctx.restore();
				this.ctx.fillStyle = "#000000";
				this.ctx.font = "normal 10px Arial";
				this.ctx.textAlign = "center";
				if(categ.indexOf(" ") > 1)
				{
					var LabelArray = categ.split(' ');
					var label_y = this.canvas.height - 15 - ChartYPosition;
					for(var i = 0; i < LabelArray.length; i++)
					{
						this.ctx.fillText(LabelArray[i], x, label_y);
						label_y = label_y + 10;
					}
				}
				else
				{
					this.ctx.fillText(categ, x, this.canvas.height - 15 - ChartYPosition);
				}
				
				// Number Value on Each Bar
				x = x - 10;
				this.ctx.font = "normal 11px Arial";
				this.ctx.textAlign = "center";
				if( barHeight <= 24){
					this.ctx.fillStyle = "rgba(0, 0, 255, 0.6)";
					this.ctx.fillText(val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","), x + 10, y - 5 );
				}
				else{
					this.ctx.fillStyle = "#FFFFFF";
					if(val >= 100000){ // Writes the Values Vertically since it will not fit the container
						this.ctx.save();
						ctx.textBaseline = "bottom";
						this.ctx.translate(0, 0);
						this.ctx.rotate(Math.PI / 2);
						this.ctx.fillText(val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","), y + 32, -x - 5 );
						this.ctx.restore();
					}
					else{
						this.ctx.fillText(val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","), x + 10, y + 15 );
					}
				}
				this.ctx.restore();
				barIndex++;
			}
		//drawing chart Title
			this.ctx.save();
			this.ctx.textBaseline="bottom";
			this.ctx.textAlign="center";
			this.ctx.fillStyle = "#000000";
			this.ctx.font = "bold 12px Arial";
			this.ctx.fillText(this.options.chartTitle, this.canvas.width/2,25);
			this.ctx.restore();
		}
	}
	
	function nFormat(num) {
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
	
	new Barchart(
		{
			canvas:hCanvas,
			chartTitle:cTitle,
			padding:35,
			data:cData
		}).draw();
	}