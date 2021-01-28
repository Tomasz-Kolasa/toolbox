<?php

namespace tabs\rhapsody\xmlReader\dependencies;

class Dependency extends \tabs\rhapsody\xmlReader\SectionItem
{
    private $subsystem;

    public function getSubsystem():?string
    {
        return $this->subsystem;
    }

    public function setSubsystem(string $val)
    {
        $this->subsystem = $val;
    }
}