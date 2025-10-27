

$(function() {
	$('.form').on('submit', function(e) {

		e.preventDefault();

		var email = $('#email').val();
		var password = $('#password').val();
		
		$.ajax({
			url: 'http://localhost/api/usuarios/login',
			type: 'post',
			dataType: 'json',
			data: { email , password },
			success: function(res) {
				if(res['error'] === '') {
					$.session.set("jwt" , res.jwt);
					
					location.replace('pages/quadros/index.html');
				} else {
					$('span').text('');
					$("<span>" +  res['error']  + "</span>").insertAfter('.field-password');	
				}
			},
			error: function(e) {
				$('span').text('');
				$("<span>" + e.responseJSON['error'] + "</span>").insertAfter('.field-password');					
			}
		});
	});

	$('#password').bind('keyup', function() {
		var password = $(this).val();

		if(password.length < 3) {
			$('span').text('');			
			$('<span> Senha precisa mais que 3 caracteres. </span>').insertAfter('.field-password');
		} else {
			$('span').text('');
		}
	});

	$('#email').bind('keyup', function() {
		var email = $(this).val();

		if(!email.includes('@')) {
			$('span').text('');			
			$('#label-password').html('<span> Inserir um email válido. </span>');
		} else {
			$('#label-password').text('Senha');
		}
	});
});
