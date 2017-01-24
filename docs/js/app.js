requirejs(["litsp"], function(litsp) {

    var lisp = new litsp.Litsp();

    var container = $('<div class="console">');
    $('body').append(container);
    var controller = container.console({
        promptLabel: 'Litsp> ',
        commandValidate: function (line) {
            if (line == "") return false;
            else return true;
        },
        commandHandle: function (line) {
            return [{
                msg: "=> " + lisp.process(line).toString(),
                className: "jquery-console-message-value"
            }]
        },
        autofocus: true,
        animateScroll: true,
        promptHistory: true
    });
});