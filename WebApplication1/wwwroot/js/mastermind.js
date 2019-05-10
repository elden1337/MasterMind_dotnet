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

    $(document).on('dragstop', '.draggable', function (event, ui) {
        offset = $(this).offset();
        var newLeft = ui.offset.left;
        var newTop = ui.offset.top;

        $(this).prependTo($("#pingraveyeard"));
        $(this).css("position", "absolute");
        $(this).css("left", newLeft);
        $(this).css("top", newTop);

        $("#pingraveyard").draggable({ snap: ".droppable_area", snapMode: "inner" });
        LoadPins();
    });

    $('.droppable_area').each(function() {
        MakeDroppable($(this));
    });

});

function MakeDroppable(element) {
    element.addClass("droppable_area");
    element.addClass("ui-droppable");
    element.droppable({
        drop: function (event, ui) {
            var item = ui.draggable;
            $(this).data('choice', item.attr('data-name'));
            $(this).data('isSet', true);
            console.log('added item');

            ShowGuessCommit();
        }, 
        out: function (event, ui) {
            $(this).data('isSet', false);
            console.log('removed item');
            ShowGuessCommit();
        }
    });
}

function MaskNonAvailableAnswers() {
    $('.guessgroup--item').each(function () {
        var row = $(this).attr('id').replace('attempt_guessgroup_', '');
        $(this).css("opacity", "1");

        if (parseInt(row) > attempt) {
            $(this).css("opacity", "0.2");
        }
        if (parseInt(row) === attempt) {
            $('div.guess.round', $('#attempt_guessgroup_' + attempt)).each(function () {
                if (parseInt(row) === attempt) {
                    MakeDroppable($(this));
                    //$(this).addClass('droppable_area');
                    //$(this).addClass('ui-droppable');
                    $(".draggable").draggable({ snap: ".droppable_area", snapMode: "inner" });
                }
                else {
                    $(this).removeClass('droppable_area');
                    $(this).removeClass('ui-droppable');
                    $(".draggable").draggable({ snap: ".droppable_area", snapMode: "inner" });
                }
            })
        }
        
    });
    return;
}

function LoadPins() {
    $('#choice--group').empty();
    for (var i = 1; i < Object.keys(numberToColor).length + 1; i++) {
        $('#choice--group').append('<div class="choice round ' + numberToColor[i] + ' draggable ui-draggable ui-draggable-handle" data-name="' + numberToColor[i] + '" style="position: relative;"></div>');
    }

    $(".draggable").draggable({ snap: ".droppable_area", snapMode: "inner" });

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

    $('div.guess.round.droppable_area', $('#attempt_guessgroup_' + attempt)).each(function () {
        if ($(this).data('isSet')) {
            check++;
        }
    })
    if (check == 4) {
        $(function () {
            $('div.guess.round.droppable_area', $('#attempt_guessgroup_' + attempt)).each(function () {
                guessArray.push($(this).data('choice'));
            })
            //$('#attempt_submit_' + attempt).hide();
            Guess(guessArray);
            //$('#attempt_submit_' + attempt).show();
        })

        //$("#attempt_submit_" + attempt).click(function () {
        //    $('div.guess.round.droppable_area', $('#attempt_guessgroup_' + attempt)).each(function () {
        //        guessArray.push($(this).data('choice'));
        //    })
        //    $('#attempt_submit_' + attempt).hide();
        //    Guess(guessArray);
        //});
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
        $('#hider').animate({ "left": "-28px", "top": "-27px" }, "fast");
    }
    else if (attempt == 10) {
        console.log('user lost!');
        $('#gameover').show();
        $('#hider').animate({ "left": "-28px", "top": "-27px" }, "fast");
    }

    attempt++;
    guessArray.length = 0;
    MaskNonAvailableAnswers();
    console.log('next attempt is: ' + attempt);
}

