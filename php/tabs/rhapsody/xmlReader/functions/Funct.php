<?php

namespace tabs\rhapsody\xmlReader\functions;

class Funct extends \tabs\rhapsody\xmlReader\SectionItem
{
    private $usedFunctions = [];
    private $varsRead = [];
    private $varsWrite = [];
    private $varsReadWrite = [];

    public function setUsedFunction(string $val):void
    {
        $this->usedFunctions[] = $val;
    }

    public function setVarRead(string $val):void
    {
        $this->varsRead[] = $val;
    }

    public function setVarWrite(string $val):void
    {
        $this->varsWrite[] = $val;
    }

    public function setVarReadWrite(string $val):void
    {
        $this->varsReadWrite[] = $val;
    }

    public function getUsedFunctions():array
    {
        return $this->usedFunctions;
    }

    public function getVarsRead():array
    {
        return $this->varsRead;
    }

    public function getVarsWrite():array
    {
        return $this->varsWrite;
    }

    public function getVarsReadWrite():array
    {
        return $this->varsReadWrite;
    }
}