class GameofLife {
    
    constructor (width, height) {
        this.canvas = new Canvas();
        this.canvas.canvas.addEventListener("click", event => this.mouseClick(event));
        this.LastExecute = Date.now();
        this.colorAlive = "#4f4c4c" ;
        this.BoardSize = {
            Width: width, 
            Height: height
        };
        this.CellSize = {
            Width : this.canvas.width / width,
            Height : this.canvas.height / height
        };



        this.Cells = [];
        this.startCells();
        this.startNears();


    }
    
    mouseClick(event) {
            
        let canvas = game.canvas.canvas;
        let rect = canvas.getBoundingClientRect();
        
        let canvasSpaceX = (event.clientX - rect.left)
        let canvasSpaceY = (event.clientY - rect.top)
        
        let canvasPScaleX = (rect.right - rect.left)
        let canvasPScaleY = (rect.bottom - rect.top)
        
        let mX = canvasSpaceX / canvasPScaleX * this.canvas.width
        let mY = canvasSpaceY / canvasPScaleY * this.canvas.height
        
        let x = Math.trunc(mX / this.CellSize.Width)
        let y = Math.trunc(mY / this.CellSize.Height)
            
        console.log({x,y})

        let cell = this.Cells[y][x]

        cell.alive = +(!cell.alive)
    
        game.renderCell(cell)
        
    }  

    

    startCells(){
        for (var y = 0; y < this.BoardSize.Height; y++) {

            let line = [];
            this.Cells.push(line);
            for (var x = 0; x < this.BoardSize.Width; x++){
                let cell = {
                    alive: 0,
                    x: x * this.CellSize.Width ,
                    y: y * this.CellSize.Height,
                    next: 0
                };
                line.push(cell);

            }

            
        }
    }


    startNears(){
        this.Cells.forEach((line,y) => {
            
            line.forEach((cell, x) => {
               cell.nears = [];
                for (var dy = -1 ; dy <= 1; dy++) {
                    for(var dx = -1; dx <= 1; dx++){
                        
                        if(dx !== 0 || dy !==0){
                        let vx = x + dx;
                        let vy = y + dy;
                        if(vx >= 0 && vx < this.BoardSize.Width && vy >= 0 && vy < this.BoardSize.Height){
                            
                                let vcell = this.Cells[vy][vx];
                                cell.nears.push(vcell);
                            }    
                        }
                    }
                }
            })
        });

    }


    clearCells(){
        this.Cells.forEach(line => {
            line.forEach(cell => { 
                cell.alive = 0 
        } );

        }); 
}


    calculate(){
        this.Cells.forEach(line => {
            line.forEach(cell => { 
                let v = 0;
                cell.nears.forEach(vcell => {
                    v+= vcell.alive;
                });
                if(cell.alive){
                    cell.next = +( v >= 2 && v <=3 )
                }
                else{
                    cell.next = +( v == 3)
                }
            })
        } );


    }

    update() {
        this.Cells.forEach(line => {
            line.forEach(cell => {
                cell.alive = cell.next;
            })
        } );

    }



    render(){
        this.Cells.forEach(line => {
            line.forEach(cell => {
                this.renderCell(cell);
            })
        } );

    }

    renderCell(cell){
        this.canvas.rectangle(cell.x, cell.y, this.CellSize.Width,this.CellSize.Height,"black" ,"white")
        if(cell.alive){
            let x = cell.x + 1 ;
            let y = cell.y + 1;
            this.canvas.rectangle(x,y, this.CellSize.Width -2 ,this.CellSize.Height -2 ,this.colorAlive ,this.colorAlive )

        }
    }




    execute() {
        let time = Date.now() - this.LastExecute;
        if(time >= 300){
            this.LastExecute = Date.now();
            this.calculate();
            this.update();
            this.render();
        }

    }


}

    var game = new GameofLife(20,20);
    var IdAnimation;


    function executeGame(){
        game.execute();
        IdAnimation = requestAnimationFrame(executeGame);
    }


    let btStart = document.getElementById("start");
    btStart.onclick = function(){
        if(!IdAnimation) IdAnimation = requestAnimationFrame(executeGame);
    }   

    let btStop = document.getElementById("stop");
    btStop.onclick = function(){
        if(IdAnimation) cancelAnimationFrame(IdAnimation);
        IdAnimation = 0;
    }
    let btClear = document.getElementById("clear")
    btClear.onclick = function (){
        if(IdAnimation) cancelAnimationFrame(IdAnimation);
        IdAnimation = 0;
        game.clearCells();
     game.render();

}

game.render();