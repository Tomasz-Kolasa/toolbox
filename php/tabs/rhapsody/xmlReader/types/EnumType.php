<?php

namespace tabs\rhapsody\xmlReader\types;

class EnumType extends \tabs\rhapsody\xmlReader\SectionItem
{
    private $literals = [];

    public function addLiteral(EnumLiteral $val):void
    {
        $this->literals[] = $val;
    }

    public function getLiterals():array
    {
        return $this->literals;
    }
}