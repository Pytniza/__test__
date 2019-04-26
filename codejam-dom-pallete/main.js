let color = 'red';
let tool = 'Paint bucket';
const canvas = document.getElementById('canvas');
canvas.addEventListener('click', function (event) {
    let target = event.target;
    if (target.className !== 'column') return;
    if (tool === 'Paint bucket') changeBackground(target);
    if (tool === 'Choose color') return;
    if (tool === 'Move') return;
    if (tool === 'Transform') return;

})

function changeBackground(element) {
    element.style.background = color;
}

const colors = document.getElementById('colors')

colors.addEventListener('click', function (event) {
    let target = event.target;
    if (target.tagName != 'BUTTON') return;
    color = target.innerHTML;
})
