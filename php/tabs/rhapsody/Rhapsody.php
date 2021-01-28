<?php

namespace tabs\rhapsody;

use common\uploadsHandler\UploadsHandler;
use tabs\rhapsody\xmlReader\RhapsodyXMLReader;
use XMLReader;

class Rhapsody implements \ToolboxTabInterface
{
    use \traits\Messenger, \traits\Redirect, \traits\FileSysyemOperations;

    private $uploadsHandler;
    private $xmlReader;
    public $view;

    public function __construct()
    {
        $this->uploadsHandler = new UploadsHandler('sbs_file'); // upload index name to look up for
    }

    public function runTabLogic():void
    {
        try
        {
            if($this->checkForFileUploaded()) // check for SBS file upload, Exception may be thrown
            {
                // sbs file uploaded, convert it to xml
                $uploadeFileName = $this->uploadsHandler->getUploadedFileName();
                $xmlFileName = $this->convertSBS( new SbsConverter($uploadeFileName) );  // throws error if fails
                // read xml
                $this->xmlReader = new RhapsodyXMLReader($xmlFileName); // throws error if fails

                // file successfuly read !
                // $this->view->printReadXMLFile();
                // die("<br>END------------------");

                // create view
                $this->view = new view\RhapsodyView($this->xmlReader);

                // set template to be used
                $_SESSION['rhapsody__template'] = $this->unifyPath('tabs\rhapsody\view\templates\rhapsodyCheckerTemplate.php');
                //$this->setMsg('File successfuly read!');
                //$this->redirectToPage('index.php#rhapsody');
            }
            else
            {
                // no file uploaded - it's a regular page open or redirect after file success/fail upload
                $_SESSION['rhapsody__template'] = $this->unifyPath('tabs\rhapsody\view\templates\fileUpload.php');
            }
        }
        catch(\Exception $e)
        {
            // something went wrong with fileupload
            // set template to be used
            $_SESSION['rhapsody__template'] = $this->unifyPath('tabs\rhapsody\view\templates\fileUpload.php');
            
            // set session message
            $this->setMsg($e->getMessage());
            $this->redirectToPage('index.php#rhapsody');
        }
    }

    private function checkForFileUploaded():bool
    {
        $this->uploadsHandler->addAcceptedExtension('sbs');
        $this->uploadsHandler->setTargetDirectory(
            'rhapsody');

        $this->uploadsHandler->handleUpload(); // throws and Exception

        return ($this->uploadsHandler->isUploadSuccessfulyCompleted()) ? true:false;
    }

    private function convertSBS(SbsConverter $converter):string
    {
        $config = $_POST['config'] ?? null;
        $converter->convert($config);
        return $converter->getXmlFileName();
    }
}