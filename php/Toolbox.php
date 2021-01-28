<?php

use tabs\rhapsody\Rhapsody;

class Toolbox
{
    use \traits\Messenger;

    public $tabs = [];
    public $view;

    public function __construct()
    {
        // add modules(tabs) here
        $this->tabs['rhapsody'] = new Rhapsody();
        $this->view = new view\ToolboxView($this);
    }

    public function runPageLogic():void
    {
        foreach($this->tabs as $tab)
        {
            $tab->runTabLogic();
        }
    }
}