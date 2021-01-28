<?php

namespace tabs\rhapsody\xmlReader\types;

class EnumLiteral extends \tabs\rhapsody\xmlReader\Item
{
    private string $value = '';

    public function setValue(string $value):void
    {
        $this->value = $value;
    }

    public function getValue():string
    {
        return $this->value;
    }
}