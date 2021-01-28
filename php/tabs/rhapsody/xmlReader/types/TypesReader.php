<?php

namespace tabs\rhapsody\xmlReader\types;

// main class to read TYPES section
class TypesReader extends \tabs\rhapsody\xmlReader\RhapsodySectionReader
{

    use \traits\FileSysyemOperations;

    // called in __contrustor()
    protected function readSection():void
    {
        $sXmlObjects = $this->readXml->xpath('//Classes[@type="IRPYRawContainer"]/value[@type="IClass"]/Associations[@type="IRPYRawContainer"]/value[@type="IModule"]');

        if(isset($sXmlObjects))
        {
            foreach($sXmlObjects as $file)
            { 
                //echo $file->_implicitClass->Declaratives->asXml();
                //die('here');

                if(isset($file->_implicitClass->Declaratives->value))
                {
                    foreach($file->_implicitClass->Declaratives->value as $type)
                    {
                        try
                        {
                            $reader = Reader::getReader($this, $type); // analyze which
                            $item = $reader->readType();
                            $this->addFileLevelItem($item,str_replace('"','',$file->_name));
                        }
                        catch(\Exception $e)
                        {
                            // no reader found or error reading type
                            $this->logError("Type: {$type->_name} could not be read and has been ommited.");  
                        }
                    }
                }
                else
                {
                    // node not exists
                }
            }
        }
        else
        {
            // node not exists
        }
    }

    public function outputSectionDataModel()
    {
        foreach($this->file as $file=>$index)
        {
            echo "File: $file:<br>";
            foreach($index as $type)
            {
                switch(get_class($type))
                {
                    case 'tabs\rhapsody\xmlReader\types\EnumType':
                        include $this->unifyPath('tabs/rhapsody/xmlReader/templates/types/enumeration.php');
                    break;
                    case 'tabs\rhapsody\xmlReader\types\StructureType':
                        include $this->unifyPath('tabs/rhapsody/xmlReader/templates/types/structure.php');
                    break;
                    default:
                        $this->logError('Could not print: '.get_class($type));
                }
            }
        }
    }
}