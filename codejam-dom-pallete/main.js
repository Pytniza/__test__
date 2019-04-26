let color = 'red';
let tool = 'Paint bucket';
const canvas = document.getElementById('canvas');

canvas.addEventListener('click', function (event) {
    let target = event.target;
    if (target.className !== 'column') return;
    if (tool === 'Paint bucket') changeBackground(target);
    if (tool === 'Choose color') chooseColor(target);
    if (tool === 'Move') return;
    if (tool === 'Transform') transform(target);

})

function changeBackground(element) {
    element.style.background = color;
}

// colors 
const colors = document.getElementById('colors')
colors.addEventListener('click', function (event) {
    let target = event.target;
    if (target.tagName != 'BUTTON') return;
    color = target.innerHTML;
    tool = 'Paint bucket';
})

//tools
const tools = document.getElementById('tools')
tools.addEventListener('click', function (event) {
    let target = event.target;
    if (target.tagName != 'BUTTON') return;
    tool = target.innerHTML;
})

//Choose color
function chooseColor(target) {
    color = target.style.background;
    alert(`Currect color: ${color}`)
}

//Transform

function transform(target) {
    console.log(target.style.borderRadius)
    if (target.style.borderRadius == '')
    target.style.borderRadius = '50%';
    else target.style.borderRadius = '';
}