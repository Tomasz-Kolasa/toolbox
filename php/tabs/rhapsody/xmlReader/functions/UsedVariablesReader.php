<?php

namespace tabs\rhapsody\xmlReader\functions;

class UsedVariablesReader
{
    private $vars; // read variables

    public function __construct(array $variables)
    {
        $this->vars = $variables; // we need them to map function used variables by id
    }

        // $node path up to this point is _implicitClass->Operations->value which is a function node
    // IMPORTANT : from this point of node level nodes may not exists in the tree
    // param:
    // - $branch: OpUsedGlobVarsRead || OpUsedGlobVarsWrite || OpUsedGlobVarsReadWrite
    // - $setVarFnctName - function to be called to save read element
    public function readFunctionVariablesList(string $branch, string $setVarFnctName, \SimpleXMLElement $node, Funct $fnct):void
    {
        // read vars, read name byt id, and add to list
        try
        {
            if(isset($node->Tags->value))
            {
                foreach($node->Tags->value as $value) // $value = specific tag node, eq. OpUsedGlobVarsRead
                {
                    if($branch == str_replace('"','',$value->_name)) // remove possible quotes
                    {
                        if(isset($value->ValueSpecifications->value))
                        {
                            foreach( $value->ValueSpecifications->value as $instance) // <value type="IInstanceValue">
                            {
                                $fnct->$setVarFnctName( $this->getVarNameById($instance->_value->_id, $instance->_value->_name) ); 
                            }
                            break; // look no futher
                        }
                        else
                        {
                            // node not exists
                        }
                    }
                }
            }
            else
            {
                // node not exists
            }

        }
        catch(\Exception $e)
        {
            // do nothing, no node probably
            //die($e->getMessage()); // TEST
        }
    }

    private function getVarNameById(string $varId, string $backupName):string
    {
        foreach($this->vars as $index)
        {
            foreach($index as $var)
            {
                if($var->getId() == $varId)
                {
                    return $var->getName();
                }
            }
        }
        // no match found by variable id, try use backup name - a name red from _name tag
        $backupName = str_replace('"','',$backupName);

        return (''!==$backupName)?$backupName:'UNKNOWN_NAME';
    }
}