<?php

namespace tabs\rhapsody\xmlReader;

class RhapsodyXMLReader
{
    use \traits\FileSysyemOperations, \traits\ModuleNameReader;

    protected $readXml; // __construct()->$this->loadFile()
    private string $workingDir;
    private $variables;
    private $functions;
    private $dependencies;
    private $types;

    public function __get($prop)
    {
        throw new \Exception('INTERNAL ERROR: no such section: '.$prop);
    }

    public function __construct(string $xmlFileName)
    {
        $this->workingDir  = getcwd().DIRECTORY_SEPARATOR.'rhapsody';

        $this->loadFile($xmlFileName); // load xml to memory (simplexml_load_file())
        // read module sections
        $this->variables = new variables\VariablesReader($this->readXml);
        $model = $this->variables->getSectionDataModel();  // $model['files'] is read variables
        $this->functions = new functions\FunctionsReader($this->readXml, $model['files']);
        $this->dependencies = new dependencies\DependenciesReader($this->readXml);
        $this->types = new types\TypesReader($this->readXml);
    }

    private function loadFile(string $xmlFileName)
    {
        $this->readXml = simplexml_load_file($this->workingDir.DIRECTORY_SEPARATOR.$xmlFileName);

        // delete files, we don't need them
        $this->deleteFilesFromDirectory($this->workingDir);

        $err = '';
        foreach(libxml_get_errors() as $error)
        {
            $err += "<br>". $error->message;
        }

        if(''!==$err)
        {
            throw new \Exception('Errors reading file.'); // don't show user details ($err for debugging)
        }
        else
        {
            // file read went ok
        }
    }

    public function printItemsNames(string $section)
    {
        $this->$section->printItemsNames();
    }

    public function outputSectionDataModel(string $section)
    {
        $this->$section->outputSectionDataModel();
    }

    // section: variables, functions, dependencies, types
    public function getSectionDataModel(string $section):array
    {
        return $this->$section->getSectionDataModel();
    }

    public function getErrors():array
    {
        $sections = [];
        $sections['variables'] = $this->variables->getErrors();
        $sections['functions'] = $this->functions->getErrors();
        $sections['dependencies'] = $this->dependencies->getErrors();
        $sections['types'] = $this->types->getErrors();

        return $sections;
    }
}