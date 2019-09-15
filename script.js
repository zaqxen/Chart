	var myCanvas = document.getElementById("myCanvas");
	myCanvas.width = 600;
	myCanvas.height = 300;
	var ctx = myCanvas.getContext("2d");
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
		this.options = options;
		this.canvas = options.canvas;
		this.ctx = this.canvas.getContext("2d");
		this.ctx.fillStyle = "#FFFFFF";
		this.ctx.fillRect(0, 0, myCanvas.width, myCanvas.height);
		//this.colors = options.colors;
		this.draw = function(){
			var maxValue = 0;
			for (var categ in this.options.data){
				maxValue = Math.max(maxValue,this.options.data[categ]);
			}
			maxValue = maxValue + (maxValue % this.options.gridScale);
			var canvasActualHeight = this.canvas.height - this.options.padding * 2;
			var canvasActualWidth = this.canvas.width - this.options.padding * 2;
			//drawing the grid lines
			var gridValue = 0;
			var lineColor = this.options.gridColor;
			var alternating = true;
			while (gridValue <= maxValue){
				var gridY = canvasActualHeight * (1 - gridValue/maxValue) + this.options.padding;
				if( gridValue == 0)
					lineColor = "#333333";
				else if(alternating)
					lineColor = "#CCCCCC";
				else
					lineColor = this.options.gridColor;
				alternating = !alternating;
				drawLine(
					this.ctx,
					0,
					gridY,
					this.canvas.width,
					gridY,
					lineColor
				);
				//writing grid markers
				this.ctx.save();
				this.ctx.fillStyle = "#888888";
				this.ctx.font = "bold 10px Arial";
				this.ctx.fillText(gridValue, 5,gridY - 4);
				this.ctx.restore();
				gridValue+=this.options.gridScale;
			}
			//drawing the bars
			var barIndex = 0;
			var numberOfBars = Object.keys(this.options.data).length;
			var barSize = (canvasActualWidth)/numberOfBars;
			for (categ in this.options.data){
				var val = this.options.data[categ];
				var barHeight = Math.round( canvasActualHeight * val/maxValue) ;
				var x = this.options.padding + barIndex * barSize;
				var y = this.canvas.height - barHeight - this.options.padding;
				drawBar(
					this.ctx,
					x,
					y,
					barSize - 20,
					barHeight,
					'rgba(0, 0, 255, 0.5)'
				);
	
				x = x + 20;
				// Label on each bottom of the Bar
				this.ctx.restore();
				this.ctx.fillStyle = "#000000";
				this.ctx.font = "normal 10px Arial";
				this.ctx.textAlign = "center";
				if(categ.indexOf(" ") > 1)
				{
					var LabelArray = categ.split(' ');
	
					var label_y = this.canvas.height - 15;
					for(var i = 0; i < LabelArray.length; i++)
					{
						this.ctx.fillText(LabelArray[i], x, label_y);
						label_y = label_y + 10;
					}
				}
				else
				{
					this.ctx.fillText(categ, x, this.canvas.height - 15 );
				}
				
				// Number Value on Each Bar
				x = x - 10;
				this.ctx.restore();
				this.ctx.font = "normal 11px Arial";
				this.ctx.textAlign = "center";
				if( barHeight <= 24){
					this.ctx.fillStyle = "rgba(0, 0, 255, 0.6)";
					this.ctx.fillText(val, x + 10, y - 5 );
				}
				else{
					this.ctx.fillStyle = "#FFFFFF";
					this.ctx.fillText(val, x + 10, y + 15 );
				}
				this.ctx.restore();
				barIndex++;
			}
			//drawing series name
			this.ctx.save();
			this.ctx.textBaseline="bottom";
			this.ctx.textAlign="center";
			this.ctx.fillStyle = "#000000";
			this.ctx.font = "bold 12px Arial";
			this.ctx.fillText(this.options.seriesName, this.canvas.width/2,25);
			this.ctx.restore();
		}
	}
	var myBarchart = new Barchart(
        {
            canvas:myCanvas,
            seriesName:"Test Data",
            padding:1000,
            gridColor:"#EBEBEB",
            data:myVinyls
        }
        );
	myBarchart.draw();
