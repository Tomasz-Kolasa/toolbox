<?php

namespace tabs\rhapsody\xmlReader\types;

use \tabs\rhapsody\xmlReader\variables\Variable;

class StructureTypeReader extends Reader
{
    private $structure;
    public function __construct(TypesReader $typesReader, \SimpleXMLElement $typeNode)
    {
        parent::__construct($typesReader,$typeNode);
        $this->structure = new StructureType($this->typeNode->_id);
        $this->structure->setName(str_replace('"','',$this->typeNode->_name));
    }
    // implements Reader::readType()
    public function readType():\tabs\rhapsody\xmlReader\SectionItem
    {
        if(isset($this->typeNode->Attrs->value))
        {
            foreach($this->typeNode->Attrs->value as $variableNode)
            {
                $variable = new Variable($variableNode->_id);
                $variable->setName(str_replace('"','',$variableNode->_name));

                $this->structure->setMember($variable);
            }

            return $this->structure;
        }
    }
}