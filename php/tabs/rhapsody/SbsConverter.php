<?php

namespace tabs\rhapsody;


class SbsConverter
{
    private string $sbsFilePath;
    private string $ddReviewLocation;
    private string $xmlFilename = '';

    public function __construct(string $sbsFileName)
    {
        $this->sbsFilename = $sbsFileName;
        $this->ddReviewLocation = "rhapsody". DIRECTORY_SEPARATOR . 'dd_review';
    }

    public function convert(string $projectNo='1665_0XX') // 0931_018  
    {
        $this->getDdReviewCopy();

        $cwd = getcwd(); // remember cwd
        $sbsPath = $cwd.DIRECTORY_SEPARATOR.'rhapsody';
        chdir($sbsPath); // change dir to dd_review.exex and *.sbs file is

        // try to create xml
        shell_exec("dd_review.exe -c $projectNo -m {$this->sbsFilename} -x"); // ignore output
        chdir($cwd); // set back cwd

        // xml file created?
        $arr = explode('.',$this->sbsFilename);
        $xmlFilename = $arr[0] . '.xml';

        if(file_exists($sbsPath.DIRECTORY_SEPARATOR.$xmlFilename))
        {
            $this->xmlFilename = $xmlFilename;
        }
        else
        {
            throw new \Exception('SBS conversion fails.');
        }
    }

    // copy dd_review.exe as it outputs files in cwd
    // all files from ./rhapsody will be removed at upload
    private function getDdReviewCopy()
    {
        copy(
            getcwd().DIRECTORY_SEPARATOR.$this->ddReviewLocation.DIRECTORY_SEPARATOR.'dd_review.exe',
            getcwd().DIRECTORY_SEPARATOR."rhapsody".DIRECTORY_SEPARATOR.'dd_review.exe'
        );
    }

    public function getXmlFileName():string
    {
        return $this->xmlFilename;
    }
}