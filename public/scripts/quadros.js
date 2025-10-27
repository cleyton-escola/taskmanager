
$(function() {
    actionAddCard();

    $.ajax({
        url: '/api/quadros',
        type: 'get',
        success : function(res) {
            if(res.length > 0) {                
                $.each(res, ( i, card)  => {
                    var templateCard = $.parseHTML($('#template-quadro').html().trim());

                    $(templateCard).find('.name-card').text(card.description);                 
                    $(templateCard).find('.board-column-header').data('data-id', card.id);
                    
                    var idCard = $(templateCard).find('.board-column-header').data('data-id');

                    $(templateCard).find('.icon-delete-card').on('click', function() {

                        actionDeleteCard($(this), idCard);
                    });                    
                        
                    $(templateCard).find('.add-task-btn').on('click', function() {
                        actionsAdicionaTask(idCard);
                    });

                    $(templateCard).find('.name-card').on('click', function() {
                        var element = $(this).parent();

                        updateNameCard(element, idCard);
                    });                                 

                    $(getTasks(idCard));                    

                    $(templateCard).find('.board-column-body').drop();
                    $(templateCard).find('.board-column-body').on('drop', function(e, ui) {

                         $(ui)[0].draggable.data('data-id',  $(ui)[0].draggable.data('data-id') );
                        var idTask = $(ui)[0].draggable.data('data-id');
                        taskChangeCard(idTask, idCard);                                                  
                    });

                    $('.task-board').append(templateCard);                 
                });
            } else {
                $('span').text('');
                $("<span>" +  res['error']  + "</span>").before('.add-quadro-btn');
            };        
        },
        error: function(e) {
            console.log(e);
        }
    });

    function actionDeleteCard(element, idCard) {
        var cardDeleted = removeCard(idCard);
        if(cardDeleted) {
            $(element).parent().parent().remove();
        };    
    };

    function removeCard(idCard) {
        var deletedCard = false;
        $.ajax({
            url:'/api/quadros/delete/' + idCard,
            type: 'delete',
            async: false,
            success: function(res) {
                if(!res['error']) {
                    deletedCard = true;
                }                
            },
            error: function(e) {
                console.log(e);
                return e;
            }
        });
        return deletedCard;
    };

    function actionAddCard() {
        $('.add-quadro-btn').on('click', function() {
            var templateCard = $.parseHTML($('#template-quadro').html().trim());
            var templateInput = $.parseHTML($('#template-task-input').html().trim());

            $(templateCard).find('.name-card').replaceWith(templateInput);       

            $(templateInput).find('.field-name-task').on('change', function(e) {
                var textNewNameCard = $(this).val();                

                if(textNewNameCard.length > 0) {
                    var { id, description } = cadastrarNewCard(textNewNameCard);

                    $(templateCard).find('.board-column-header').data('data-id', id);

                    var idCard = $(templateCard).find('.board-column-header').data('data-id');

                    $(templateCard).find('.board-column-header > .column-name').html('<h2 class="name-card">' + description + '</h2>');

                    $(templateCard).find('.icon-delete-card').on('click', function() {

                        actionDeleteCard($(this), id);
                    });

                    $(templateCard).find('.board-column-body').drop();

                    $(templateCard).find('.board-column-body').on('drop', function(e, ui) {

                        var idTask = ($(ui)[0].draggable.data('data-id'));

                        taskChangeCard(idTask, idCard);                                                                                         
                    });

                    actionsAdicionaTask(id);
                };                        
            });

            $('.task-board').append(templateCard);
        });
    };

    function cadastrarNewCard(textNewNameCard) {
        
        $('.form').submit(function(e) {
            e.preventDefault();
        });

        var newCard;

        $.ajax({
            url: '/api/quadros/new',
            type: 'post',
            dataType: 'json',
            data: {
                description: textNewNameCard,
            },
            async: false,
            success: function(res) {
                if(res['error']) {
                    $('span').text('');
                    $("<span>" +  res['error']  + "</span>").insertAfter('.field-password');
                } else {
                    newCard = res;
                }
            },
            error: function(e) {
                console.log(e);                                                         
            }
        });
        return newCard;
    };

    function removeTask(idTask) {
        var deletedTask = false;
        $.ajax({
            url:'/api/tarefas/delete/' + idTask,
            type: 'delete',
            success: function(e) {
                deletedTask = true;               
            },
            error: function(e) {
                console.log(e);
                return e;
            }
        });

        return deletedTask;
    };

    function updateTask(idTask, tarefa, idCard) {        
        var updatedTask = [];

        $.ajax({
            url:'/api/tarefas/update/' + idTask,
            type: 'post',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({description: tarefa}),
            success: function(res) {
                updatedTask.push(res);
            }, 
            error: function(e) {
                console.log(e);
                return e;
            }
        });
        return updatedTask;
    };

    function taskChangeCard(idTask, idCard) {
        $.ajax({
            url:'/api/tarefas/change/' + idTask,
            type: 'post',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({ quadroId: idCard}),
            error: function(e) {
                return e;
            }
        });       
        return true;
    };

    function updateCard(description, idCard) {       
        var updatedCard;

        $.ajax({
            url:'/api/quadros/update/' + idCard,
            type: 'post',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({ description: description }),
            success: function(res) {
                if(res.description.length > 0) {
                    updatedCard = res.description;
                }
            }, 
            error: function(e) {
                console.log(e);
                return e;
            }
        });
        return updatedCard;
    };

    function updateNameTask(element, idTask, idCard) {
       
        var templateTask = $.parseHTML($('#template-task').html().trim());
        var templateInputTask = $.parseHTML($('#template-task-input').html().trim());        

        var nameTaskEdit = $(element).text();

        $(templateInputTask).find('.field-name-task').attr('value', nameTaskEdit);
        $(element).parent().replaceWith(templateInputTask);

        $(templateInputTask).find('.field-name-task').focus();

        $(templateInputTask).find('.field-name-task').focusout(function() {

            var newNameTask = $(this).val();
              
            $(templateTask).find('.text-item').text(newNameTask);
            $(this).parent().replaceWith(templateTask);                        
        });

        $(templateInputTask).find('.field-name-task').on('change', function() {
            var newNameTask = $(this).val();

            updateTask(idTask, newNameTask, idCard);

            $(templateTask).find('.text-item').text(newNameTask);
            $(templateInputTask).find('.form').remove();    
            $($(this).parent()).replaceWith(templateTask);                                               
        });

        $(templateTask).find('.text-item').on('click', function(e) {

            updateNameTask($(this), idTask, idCard);
        });
        
        $(templateTask).find('.icons-task').on('click', function(e) {
            removeTask(idTask);
            $(this).parent().remove();
        });
        
        $(templateTask).dragAndDrop();
    };

    function updateNameCard(element, idCard) {
        var templateInputTask = $.parseHTML($('#template-task-input').html().trim());
        var nameCardEdit = element.text().trim();
        
        $(templateInputTask).find('.field-name-task').attr('value', nameCardEdit);
        $(element).replaceWith(templateInputTask);
        $(templateInputTask).find('.field-name-task').focus();

        $(templateInputTask).find('.field-name-task').focusout(function() {
            $(this).replaceWith(element);
            $('.icon-delete-card').show(1000);
            $('.icon-card').show(1000);
        });

        $(element).on('click', function() {
            $('.icon-card').hide(900);
            $('.icon-delete-card').hide(900);
            updateNameCard($(this), idCard);
        });

        $(templateInputTask).find('.field-name-task').change(function() {
            var newNameCard = $(templateInputTask).find('.field-name-task').val();

            updateCard(newNameCard, idCard);

            $(element).find('.name-card').text(newNameCard);
            $(this).replaceWith(element);
        });
    };

    function actionGetTasks(tasks) {
         $.each(tasks, ( i, task) => {
            var cards = $('.board-column').find('.board-column-header').filter(function(i) {
                return $(this).data('dataId') === task.quadroId;                              
            });                      

            if(task.quadroId === cards.data('data-id')) {
                $.each(cards, (i, card) =>  {
                    var templateTask = $.parseHTML($('#template-task').html().trim());                     

                    $(templateTask).find('.icons-task').on('click', function(e) {
                        if($(removeTask(task.id))) {
                            $(templateTask).remove();
                        };                                    
                    });                 

                    $(templateTask).find('.text-item').on('click', function(e) {
                        if($('.list-card').find('.form').length == 0) {
                            var idCard = $(card).data('data-id');
                            updateNameTask(this, task.id, idCard);
                        }                        
                    });

                    $(templateTask).data('data-id', task.id);                            

                    $(templateTask).dragAndDrop();


                    $(templateTask).find('.text-item').text(task.description);
                    $(card).parent().find('.list-card').append(templateTask);              
                });
            }
        });
    };

    function getTasks(idCard) {
        $.ajax({
            url: '/api/tarefas/card/' + idCard,
            type: 'get',
            success: function(res) {            
                if(res.length >  0) {   
                    actionGetTasks(res);
                } else {
                    return false;
                }        
            },
            error: function(e) {
                console.log(e);
                return e;
            }
        });
    };

    function actionsAdicionaTask(idCard) {
        $('.add-task-btn').on('click', function(e) {
            var templateInputTask = $.parseHTML($('#template-task-input').html().trim());
            var templateTask = $.parseHTML($('#template-task').html().trim());
            var addTask = $(this).parent().find('.list-card');            

            if($(addTask).find('.form').length === 0) {                
                $(addTask).append(templateInputTask);
            };

            $(templateInputTask).find('.field-name-task').focus();
            $(templateInputTask).find('.field-name-task').focusout(function() {                
                $(this).parent().remove();                     
            });

            $(templateInputTask).change(function(e) {     
                if($(e.target).val().length > 0) {                

                    nameNewTask = $(e.target).val();

                    var taskEntered = cadastrarNewTask(nameNewTask, idCard);
                    if(taskEntered && taskEntered.id) {
                        var idTask = taskEntered.id;
                        $(templateTask).data('data-id', idTask);

                        $(templateTask).find('.text-item').text(taskEntered.description);                        

                        $(templateInputTask).remove();                        

                        $(templateTask).find('.text-item').on('click', function() {
                            
                            updateNameTask($(this), idTask, idCard);                            
                        });                  

                        $(templateInputTask).find('.field-name-task').change(function(e) {
                            var newNameTask = $(this).val();

                            if(newNameTask != taskEntered.description) {
                                updateTask(idTask, newNameTask, idCard);
                            
                                $(templateTask).find('.text-item').text(newNameTask);

                                $($(this)).replaceWith(templateTask);                                                                                                      
                            }; 
                        });

                        $(templateTask).find('.icons-task').on('click', function(e) {
                            removeTask(idTask);
                            $(this).parent().remove();
                        });

                        $(templateTask).dragAndDrop();            

                        $(addTask).append(templateTask);     
                    }                   
                }
            });
        });            
    };

    function cadastrarNewTask(nameNewTask, id_quadro) {

        $('.form').submit(function(e) {
            e.preventDefault();
        });

        var newTask;

        $.ajax({
            url: '/api/tarefas/new',
            type: 'post',
            dataType: 'json',
            data: {
                quadroId: id_quadro,
                description: nameNewTask
            },
            async: false,
            success: function(res) {
                if(res['error']) {
                    $('span').text('');
                    $("<span>" +  res['error']  + "</span>").insertAfter('.field-password');
                } else {
                    newTask = res;
                }
            },
            error: function(e) {
                console.log(e);                                                         
            }
        });
        return newTask;
    }
});