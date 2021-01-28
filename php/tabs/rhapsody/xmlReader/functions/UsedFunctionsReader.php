<?php

namespace tabs\rhapsody\xmlReader\functions;

class UsedFunctionsReader
{
    private $readXml; // read variables
    private array $readFncts; // functions already read from xml file

    public function __construct(\SimpleXMLElement $readXml)
    {
        $this->readXml = $readXml; // we need them to map function used variables by id
    }

    public function addReadFunctions(array $fncts):void
    {
        $this->readFncts = $fncts;
    }

    public function readAllFunctoinsUsedFunctions():void
    {
        // '/Classes[@type="IRPYRawContainer"]/value[@type="IClass"]/Associations[@type="IRPYRawContainer"]/value[@type="IModule"]'
        $sXmlObjects = $this->readXml->xpath('//Classes[@type="IRPYRawContainer"]/value[@type="IClass"]/Associations[@type="IRPYRawContainer"]/value[@type="IModule"]');
        foreach($sXmlObjects as $file)
        {
            if(isset($file->_implicitClass->Operations->value))
            {
                foreach($file->_implicitClass->Operations->value as $child) // function node
                {
                    $this->readUsedFunctions($file->_implicitClass->Operations->value, $child);
                }
            }
        }
    }

    private function readUsedFunctions($allFnctsNode, $fnctNode)
    {
        if(isset($fnctNode->Tags->value))
        {
            foreach($fnctNode->Tags->value as $tag) // loop throug all tags of analyzed function
            {
                if('OpUsedFuncs' == str_replace('"','',$tag->_name)) // find OpUsedFuncs tag
                {
                    if(isset($tag->ValueSpecifications->value))
                    {
                        foreach($tag->ValueSpecifications->value as $usedFunct) // loop throug all id's of used functions
                        {
                            $this->setFnctName($fnctNode->_id, $usedFunct->_value->_id, $usedFunct->_value->_name);
                        }
                    }
                    else
                    {
                        // no functions nodes
                    }
                    break; // search no more
                }
            }
        }
        else
        {
            // Tags node not exists
        }
    }

    private function setFnctName(string $analyzedFnctId, string $usedFnctId, string $usedFnctBackupName):void
    {
        // get function object by ID
        // this must always be found as it was found right before
        $analyzedFnct = $this->getFnctObjById($analyzedFnctId); // we are looking for this function 'used functions'
        $usedFnctBackupName = explode('(',str_replace('"','',$usedFnctBackupName));
        $usedFnctBackupName = $usedFnctBackupName[0];
        $name = 'UNKNOWN_NAME'; // default

        if( ($usedFnctObj=$this->getFnctObjById($usedFnctId)) ) // search for used function
        {
            /* THIS SEARCH CAN'T FIND FUNCTIONS FROM OUTSIDE THE MODULE... */
            // got it!
            $name = $usedFnctObj->getName();
        }
        else if(''!=$usedFnctBackupName) // ...SO IF FUNCTION NAME NOT FOUND
        {
            // try use it's name read from $usedFunct->_value->_name
            $name = $usedFnctBackupName;
        }
        else
        {
            // function name could not be resolved, assign default
        }

        $analyzedFnct->setUsedFunction($name);
    }

    private function getFnctObjById(string $fnctId):?Funct
    {
        foreach($this->readFncts as $file)
        {
            foreach($file as $fnct)
            {
                if($fnct->getId() == $fnctId)
                {
                    return $fnct;
                }
            }
        }
        return null; // not found
    }
}