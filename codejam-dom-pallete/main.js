window.addEventListener('load', function () {
    'use strict'
    const canvas = document.getElementById('canvas');
    console.log(localStorage.getItem('currectColor'))
    let currectColor = (localStorage.getItem('currectColor')) ? localStorage.getItem('currectColor') : 'red';
    let tool = (localStorage.getItem('tool')) ? localStorage.getItem('tool') : 'Paint bucket';

    if (tool === 'Paint bucket') canvas.style.cursor = "url(asserts/images/Paint_bucket.png), auto";
    if (tool === 'Choose color') canvas.style.cursor = "url(asserts/images/Choose_color.png), auto";
    if (tool === 'Transform') canvas.style.cursor = "url(asserts/images/Transform.png), auto";
    if (tool === 'Move') {
        canvas.style.cursor = "url(asserts/images/Move.png), auto";
    }

    for (let i = 0; i < 9; i++) {
        const div = document.createElement("div");
        document.getElementById('canvas__wrapper').appendChild(div);
        if (localStorage.getItem(i) !== null) {
            div.style.background = JSON.parse(localStorage.getItem(i)).background;
        }
        else { div.style.background = 'green'; }
        div.id = i;
        div.className += 'column default'
    }


    //let firstOpen = true;
    //if (!localStorage.getItem(firstOpen)) firstOpen = localStorage.getItem(firstOpen);

    canvas.addEventListener('click', function (event) {
        let target = event.target;
        if (target.className !== 'column default') return;
        if (tool === 'Paint bucket') changeBackground(target);
        if (tool === 'Choose color') chooseColor(target);
        if (tool === 'Transform') transform(target);
        if (tool === 'Move') return;
    })

    function changeBackground(element) {
        element.style.background = currectColor;
        if (localStorage.getItem(element.id) == null) {
            const obj = {
                background: currectColor
            }
            localStorage.setItem(element.id, JSON.stringify(obj))
        }
        else {
            const obj = JSON.parse(localStorage.getItem(element.id));
            obj.background = currectColor;
            localStorage.setItem(element.id, JSON.stringify(obj))
        }
    }

    // colors 
    const colors = document.getElementById('colors')
    colors.addEventListener('click', function (event) {
        let target = event.target;
        if (target.tagName != 'BUTTON') return;
        currectColor = target.innerHTML;
        canvas.style.cursor = "url(asserts/images/Paint_bucket.png), auto";
        tool = 'Paint bucket';
        localStorage.setItem('currectColor', currectColor);
        localStorage.setItem('tool', tool);
    })

    //tools
    const tools = document.getElementById('tools')
    tools.addEventListener('click', function (event) {
        let target = event.target;
        if (target.tagName != 'BUTTON') return;
        tool = target.innerHTML;
        localStorage.setItem('tool', tool);
        if (tool === 'Paint bucket') canvas.style.cursor = "url(asserts/images/Paint_bucket.png), auto";
        if (tool === 'Choose color') canvas.style.cursor = "url(asserts/images/Choose_color.png), auto";
        if (tool === 'Transform') canvas.style.cursor = "url(asserts/images/Transform.png), auto";
        if (tool === 'Move') {
            canvas.style.cursor = "url(asserts/images/Move.png), auto";
            return;
        }
    })

    //Choose color
    function chooseColor(target) {
        currectColor = target.style.background;
        localStorage.setItem('currectColor', currectColor);
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
            dragObject.avatar.style.top = e.clientY - (window.innerHeight - canvas.clientHeight) + 'px';

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
            let dropElem = findDroppable(e);

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
            let avatar = dragObject.elem.cloneNode(true);
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
            let avatar = dragObject.avatar;
            avatar.style.zIndex = 9999;
            avatar.style.position = 'absolute';
        }

        function findDroppable(event) {
            // hide avatar
            dragObject.avatar.hidden = true;

            // get element under avatar
            const elem = document.elementFromPoint(event.clientX, event.clientY);

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

})