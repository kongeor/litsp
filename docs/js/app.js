requirejs(["litsp"], function(litsp) {

    var loadCore = true;
    var useClosures = true;

    var lisp = new litsp.Litsp();

    var container = $('<div class="console">');
    $('#console').append(container);
    var controller = container.console({
        welcomeMessage: 'The Litsp programming shell',
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

    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/textmate");
    editor.getSession().setMode("ace/mode/lisp");
    editor.getSession().setTabSize(2);

    editor.commands.addCommand({
        name: 'eval',
        bindKey: { win: 'Ctrl-Enter', mac: 'Command-Enter' },
        exec: function (editor) {
            var e = jQuery.Event("keydown");
            e.which = 13;
            e.keyCode = 13;

            var code = "";
            if (editor.getSelectedText().trim().length == 0) {
                code = editor.getValue();
            } else {
                code = editor.getSelectedText();
            }
            controller.typer.consoleInsert(code);
            controller.typer.trigger(e);
        },
        readOnly: true // false if this command should not apply in readOnly mode
    });

    var horizontalOrientation = true;

    $('#change-orientation').on('click', function() {
        if (horizontalOrientation) {
            $('.editor-section').removeClass('seven').addClass('twelve');
            $('.repl-section').removeClass('five').addClass('twelve');
            $(this).val('Switch to horizontal');
            horizontalOrientation = false;
        } else {
            $('.editor-section').removeClass('twelve').addClass('seven');
            $('.repl-section').removeClass('twelve').addClass('five');
            $(this).val('Switch to vertical');
            horizontalOrientation = true;
        }
    });
    
    $('#reset-repl').on('click', function() {
        loadCore = $('#load-core input:checkbox:checked').length > 0;
        useClosures = $('#use-closures input:checkbox:checked').length > 0;
        lisp.init(loadCore, useClosures);
    });
});