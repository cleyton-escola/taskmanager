

$(function() {
    $('.form').on('submit', function(e) {
        e.preventDefault();

        var name = $('#name').val();
        var email = $('#email').val();
        var password = $('#password').val();      

        $.ajax({
            url: 'http://localhost/api/usuarios/new',
            type: 'post',
            dataType: 'json',
            data: { name, password, email },
            success: function(res) {
                if(res['error'] === '') {
                    location.replace('../../index.html');
                } else {
                    $('span').text('');
					$('<span>' + res['error'] + '</span>').insertAfter('#password2');
                }
            },
        });
    });

    $('#password2').bind('keyup', function() {
        
        var password = $('#password').val();
        var password2 = $('#password2').val();

        if(password2 != password ) {
            $('span').text('');			
			$('<span> Senhas não correspondem. </span>').insertAfter('#password2');
        } else {
            $('span').text('');
        }
    });
});