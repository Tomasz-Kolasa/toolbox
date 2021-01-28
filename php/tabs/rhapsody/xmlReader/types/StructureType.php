<?php

namespace tabs\rhapsody\xmlReader\types;

class StructureType extends \tabs\rhapsody\xmlReader\SectionItem
{
    private $members = [];

    public function setMember(\tabs\rhapsody\xmlReader\variables\Variable $val):void
    {
        $this->members[] = $val;
    }

    public function getMembers():array
    {
        return $this->members;
    }
}