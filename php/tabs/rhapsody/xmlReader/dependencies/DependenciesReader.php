<?php

namespace tabs\rhapsody\xmlReader\dependencies;

class DependenciesReader extends \tabs\rhapsody\xmlReader\RhapsodySectionReader
{
    protected function readSection():void
    {
        try
        {
            $this->readModuleLevelDependencies();
            $this->readFileLevelDependencies();
        }
        catch(\Exception $e)
        {
            $this->logError('Could not read dependencies.');
        }
    }

    private function readFileLevelDependencies():void
    {
        // '/Classes[@type="IRPYRawContainer"]/value[@type="IClass"]/Associations[@type="IRPYRawContainer"]/value[@type="IModule"]'
        $sXmlObjects = $this->readXml->xpath('//Classes[@type="IRPYRawContainer"]/value[@type="IClass"]/Associations[@type="IRPYRawContainer"]/value[@type="IModule"]');

        if(isset($sXmlObjects))
        {
            foreach($sXmlObjects as $file)
            {
                if(isset($file->_implicitClass->Dependencies->value))
                {
                    foreach($file->_implicitClass->Dependencies->value as $child) // dependency item node
                    {
                        $dependency = new Dependency($child->_id);
                        $dependency->setName(str_replace('"','',$child->_name));
                        $dependency->setSubsystem(str_replace('"','',$child->_dependsOn->_subsystem));
                        $this->addFileLevelItem($dependency, str_replace('"','',$file->_name));
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

    private function readModuleLevelDependencies():void
    {
        $sXmlObjects = $this->readXml->xpath('//Dependencies[@type="IRPYRawContainer"]');

        // get module name
        $moduleName = $this->readXml->_name;
        $moduleName = $moduleName[0];

        if(isset($sXmlObjects[0]->value))
        {
            foreach($sXmlObjects[0]->value as $child) // function node
            {
                $dependency = new Dependency($child->_id);
                $dependency->setName(str_replace('"','',$child->_name));
                $dependency->setSubsystem(str_replace('"','',$child->_dependsOn->_subsystem));

                $this->addModuleLevelItem($dependency,'dependencies');
            }
        }
        else
        {
            // node not exists
        }
    }

    public function getModuleLevelDependenciesData()
    {
        return $this->moduleDependencies;
    }

    // in this case it's te same as
    public function outputSectionDataModel()
    {
        $this->printItemsNames();
    }
}
