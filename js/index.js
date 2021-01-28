
$(document).ready(function(){
    /* sets of helpful tools will be added here:
    * - C Types converter
    * - ... */
    
    // hadnles bootstrap 4 tooltips
    $('[data-toggle="tooltip"]').tooltip();

    //handles types conversion
    var conver = new Conver(); 
    //handles page styles
    var ps = new PageStyler();

    var renumerator = new Renumerator();
    renumerator.run();
    
    $('.input-field').on('input', function(){
        conver.convert( $(this).attr("id"), "GCC compiler" ); // in the future compiler will be choosen by the user
    });


    $('.theme-btn').on('click', function(){
        ps.settheme( $(this).attr('id') );
    });    
});


