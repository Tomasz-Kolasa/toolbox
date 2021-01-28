<?php

namespace tabs\rhapsody\xmlReader\types;

// get relevant type reader class - eg. Enum, Structure
abstract class Reader
{
    private $typesReader;
    protected $typeNode;

    public function __construct(TypesReader $typesReader, \SimpleXMLElement $typeNode)
    {
        $this->typesReader = $typesReader;
        $this->typeNode = $typeNode;
    }

    // return relevant reader class
    public static function getReader(TypesReader $typesReader,\SimpleXMLElement $typeNode):Reader
    {
        // analyze typeNode to figure out which Type we are dealing with
        if(isset($typeNode->_kind))
        {
            switch($typeNode->_kind)
            {
                case 'Enumeration':
                    return new EnumerationTypeReader($typesReader, $typeNode);
                break;
                case 'Structure':
                    return new StructureTypeReader($typesReader, $typeNode);
                break;
                default:
                    throw new \Exception('No type handler found for: '.$typeNode->_name);
            }
            
        }
        // return relevant Type handler class
    }

    // a class reads the type (eg. Enum - it's name, literal names and values) and return it as SectionItem kind
    abstract public function readType():\tabs\rhapsody\xmlReader\SectionItem;
}