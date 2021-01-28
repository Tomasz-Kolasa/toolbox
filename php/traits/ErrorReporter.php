<?php

namespace traits;

trait ErrorReporter
{
 
    private $errors = []; // show user warnings

    public function logError($msg)
    {
        if(DEV_MODE)
        {
            die($msg);
        }
        else
        {
            $this->addError($msg);
        }
    }

    protected function addError(string $val):void
    {
        $this->errors[] = $val;
    }

    public function getErrors():array
    {
        return $this->errors;
    }
}