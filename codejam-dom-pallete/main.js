window.addEventListener('load', function () {
    'use strict'
    const canvas = document.getElementById('canvas');
    let currentColor = (localStorage.getItem('currentColor')) ? localStorage.getItem('currentColor') : 'red';
    let prevColor = (localStorage.getItem('prevColor')) ? localStorage.getItem('prevColor') : 'white';
    let tool = (localStorage.getItem('tool')) ? localStorage.getItem('tool') : 'Paint bucket';

    if (tool === 'Paint bucket') canvas.style.cursor = 'url(asserts/images/Paint_bucket.png), auto';
    if (tool === 'Choose color') canvas.style.cursor = 'url(asserts/images/Choose_color.png), auto';
    if (tool === 'Transform') canvas.style.cursor = 'url(asserts/images/Transform.png), auto';
    if (tool === 'Move') {
        canvas.style.cursor = 'url(asserts/images/Move.png), auto';
    }

    function changeCurrentColor(currentColor, prevColor) {
        //console.log(currentColor);
        if (prevColor) {
            document.getElementById('prev').style.background = prevColor;
            document.getElementById('current').style.background = currentColor;
            return;
        }
        document.getElementById('prev').style.background = document.getElementById('current').style.background;
        localStorage.setItem('prevColor', document.getElementById('current').style.background);
        document.getElementById('current').style.background = currentColor;

    }

    changeCurrentColor(currentColor, prevColor);
    //add elements
    for (let i = 0; i < 9; i++) {
        const div = document.createElement('div');
        const obj = JSON.parse(localStorage.getItem(i));
        div.id = i;
        div.className += 'column default';
        if (obj) {
            if (JSON.parse(obj.hasOwnProperty('top'))) {
                const clone = div.cloneNode(true);
                clone.classList.remove('column');
                console.log(clone);
                document.getElementById('canvas__wrapper').appendChild(clone);

                canvas.appendChild(div);
                div.style.position = 'absolute';
                div.style.top = obj.top;
                div.style.left = obj.left;
            }
            else {
                document.getElementById('canvas__wrapper').appendChild(div);
            }
            div.style.background = JSON.parse(localStorage.getItem(i)).background;
            div.style.borderRadius = JSON.parse(localStorage.getItem(i)).borderRadius;
        }
        else {
            document.getElementById('canvas__wrapper').appendChild(div);
            div.style.background = 'green';
            const obj = {
                background: 'green',
                borderRadius: ''
            }
            localStorage.setItem(i, JSON.stringify(obj))
        }
    }

    canvas.addEventListener('click', function (event) {
        let target = event.target;
        if (target.className !== 'column default') return;
        if (tool === 'Paint bucket') changeBackground(target);
        if (tool === 'Choose color') chooseColor(target);
        if (tool === 'Transform') transform(target);
        if (tool === 'Move') return;
    })

    // colors
    document.getElementById('colors').addEventListener('click', function (event) {
        let target = event.target;
        if (target.id == 'prevColor') {
            canvas.style.cursor = 'url(asserts/images/Paint_bucket.png), auto';
            tool = 'Paint bucket';
            currentColor = localStorage.getItem('prevColor');
            changeCurrentColor(currentColor);
            // localStorage
            localStorage.setItem('currentColor', currentColor);
            localStorage.setItem('tool', tool);
        }
    })

    document.getElementById('palette').addEventListener("change", function (e) {
        canvas.style.cursor = 'url(asserts/images/Paint_bucket.png), auto';
        tool = 'Paint bucket';
        currentColor = e.target.value;
        changeCurrentColor(currentColor);
        // localStorage
        localStorage.setItem('currentColor', currentColor);
        localStorage.setItem('tool', tool);
    })

    //tools
    document.getElementById('tools').addEventListener('click', function (event) {
        let target = event.target;
        if (target.tagName != 'BUTTON') return;
        tool = target.id;
        localStorage.setItem('tool', tool);
        if (tool === 'Paint bucket') canvas.style.cursor = 'url(asserts/images/Paint_bucket.png), auto';
        if (tool === 'Choose color') canvas.style.cursor = 'url(asserts/images/Choose_color.png), auto';
        if (tool === 'Transform') canvas.style.cursor = 'url(asserts/images/Transform.png), auto';
        if (tool === 'Move') {
            canvas.style.cursor = 'url(asserts/images/Move.png), auto';
            return;
        }
    })

    //Paint bucket
    function changeBackground(element) {
        element.style.background = currentColor;
        const obj = JSON.parse(localStorage.getItem(element.id));
        obj.background = currentColor;
        localStorage.setItem(element.id, JSON.stringify(obj));
    }

    //Choose color
    function chooseColor(target) {
        currentColor = target.style.background;
        changeCurrentColor(currentColor);
        // localStorage
        localStorage.setItem('currentColor', currentColor);
    }

    //Transform
    function transform(target) {
        if (target.style.borderRadius == '')
            target.style.borderRadius = '50%';
        else target.style.borderRadius = '';
        // localStorage
        const obj = JSON.parse(localStorage.getItem(target.id));
        obj.borderRadius = target.style.borderRadius;
        localStorage.setItem(target.id, JSON.stringify(obj));
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
            dragObject.avatar.style.top = e.clientY - 98 + 'px';

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

                // localStorage
                const avatar = dragObject.avatar;
                const obj = JSON.parse(localStorage.getItem(avatar.id));
                obj.top = avatar.style.top;
                obj.left = avatar.style.left;
                localStorage.setItem(avatar.id, JSON.stringify(obj))
            }
            else {
                self.onDragEnd(dragObject, dropElem);
            }
        }

        function createAvatar() {
            let avatar = dragObject.elem.cloneNode(true);
            canvas.appendChild(avatar);
            dragObject.elem.style.opacity = '0.5';

            avatar.moveElem = function () {
                console.dir(dragObject.elem.parentNode)
                if (dragObject.elem.parentNode.id == 'canvas__wrapper'){
                    dragObject.elem.style.opacity = '0';
                }
                else {
                    dragObject.elem.parentNode.removeChild(dragObject.elem);
                }
            };

            // cancel move
            avatar.cancel = function () {
                dragObject.elem.style.opacity = '1';
                avatar.style.display = 'none';
            }

            return avatar;
        }

        function startDrag() {
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

        this.onDragEnd = function () { };
    };

    DragManager.onDragCancel = function (dragObject) {
        dragObject.avatar.cancel();
    };

    DragManager.onDragMove = function (dragObject) {
        dragObject.avatar.moveElem();
    };

    DragManager.onDragEnd = function (dragObject, dropElem) {
        const drag = dragObject.elem;
        drag.style.background = dropElem.style.background;
        drag.style.borderRadius = dropElem.style.borderRadius;
        drag.style.opacity = '';

        dropElem.style.background = dragObject.avatar.style.background;
        dropElem.style.borderRadius = dragObject.avatar.style.borderRadius;

        dragObject.avatar.parentNode.removeChild(dragObject.avatar);

        //localStorage
        const obj1 = JSON.parse(localStorage.getItem(drag.id));
        obj1.background = drag.style.background;
        obj1.borderRadius = drag.style.borderRadius;
        localStorage.setItem(drag.id, JSON.stringify(obj1))

        const obj = JSON.parse(localStorage.getItem(dropElem.id));
        obj.background = dropElem.style.background;
        obj.borderRadius = dropElem.style.borderRadius;
        localStorage.setItem(dropElem.id, JSON.stringify(obj))

    };

    //keyboard
    document.addEventListener('keydown', function (e) {
        if (e.keyCode == 80) {
            canvas.style.cursor = 'url(asserts/images/Paint_bucket.png), auto';
            tool = 'Paint bucket';
            localStorage.setItem('tool', tool);
        }
        if (e.keyCode == 67) {
            canvas.style.cursor = 'url(asserts/images/Choose_color.png), auto';
            tool = 'Choose color';
            localStorage.setItem('tool', tool);
        }
        if (e.keyCode == 84) {
            canvas.style.cursor = 'url(asserts/images/Transform.png), auto';
            tool = 'Transform';
            localStorage.setItem('tool', tool);
        }
        if (e.keyCode == 77) {
            canvas.style.cursor = 'url(asserts/images/Move.png), auto';
            tool = 'Move';
            localStorage.setItem('tool', tool);
        }
    })
})