
(function($) {
    $.fn.dragAndDrop = function() {
        this.each(function() {          
            $(this).on('mousemove', function(e) {
                $(this).draggable({
                    cursor: "move",
                    opacity: 0.8,
                    revert: 'invalid',
                    revertDuration: 400,
                    scroll: true,
                    helper: 'clone',
                    delay: 100,
                    containment:  $(this).parent().parent().parent().parent(),            
                    appendTo: $(this).parent().parent().parent().parent()
                });
            });
        });
        return this;
    };

    $.fn.drop = function() {
        this.each(function() {
            $(this).droppable({
                activeClass: "ui-state-highlight",
                hoverClass: "drop-hover",                                        
                tolerance: "intersect",
                over: function( e, ui ) {
                   $(this).css("background-color", '#ffc637');
                },
                out: function( e, ui ) {
                   $(this).css("background-color", '#f8f8f8');
                },
                drop: function( e, ui ) {
                    $(ui)[0].draggable.remove();
                    $(ui)[0].draggable.dragAndDrop();
                    $(this).css("background-color", '#f8f8f8');
                    $(this).find('.list-card')[0].append($(ui)[0].draggable[0]);
                }                             
            });
        });        
        return this;
    }
}(jQuery));