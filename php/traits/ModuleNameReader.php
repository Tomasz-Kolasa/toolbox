<?php

namespace traits;

trait ModuleNameReader
{
    public function getModuleName():string
    {
        foreach($this->readXml->children() as $child)
        {
            if('_name'==$child->getName())
            {
                return str_replace('"','',$child);
            }
        }
        // could not find _name child
        return 'UNKNOWN';
    }
}