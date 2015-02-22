/**
 * Snake
 *
 * @author Oleg Gorbenko aka oggo
 * @url github.com/gorbenko/snake
 * @since 2015-02-23
 */
(function () {
    var clsSnakeHead = '.snake-head',
        clsSnakeItem = '.snake-item',
        clsSnakeTail = '.snake-tail',
        clsRabbit = '.rabbit',
        clsArea = '.main-area',
        speedSnake = 80, // ms
        stepSnake = 20,  // px
        idTimeoutSnake,
        directionSnake = 'right',
        countItems = 1;

    var pathSnake = {}; // путь змеи

    var rabbitCoords = {}; // где живет кролик?

    var directionKeys = {
        37: 'left',
        38: 'top',
        39: 'right',
        40: 'bottom'
    }

    var points = 0;

    // создать кролика
    function makeRabbit () {
        if ($(clsRabbit).length) {
            $(clsRabbit).remove();
        }
        $(document.body).prepend('<div class="rabbit"></div>');

        var areaWidth = $(clsArea).width() - stepSnake
        var areaHeight = $(clsArea).height() - stepSnake;
        var x = rand(1, areaWidth);
        var y = rand(1, areaHeight);
        var xx = x % stepSnake;
        var yy = y % stepSnake;

        x -= xx;
        y -= yy;

        $(clsRabbit).css({ left: x, top: y });

        rabbitCoords = { left: x, top: y };
    }

    // проглотить кролика
    function swallowRabbit () {
        var len = $(clsSnakeItem).length;

        $(clsSnakeTail).after($('<div class="snake-tail snake-item" />').css(pathSnake[len - 1])).removeClass('snake-tail');
    }

    // кролик, это ты?
    function checkRabbit () {
        if (pathSnake.head.left === rabbitCoords.left &&
            pathSnake.head.top === rabbitCoords.top) {
            swallowRabbit();
            makeRabbit();
            ++points;
            printPoints();
        }
    }

    function moveHead () {
        var x = getPositionNode(clsSnakeHead).left,
            y = getPositionNode(clsSnakeHead).top;

        idTimeoutSnake = setTimeout(function () {
            switch (directionSnake) {
                case 'top':
                    y = getPositionNode(clsSnakeHead).top - stepSnake;
                    break;
                case 'bottom':
                    y = getPositionNode(clsSnakeHead).top + stepSnake;
                    break;
                case 'left':
                    x = getPositionNode(clsSnakeHead).left - stepSnake;
                    break;
                case 'right':
                    x = getPositionNode(clsSnakeHead).left + stepSnake;
                    break;
            }

            var coords = { left: x, top: y };

            $(clsSnakeHead).css(coords);

            pathSnake.head = coords;

            checkRabbit();

            moveBody();

        }, speedSnake);
    }

    function moveBody () {
        var items = $(clsSnakeItem);

        setTimeout(function () {
            $.each(items, function (index, item) {
                pathSnake[index] = {
                    left: getPositionNode(item).left,
                    top: getPositionNode(item).top
                };

                if (index === 0) {
                    $(item).css(pathSnake.head);
                } else {
                    $(item).css(pathSnake[index - 1]);
                }
            });
        }, speedSnake);

        moveHead();
    }

    function makeSnake () {
        for (var i = 0; i < countItems; i++) {
            var item = $('<div class="snake-item" />');

            if (i === countItems - 1) {
                item.addClass('snake-tail');
            }

            $(clsSnakeHead).before(item);
        }

        var items = $(clsSnakeItem);

        var headCoords = {
            top: 0,
            left: items.length * stepSnake
        };
        $(clsSnakeHead).css(headCoords);

        pathSnake.head = headCoords;

        $(items.get().reverse()).each(function (index, item) {
            var left = stepSnake * index;

            $(item).css('left', left);

            pathSnake[index] = {
                left: getPositionNode(item).left,
                top: getPositionNode(item).top
            };
        });
    }

    function printPoints () {
        $('.points').text(points);
    }

    function stopSnake () {
        clearTimeout(idTimeoutSnake);
    }

    function bindControls () {
        $('.start').on('click', function () {
            moveBody();
            $(this).attr('disabled', true);
            $('.pause').attr('disabled', false);
            $(clsArea).focus();
        });

        $('.pause').on('click', function () {
            stopSnake();
            $(this).attr('disabled', true);
            $('.start').attr('disabled', false);
            $(clsArea).focus();
        });

        printPoints();
    }

    function bindKeyboard () {
        $(window).on('keydown', function (e) {
            var k = e.keyCode;

            var banDir = (directionSnake === 'top' && k === 40 ||
                directionSnake === 'bottom' && k === 38 ||
                directionSnake === 'left' && k === 39 ||
                directionSnake === 'right' && k === 37);

            if (k in directionKeys && !banDir) {
                directionSnake = directionKeys[k];
            }
        });
    }

    function rand (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function getPositionNode (el) {
        var node = $(el);

        return {
            left: node.position().left,
            top: node.position().top,
            width: node.width(),
            height: node.height()
        };
    }

    return {
        init: function () {
            makeSnake();
            makeRabbit();
            bindControls();
            bindKeyboard();
        }
    }
}()).init();
