$("#split-clear").on('click', function()
{
    $('#split-out').html("");
    $("#split-info").html("&nbsp;");
    $('#split-me').val("");
    $('#split-me').focus();
});

$('#split-me').on('input',split);

function split()
{
    var arr, i;
    var out = txt = "";
    var pattern = /^[a-zA-Z0-9_, ]*$/i;
    var isInputOk;

    txt = $("#split-me").val();
    isInputOk = pattern.test( txt );

    if (isInputOk)
    {
        arr = txt.split(',');
        for(i=0; i<arr.length; i++)
        {
            out += arr[i].trim() + "\n";
        }

        $('#split-out').html(out);
        $("#split-info").html("&nbsp;");
    }
    else
    {
        $("#split-info").text("Input must match "+pattern+" pattern");
        $('#split-out').html("");
    }

    
}

$("#split-copy").on("click",function()
{
    $("#split-out").select();
    document.execCommand("copy");
});