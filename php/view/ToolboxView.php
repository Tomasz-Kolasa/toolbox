<?php

namespace view;

class ToolboxView
{
    use \traits\FileSysyemOperations;

    private $toolbox;

    public function __construct(\Toolbox $toolbox)
    {
        $this->toolbox = $toolbox;
    }
    // try template with path saved in $_SESSION[$template]
    public function useTemplate($templateIndex):void
    {
        if(isset($_SESSION[$templateIndex]) && $this->includeFile($_SESSION[$templateIndex]))
        {
            // file included
        }
        else
        {
            // let user know that something went nok
            echo 'Could not load data, sorry...';
        }
    }

    // if file can not be included 
    public function includeFile($path):bool
    {
        @$res = include $path;
        return ($res) ? true:false;
    }

    public function getMsg():?string
    {
        return $this->toolbox->getMsg();
    }
}