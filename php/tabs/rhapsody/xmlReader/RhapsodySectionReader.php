<?php

namespace tabs\rhapsody\xmlReader;

abstract class RhapsodySectionReader
{
    use \traits\ErrorReporter, \traits\ModuleNameReader;
    
    protected $readXml;
    protected $file = []; // file level properties eq. file['Com']
    protected $module = []; // module level properties eg. module['dependencies]
    
    public function __construct(\SimpleXMLElement $readXml)
    {
        $this->readXml = $readXml;
        $this->readSection();
    }

    // section data model getter
    // returns joined module and file level properties
    public function getSectionDataModel():array
    {
        $arr = [];
        $arr['module'] = $this->module;
        $arr['files'] = $this->file;
        return $arr;
    }

    // add item (eg. Variable, function) which belongs to a file in rhapsody
    public function addFileLevelItem(SectionItem $item, string $fileName)
    {
        // notation: $this->file['BoltSensoric_Serv'][0]['name']
        if(!array_key_exists($fileName,$this->file))
        {
            $this->file[$fileName] = [];
        }
        $this->file[$fileName][] = $item;
    }

    // add module level item (eg. dependency)
    public function addModuleLevelItem(SectionItem $item, string $sectionName)
    {
        // notation: $this->file['BoltSensoric_Serv'][0]['name']
        if(!array_key_exists($sectionName,$this->module))
        {
            $this->module[$sectionName] = [];
        }
        $this->module[$sectionName][] = $item;
    }

    // prints list
    public function printItemsNames()
    {
        $moduleName = $this->getModuleName();

        $template = 'templates'.DIRECTORY_SEPARATOR.'rhapsodySectionReader'.DIRECTORY_SEPARATOR.'listItems.php';

        $listThisItem = $this->module;
        include $template;

        $listThisItem = $this->file;
        include $template;
    }

    // build section data model
    abstract protected function readSection():void;

    // output built data mmodel as text
    abstract public function outputSectionDataModel();
}