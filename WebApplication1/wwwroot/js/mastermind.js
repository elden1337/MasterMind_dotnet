var answer = [];
var guessArray = [];
var attempt = 1;
var offset = "";
var numberToColor = {
    1: "red",
    2: "green",
    3: "black",
    4: "white",
    5: "yellow",
    6: "blue"
};

$(document).ready(function () {
    CreateAnswer();
    MaskNonAvailableAnswers();
    LoadPins();

    $(document).on('mousedown', '.draggable', function () {
        if (!$(this).data('isMoved')) {
            offset = $(this).offset();
            $(this).css("left", offset.left);
            $(this).css("top", offset.top);
        }
    });

    //THIS MAKES IT NOT BIND TO THE DROPABLE AREA. FIX THAT!
    $(document).on('dragstart', '.draggable', function () {
        console.log('moved');
        if (!$(this).data('isMoved')) {

            $(this).css("position", "absolute");
            $(".draggable").draggable({ snap: ".guess", snapMode: "inner" });
            $(this).prependTo($("#pingraveyeard"));
            $("#pingraveyard").draggable({ snap: ".guess", snapMode: "inner" });

            LoadPins();
            $(this).data('isMoved', true);
        }
    });

    $(".guess").droppable({
        drop: function (event, ui) {
            var item = ui.draggable;
            $(this).data('choice', item.attr('data-name'));
            $(this).data('isSet', true);

            ShowGuessCommit();
        }
    });
});

function MaskNonAvailableAnswers() {
    $('.guessgroup--item').each(function () {
        var row = $(this).attr('id').replace('attempt_guessgroup_', '');
        $(this).css("opacity", "1");

        if (parseInt(row) > attempt) {
            $(this).css("opacity", "0.2");
        }
    });
    return;
}

function LoadPins() {
    $('#choice--group').empty();
    for (var i = 1; i < Object.keys(numberToColor).length + 1; i++) {
        $('#choice--group').append('<div class="choice round ' + numberToColor[i] + ' draggable ui-draggable ui-draggable-handle" data-name="' + numberToColor[i] + '" style="position: relative;"></div>');
    }

    $(".draggable").draggable({ snap: ".guess", snapMode: "inner" });

    return;
}

function CreateAnswer() {
    for (var i = 0; i < 4; i++) {
        answer.push(numberToColor[makeRandom()]);
    };

    function makeRandom() {
        return Math.floor(Math.random() * 6 + 1);
    };

    $('div.guess.round', $('.answer')).each(function (index) {
        $(this).css("background-color", answer[index]);
    })
}

function ShowGuessCommit() {
    var check = 0;

    $('div.guess.round', $('#attempt_guessgroup_' + attempt)).each(function () {
        if ($(this).data('isSet')) {
            check++;
        }
    })
    if (check == 4) {
        $(function () {
            $('#attempt_submit_' + attempt).show();
        })

        $("#attempt_submit_" + attempt).click(function () {
            $('div.guess.round', $('#attempt_guessgroup_' + attempt)).each(function () {
                guessArray.push($(this).data('choice'));
            })

            $('#attempt_submit_' + attempt).hide();

            Guess(guessArray);
        });
    }
}

function Guess(guessArray) {
    var whites = 0;
    var blacks = 0;
    var whiteCheck = [];
    var win = false;

    for (var i = 0; i < guessArray.length; i++) {
        if (answer[i] === guessArray[i]) {
            blacks++;
        }
        else {
            whiteCheck.push(i);
        }
    }

    for (var i = 0; i < guessArray.length; i++) {
        if (answer.includes(guessArray[i]) && whiteCheck.includes(answer.indexOf(guessArray[i]))) {
            whites++;
            whiteCheck.pop(i);
        }
    }

    console.log(attempt);
    $('div.hint.round', $('#row__attempt_' + attempt)).each(function () {
        if (blacks > 0) {
            if (blacks === 4) {
                win = true;
            }
            $(this).css("background-color", "black");
            blacks--;
        }
        else if (whites > 0) {
            $(this).css("background-color", "white");
            whites--;
        }
    });

    if (win) {
        console.log('user won!');
        $('#win').show();
        $('#hider').hide();
    }
    else if (attempt == 9) {
        console.log('user lost!');
        $('#lose').show();
        $('#hider').hide();
    }

    attempt++;
    guessArray.length = 0;
    MaskNonAvailableAnswers();
    console.log('next attempt is: ' + attempt);
}

