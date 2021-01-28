<?php

define('DEV_MODE',false);

$path= get_include_path();
$path .= PATH_SEPARATOR. __DIR__;
$path .= PATH_SEPARATOR. __DIR__ .DIRECTORY_SEPARATOR. 'php';
set_include_path($path);

function loadClass($classname)
{
    include "$classname.php";
}

spl_autoload_register('loadClass');