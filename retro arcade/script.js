var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

document.addEventListener('DOMContentLoaded', () => {
    const tiles = document.querySelectorAll('.tile');
    let currentIndex = 0; 

    function selectTile(index) {
        tiles.forEach(tile => {
            tile.classList.remove('selected');
            tile.querySelector('.description').style.visibility = 'hidden';
        });
        currentIndex = index;
        tiles[currentIndex].classList.add('selected');
        tiles[currentIndex].querySelector('.description').style.visibility = 'visible'; 
        tiles[currentIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    

    document.addEventListener('keydown', (e) => {
        console.log("Key pressed: ", e.key);
        switch (e.key) {
            case 'ArrowRight':
                if (currentIndex < tiles.length - 1) {
                    selectTile(currentIndex + 1);
                }
                break;
            case 'ArrowLeft':
                if (currentIndex > 0) {
                    selectTile(currentIndex - 1);
                }
                break;
            case ' ':
                e.preventDefault();
                const href = tiles[currentIndex].querySelector('a').getAttribute('href');
                window.location.href = href;
                break;
        }
    });

    selectTile(0); 
});




function matrixRain() {
    document.getElementById('matrixRain').appendChild(canvas);
    
    var columns = Array(canvas.width / 10).fill(0);


    function drawnums() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        
        ctx.fillStyle = 'rgba(0, 255, 0, 1)';
        ctx.font = 10 + 'px monospace';

        for (var i = 0; i < columns.length; i++) {
            var text = Math.floor(Math.random() * 2);
            ctx.fillText(text, i * 10, (columns[i]) * 10);
            
            if ((Math.random() * 100) > 99){
                columns[i] = 0;
            }
            columns[i]++;
            
            
        }
    }

    setInterval(drawnums, 50);
}

window.onload = function() {
    matrixRain();
};