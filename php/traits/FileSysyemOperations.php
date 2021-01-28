<?php

namespace traits;

trait FileSysyemOperations
{
    public function deleteFilesFromDirectory(string $dir)
    {
        $files = glob($dir . DIRECTORY_SEPARATOR . '*');
        foreach($files as $file)
        {
            if(is_file($file))
            {
                unlink($file);
            }
        }
    }

    public function unifyPath(string $path):string
    {
        $path = str_replace('/',DIRECTORY_SEPARATOR,$path);
        $path = str_replace('\\',DIRECTORY_SEPARATOR,$path);
        return $path;
    }
}