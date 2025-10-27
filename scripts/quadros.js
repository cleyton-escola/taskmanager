
$(function() {
    actionAddCard();

    $.ajax({
        url: 'http://localhost/api/quadros?jwt=' + $.session.get('jwt'),
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
            url:'http://localhost/api/quadros/delete/' + idCard + '?jwt=' + $.session.get('jwt'),
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
            url: 'http://localhost/api/quadros/new' + '?jwt=' + $.session.get('jwt'),
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
            url:'http://localhost/api/tarefas/delete/' + idTask + '?jwt=' + $.session.get('jwt'),
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
            url:'http://localhost/api/tarefas/update/' + idTask + '?jwt=' + $.session.get('jwt'),
            type: 'put',
            dataType: 'json',
            data: JSON.stringify({id: idTask, tarefa, id_quadro: idCard}),
            success: function(res) {
                updatedTask.push(res.tarefa);
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
            url:'http://localhost/api/tarefas/change/' + idTask + '?jwt=' + $.session.get('jwt'),
            type: 'PATCH',
            dataType: 'json',
            data: JSON.stringify({ id_quadro: idCard}),
            error: function(e) {
                return e;
            }
        });       
        return true;
    };

    function updateCard(description, idCard) {       
        var updatedCard;

        $.ajax({
            url:'http://localhost/api/quadros/update/' + idCard + '?jwt=' + $.session.get('jwt'),
            type: 'put',
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
                return $(this).data('dataId') === task.id_quadro;                              
            });                      

            if(task.id_quadro === cards.data('data-id')) {
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


                    $(templateTask).find('.text-item').text(task.tarefa);
                    $(card).parent().find('.list-card').append(templateTask);              
                });
            }
        });
    };

    function getTasks(idCard) {
        $.ajax({
            url: 'http://localhost/api/tarefas/card/' + idCard + '?jwt=' + $.session.get('jwt'),
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

                    var taskEntered = $(cadastrarNewTask(nameNewTask, idCard));
                    if(taskEntered) {
                        var idTask = taskEntered[0].idTask;
                        $(templateTask).data('data-id', idTask);

                        $(templateTask).find('.text-item').text($(taskEntered)[0].data.tarefa);                        

                        $(templateInputTask).remove();                        

                        $(templateTask).find('.text-item').on('click', function() {
                            
                            updateNameTask($(this), idTask, idCard);                            
                        });                  

                        $(templateInputTask).find('.field-name-task').change(function(e) {
                            var newNameTask = $(this).val();

                            if(newNameTask != taskEntered) {
                                updatedTask = $(updateTask(taskEntered[0].idTask, newNameTask));
                            
                                $(templateTask).find('.text-item').text(newNameTask);

                                $($(this)).replaceWith(templateTask);                                                                                                      
                            }; 
                        });

                        $(templateTask).find('.icons-task').on('click', function(e) {
                            removeTask(taskEntered[0].idTask);
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
            url: 'http://localhost/api/tarefas/new' + '?jwt=' + $.session.get('jwt'),
            type: 'post',
            dataType: 'json',
            data: {
                id_quadro: id_quadro,
                tarefa: nameNewTask
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