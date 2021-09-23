var cellSize = 15;
var boardSize = 50;
var fps = 15;
var timeout;
var liveCondition = "23";
var birthCondition = "3";

function init()
{
    window.canvas = document.getElementsByTagName('canvas')[0];
    canvas.width = boardSize*cellSize;
    canvas.height = boardSize*cellSize;
    canvas.style.transform = 'translateZ(0);'
    window.c = canvas.getContext('2d');

    window.cells = [];
    for(let i=0;i<boardSize;i++)
    {
        cells.push([]);
        for(let j=0;j<boardSize;j++)
            cells[i].push(0);
    }
    window.lastTime = Date.now();
    draw();
}

window.addEventListener('load',_=>
{
    init();

    document.getElementById('randomize-btn').addEventListener('click',randomize);
    document.getElementById('clear-btn').addEventListener('click',clear);
    document.getElementById('stop-btn').addEventListener('click',_=>{clearTimeout(timeout)});
    document.getElementById('start-btn').addEventListener('click',animate);
    document.getElementById('rule-btn').addEventListener('click',_=>
    {
        [liveCondition, birthCondition] = prompt("Podaj nowe reguły w formacie przeżywają/rodzą_się").split("/");
    });
    document.getElementById('resize-btn').addEventListener('click',_=>
    {
        cellSize = parseInt(prompt("Wprowadź rozmiar komórki (w pikselach). Domyślna wartość to 15."));
        boardSize = parseInt(prompt("Wprowadź rozmiar planszy (w komórkach). Domyślna wartość to 50.\nIloczyn rozmiaru planszy i rozmiaru komórki nie powinien być większy niż rozdzielczość twojego monitora")); 
        init();       
    });
    document.getElementById('fps-slider').addEventListener('click',changeFPS);
    document.getElementById('fps-slider').addEventListener('mousemove',changeFPS);

    canvas.addEventListener('click',paint);
});

function randomize()
{
    for(let i=0;i<boardSize;i++)
        for(let j=0;j<boardSize;j++)
            cells[i][j] = parseInt(Math.random()*1.5);
    draw();
}

function clear()
{
    for(let i=0;i<boardSize;i++)
        for(let j=0;j<boardSize;j++)
            cells[i][j] = 0;
    draw();
}

function changeFPS(e)
{
    fps = e.target.value;
    document.getElementById('set-fps').innerHTML = fps;
}

function paint(e)
{
    let x = Math.floor(e.offsetX/cellSize);
    let y = Math.floor(e.offsetY/cellSize);
    cells[x][y] = Math.abs(1-cells[x][y]);
    c.fillStyle = `rgba(${255-cells[x][y]*255},${255-cells[x][y]*255},${255-cells[x][y]*255},1)`;
    c.fillRect(x*cellSize,y*cellSize,cellSize,cellSize);
}

function draw()
{
    c.clearRect(0,0,canvas.width,canvas.height);
    for(let i=0;i<boardSize;i++)
    {
        for(let j=0;j<boardSize;j++)
        {
            c.fillStyle = `rgba(${255-cells[i][j]*255},${255-cells[i][j]*255},${255-cells[i][j]*255},1)`;
            c.fillRect(i*cellSize,j*cellSize,cellSize,cellSize);
        }
    }
}

function animate()
{
    let newCells = [];
    for(let i=0;i<cells.length;i++)
        newCells.push(cells[i].slice());
    c.clearRect(0,0,canvas.width,canvas.height);
    for(let i=0;i<boardSize;i++)
    {
        for(let j=0;j<boardSize;j++)
        {
            let neighbours = 0;
            for(let k=i-1;k<=i+1;k++)
                for(let l=j-1;l<=j+1;l++)
                    if(!(i==k && j==l) && cells[k] && cells[k][l]) neighbours++;
            if(birthCondition.includes(neighbours)) newCells[i][j] = 1;
            else if(!liveCondition.includes(neighbours)) newCells[i][j] = 0;
            c.fillStyle = `rgba(${255-cells[i][j]*255},${255-cells[i][j]*255},${255-cells[i][j]*255},1)`;
            c.fillRect(i*cellSize,j*cellSize,cellSize,cellSize);
        }
    }
    cells = newCells;
    document.getElementById("real-fps").innerHTML = Math.floor(1000/(Date.now()-lastTime));
    lastTime = Date.now();
    //window.requestAnimationFrame(animate);
    timeout = setTimeout(animate,1000/fps);
}
