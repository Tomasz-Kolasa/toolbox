<?php

namespace tabs\rhapsody\view;

class RhapsodyView
{
    use \traits\FileSysyemOperations;

    private $xmlReader;

    public function __construct(\tabs\rhapsody\xmlReader\RhapsodyXMLReader $xmlReader)
    {
        $this->xmlReader = $xmlReader;
    }

    public function getVariables():array
    {
        return $this->xmlReader->getSectionDataModel('variables');
    }

    // xml reader class has some basic outputters
    public function printDataModelAsHTML(string $visibility='visible'):void
    {
        $visibility = ('visible'==$visibility)?'':'d-none'; // non visible data used by js
        // print read data
        include $this->unifyPath('tabs/rhapsody/view/templates/readXmlAsHtmlTemplate.php');

        /*
        echo('<h2>DEPENDENCIES</h2>');
        //$xmlReader->printSection('variables');
        $this->xmlReader->printItemsNames('dependencies');

        echo('<h2>VARIABLES</h2>');
        //$xmlReader->printSection('variables');
        $this->xmlReader->printItemsNames('variables');

        echo('<h2>FUNCTIONS</h2>');
        //$xmlReader->printNames('functions');
        $this->xmlReader->outputSectionDataModel('functions');

        echo('<h2>TYPES</h2>');
        //$xmlReader->printNames('functions');
        $this->xmlReader->outputSectionDataModel('types'); 

        // print warnings
        $sections = $this->xmlReader->getErrors();
        $template = 'tabs/rhapsody/xmlReader/templates/errorReporter/errors.php';
        include $this->unifyPath($template);
        */
    }

    public function getModuleName():string
    {
        return $this->xmlReader->getModuleName();
    }
}