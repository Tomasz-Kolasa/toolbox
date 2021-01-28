class PageStyler
    {
        constructor()
        {
            // array with theme arrays
            // theme array [id, background color, text color]
            this.theme = [];
            this.addDefaultthemes()
            this.readThemeFromCookie()
        }
        
        //check if there is theme cookie and if so set the theme
        readThemeFromCookie()
        {
            var c = getCookie('theme');
            if( c != "" )
                {
                    //set theme from cookie
                    this.settheme( c );
                }
            else
                {
                    //do nothing
                }
        }
        
        //adds theme to the list and adds it's button on the page
        addtheme( s )
        {
            //add theme object
            this.theme.push(s);
            
            //add button to html
            var html;
            html = '<button id="'+ s[0] +'" type="button" class="btn theme-btn btn-light">'+ s[0] +'</button>';
            $('.page-style').append(html);
            
        }
        
        // themes added from outside this method are not accessible for cookies
        addDefaultthemes()
        {
            this.addtheme( ['dark','#000','#008b8b'] ); //dark
            this.addtheme( ['light','#fff','#000'] );   //light
            this.addtheme( ['red','#00001a','#cc0000'] );  //red
        }
        
        //applys theme and sets cookie
        settheme( id )
        {
            //loop through available themes
            for ( let i=0; i<this.theme.length; i++ )
            {   
                //if this is selected theme
                if( this.theme[i][0] == id )
                {
                    //set theme
                    $('body').css({'background-color':this.theme[i][1], 'color':this.theme[i][2]});
                    
                    //set cookie so the theme could be set next time user visit the page
                    setCookie('theme',id,3650);
                    break;
                }
            }
        }
    }


//global functions for handling cookies ------------------------------------
function setCookie(cname, cvalue, exdays)
{
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname)
{
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++)
    {
        var c = ca[i];
        while (c.charAt(0) == ' ')
        {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0)
        {
            return c.substring(name.length, c.length);
        }
    }
  return "";
}