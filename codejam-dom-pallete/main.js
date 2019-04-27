let color = 'red';
let tool = 'Move';
const canvas = document.getElementById('canvas');

canvas.addEventListener('click', function (event) {
    let target = event.target;
    if (target.className !== 'column default') return;
    if (tool === 'Paint bucket') changeBackground(target);
    if (tool === 'Choose color') chooseColor(target);
    if (tool === 'Transform') transform(target);
    if (tool === 'Move') return;
})

function changeBackground(element) {
    element.style.background = color;
}

//add default color
const arr = document.getElementsByClassName('column');
for (let i = 0; i < arr.length; i++) {
    arr[i].style.background = 'green';
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
    //if (!color) color = 'gray';
    alert(`Currect color: ${color}`)
}

//Transform

function transform(target) {
    if (target.style.borderRadius == '')
        target.style.borderRadius = '50%';
    else target.style.borderRadius = '';
}

//Move

const DragManager = new function () {
    let dragObject = {};
    const self = this;

    function onMouseDown(e) {
        if (!(tool == 'Move')) return;
        const elem = e.target.closest('.column');
        if (!elem) return;
        dragObject.elem = elem;
        return false;
    }

    function onMouseMove(e) {
        if (!dragObject.elem) return;

        if (!dragObject.avatar) {
            dragObject.avatar = createAvatar(e);
            startDrag(e);
        }
        // show moving element
        dragObject.avatar.style.left = e.clientX - (window.innerWidth - canvas.clientWidth) + 'px';
        dragObject.avatar.style.top = e.clientY - (window.innerHeight- canvas.clientHeight) + 'px';
        
        return false;
    }

    function onMouseUp(e) {
        if (dragObject.avatar) {
            finishDrag(e);
        }
        // reset dragObject
        dragObject = {};
    }

    function finishDrag(e) {
        var dropElem = findDroppable(e);

        if (!dropElem) {
            self.onDragCancel(dragObject);
        }
        else if (dropElem == 'move') {
            self.onDragMove(dragObject);
        }
        else {
            self.onDragEnd(dragObject, dropElem);
        }
    }

    function createAvatar(e) {
        var avatar = dragObject.elem.cloneNode(true);
        canvas.appendChild(avatar);
        dragObject.elem.style.opacity = '0.5';

        
        avatar.moveElem = function () {
            dragObject.elem.classList.remove('column');
            dragObject.elem.style.opacity = '0';
        };

        // cancel move
        avatar.cancel = function () {
            dragObject.elem.style.opacity = '1';
            avatar.style.display = 'none';
        }

        return avatar;
    }

    function startDrag(e) {
        var avatar = dragObject.avatar;
        avatar.style.zIndex = 9999;
        avatar.style.position = 'absolute';
    }

    function findDroppable(event) {
        // hide avatar
        dragObject.avatar.hidden = true;

        // get element under avatar
        var elem = document.elementFromPoint(event.clientX, event.clientY);

        // show avatar
        dragObject.avatar.hidden = false;

        if (elem == null) {
            return null;
        }

        if (elem.className === 'column default') return elem.closest('.column');
        if (canvas.contains(elem)) return 'move';
        return false;
    }

    document.onmousemove = onMouseMove;
    document.onmouseup = onMouseUp;
    document.onmousedown = onMouseDown;

    this.onDragEnd = function (dragObject, dropElem) { };
};

DragManager.onDragCancel = function (dragObject) {
    dragObject.avatar.cancel();
};

DragManager.onDragMove = function (dragObject) {
    dragObject.avatar.moveElem();
};

DragManager.onDragEnd = function (dragObject, dropElem) {
    dragObject.elem.style.background = dropElem.style.background;
    dragObject.elem.style.borderRadius = dropElem.style.borderRadius;
    dragObject.elem.style.opacity = '';

    dropElem.style.background = dragObject.avatar.style.background;
    dropElem.style.borderRadius = dragObject.avatar.style.borderRadius;

    dragObject.avatar.style.display = 'none';

};

