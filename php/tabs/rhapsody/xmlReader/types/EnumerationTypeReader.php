<?php

namespace tabs\rhapsody\xmlReader\types;

class EnumerationTypeReader extends Reader
{
    private $enum;
    public function __construct(TypesReader $typesReader, \SimpleXMLElement $typeNode)
    {
        parent::__construct($typesReader,$typeNode);
        $this->enum = new EnumType($this->typeNode->_id);
        $this->enum->setName(str_replace('"','',$this->typeNode->_name));
    }
    // implements Reader::readType()
    public function readType():\tabs\rhapsody\xmlReader\SectionItem
    {
        if(isset($this->typeNode->Literals->value))
        {
            foreach($this->typeNode->Literals->value as $literalNode)
            {
                $literal = new EnumLiteral($literalNode->_id);
                $literal->setName(str_replace('"','',$literalNode->_name));
                $literal->setValue(str_replace('"','',$literalNode->_value));

                $this->enum->addLiteral($literal);
            }

            return $this->enum;
        }
    }
}