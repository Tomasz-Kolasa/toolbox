<?php

namespace tabs\rhapsody\xmlReader;

// each item in rhapsody has at least unique ID and in most cases a Name
abstract class Item
{
    protected string $id;
    protected string $name;

    public function __construct(string $id)
    {
        $this->id = $id;
    }

    public function getId():string
    {
        return $this->id;
    }

    public function setName(string $name)
    {
        $this->name = $name;
    }

    public function getName():string
    {
        return $this->name;
    }
}