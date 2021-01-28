<?php

namespace tabs\rhapsody\xmlReader\variables;

class VariablesReader extends \tabs\rhapsody\xmlReader\RhapsodySectionReader
{
    // called in __contrustor()
    protected function readSection():void
    {
        $this->readVariables();
    }

    private function readVariables():void
    {
        // '/Classes[@type="IRPYRawContainer"]/value[@type="IClass"]/Associations[@type="IRPYRawContainer"]/value[@type="IModule"]'
        $sXmlObjects = $this->readXml->xpath('//Classes[@type="IRPYRawContainer"]/value[@type="IClass"]/Associations[@type="IRPYRawContainer"]/value[@type="IModule"]');

        if(isset($sXmlObjects))
        {
            foreach($sXmlObjects as $file)
            {
                //echo $file->asXml();
                //$this->addItem($name,$file->_name);
                //echo 'File:'.$file->_name.'<br>';
                if(isset($file->_implicitClass->Attrs->value))
                {
                    foreach($file->_implicitClass->Attrs->value as $child)
                    {
                        $variable = new Variable($child->_id);
                        $variable->setName( str_replace('"','',$child->_name) );
        
                        $this->addFileLevelItem($variable,str_replace('"','',$file->_name));
        
                        // echo $child->_name.'<br>';
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
            foreach($index as $var)
            {
                echo 'Id: '.$var->getId().'; ';
                echo 'Name: '.$var->getName().'<br>';
            }
            echo '<br>';
        }
    }
}