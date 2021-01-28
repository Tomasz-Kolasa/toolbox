<?php

namespace tabs\rhapsody\xmlReader\functions;


class FunctionsReader extends \tabs\rhapsody\xmlReader\RhapsodySectionReader
{
    private $usedVarsReader;
    private $usedFnctsReader;

    public function __construct(\SimpleXMLElement $readXml, array $variables)
    {
        $this->usedVarsReader = new UsedVariablesReader($variables);
        $this->usedFnctsReader = new UsedFunctionsReader($readXml);
        parent::__construct($readXml); // call last as it calls readSections() immidiately
    }

    // called in __contrustor()
    protected function readSection():void
    {
        $this->readFunctions();
    }

    private function readFunctions():void
    {
        // '/Classes[@type="IRPYRawContainer"]/value[@type="IClass"]/Associations[@type="IRPYRawContainer"]/value[@type="IModule"]'
        $sXmlObjects = $this->readXml->xpath('//Classes[@type="IRPYRawContainer"]/value[@type="IClass"]/Associations[@type="IRPYRawContainer"]/value[@type="IModule"]');

        if(isset($sXmlObjects))
        {
            foreach($sXmlObjects as $file)
            {
                if(isset($file->_implicitClass->Operations->value))
                {
                    foreach($file->_implicitClass->Operations->value as $child) // function node
                    {
                        $fnct = new Funct($child->_id);
                        $fnct->setName( str_replace('"','',$child->_name) );

                        $this->usedVarsReader->readFunctionVariablesList('OpUsedGlobVarsRead','setVarRead',$child, $fnct);
                        $this->usedVarsReader->readFunctionVariablesList('OpUsedGlobVarsWrite','setVarWrite',$child, $fnct);
                        $this->usedVarsReader->readFunctionVariablesList('OpUsedGlobVarsReadWrite','setVarReadWrite',$child, $fnct);

                        $this->addFileLevelItem($fnct,str_replace('"','',$file->_name));
        
                        // echo $child->_name.'<br>';
                    }
                }
                else
                {
                    // node not exists
                }
            }
            // now science we have read function names from all files, we can add 'used functions' names for each function
            $this->usedFnctsReader->addReadFunctions($this->file);
            $this->usedFnctsReader->readAllFunctoinsUsedFunctions(); // pass all read functions objects
        }
        else
        {
            // node not exists
        }
    }

    public function outputSectionDataModel()
    {
        echo '<ul>'; // file level
        foreach($this->file as $file=>$index)
        {
            echo "<li>"; // file level
            echo "<h3>File: $file:</h3>";
            echo '<ul>'; // function level
            foreach($index as $function)
            {   
                echo "<li>";// function level
                echo '<h4>'.$function->getName().'()</h4>';
                echo '<ul>';  // TAG section level
                echo "<li>";  // TAG Global variables section level
                echo '<h5>Used global variables:</h5>';

                echo '<ul>';  
                    echo '<li>';

                    echo "read:";
                    echo '<ul>';  // Global variables 
                    foreach($function->getVarsRead() as $val)
                    {
                        echo "<li>$val</li>";  // Global variables
                    }
                    echo '</ul>';  // Global variables
                    echo '</li>';
                    echo '<li>';
                    echo "write:";
                    echo '<ul>';  // Global variables
                    foreach($function->getVarsWrite() as $val)
                    {
                        echo "<li>$val</li>";  // Global variables
                    }
                    echo '</ul>';  // Global variables
                    echo '</li>';
                    echo '<li>';
                    echo "read-write:";
                    echo '<ul>';  // Global variables
                    foreach($function->getVarsReadWrite() as $val)
                    {
                        echo "<li>$val</li>";  // Global variables
                    }
                    echo '</ul>';  // Global variables
                    echo '</li>';
                echo "</ul>";
                echo '</li>'; //  TAG Global variables section level
                echo '<li>'; // TAG used functions
                echo '<h5>Used functions:</h5>';
                echo '<ul>';  // used functions list
                foreach($function->getUsedFunctions() as $val)
                {
                    echo "<li>$val</li>";  // used functions
                }
                echo '</ul>';  // used functions list
                echo '</li>'; // TAG used functions
                echo "</ul>";  //  TAG section level
            }
            echo '</ul>'; // function level
            echo "</li>"; // file level
        }
        echo '</ul>'; // file level
    }
}