<?php
libxml_use_internal_errors(true);

$path = ".".DIRECTORY_SEPARATOR."rhapsody".DIRECTORY_SEPARATOR."MOD_Serv_Mot_Ctrl__dd_review.xml";

if(file_exists($path))
{
    $xml = simplexml_load_file($path);
    // delete file after it's read
    // check errors
    $err = '';
    foreach(libxml_get_errors() as $error)
    {
        $err += "<br>". $error->message;
    }
}
else
{
    die('file not found');
}

/* USE IT 
chdir('rhapsody');
shell_exec('dd_review.exe -c 0931_018 -m MOD_Serv_Mot_Ctrl.sbs -x'); // ignore output
$out = (file_exists('MOD_Serv_Mot_Ctrl.xml')) ? 'yes':'no';
*/

?>
<!doctype html>
<html lang="pl">
    <meta charset="utf-8">
    <body>
        <h1>Rhapsody</h1>
        <h2>XML test</h2>
        <h3>Errors</h3>
        </p><?=$err?></p>

        <h3>The data</h3>
        <?php
            foreach($xml as $tag=>$value)
            {
                echo $xml->_id;
                break;
            }
        ?>
    </body>
</html>