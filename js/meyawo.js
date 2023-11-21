
$(document).ready(function(){
    $(".navbar .nav-link").on('click', function(event) {

        if (this.hash !== "") {

            event.preventDefault();

            var hash = this.hash;

            $('html, body').animate({
                scrollTop: $(hash).offset().top
            }, 700, function(){
                window.location.hash = hash;
            });
        } 
    });
});

// navbar toggle
$('#nav-toggle').click(function(){
    $(this).toggleClass('is-active')
    $('ul.nav').toggleClass('show');
});



function downloadResume() {
    var link = document.createElement('a');
    link.href = 'Resume_Parimal_Chaudhari.pdf';
    link.download = 'Resume_Parimal_Chaudhari.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }