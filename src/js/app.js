const nextIcon = '<img src="img/dist/right01.png" alt:"right">';
const prevIcon = '<img src="img/dist/right.png" alt:"prev">';
$(document).ready(function(){
    $('.header__burger').click(function(event){
        $('.header__burger, .header__menu').toggleClass('active');
        $('body').toggleClass('lock')
    });
     });

     $('#corporates-carousel').owlCarousel({
        loop:true,
        nav: true,
       margin: 10,
       navText: [ prevIcon, nextIcon],
         responsive:{
             0:{
                 items:1
             },
         }
     });