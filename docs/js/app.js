requirejs(["litsp"], function(litsp) {

    var lisp = new litsp.Litsp();

    var container = $('<div class="console">');
    $('#console').append(container);
    var controller = container.console({
        promptLabel: 'Litsp> ',
        commandValidate: function (line) {
            if (line == "") return false;
            else return true;
        },
        commandHandle: function (line) {
            var out;
            var outClass;
            try {
                out = "=> " + lisp.process(line).toString(),
                outClass = "jquery-console-message-value";
            } catch (e) {
                console.error(e);
                out = e.message;
                outClass = "jquery-console-message-error";
            }
            return [{
                msg: out,
                className: outClass
            }]
        },
        autofocus: true,
        animateScroll: true,
        promptHistory: true
    });
});