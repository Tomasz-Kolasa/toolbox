<?php

namespace common\uploadsHandler;

class UploadsHandler
{

    use \traits\FileSysyemOperations;

    private string $uploadedFileName; // set after successful upload
    private int $fileSizeLimit;
    private string $uploadIndexName; // in $_FILES[index]

    private string $targetDirectory;
    private $acceptedExtensions = []; // all extensions accepted by default
    private $isUploadSuccessfulyCompleted = false; // flag

    public function __construct(string $uploadIndexName)
    {
        $this->uploadedFileName = '';
        $this->fileSizeLimit = 50; // Mb
        $this->targetDirectory = 'uploads'.DIRECTORY_SEPARATOR.'defaults'.DIRECTORY_SEPARATOR;//'uploads'.DIRECTORY_SEPARATOR.'sbs'.DIRECTORY_SEPARATOR;
        $this->uploadIndexName = $uploadIndexName;
    }

    public function isUploadSuccessfulyCompleted():bool
    {
        return $this->isUploadSuccessfulyCompleted;
    }

    public function addAcceptedExtension(string $ext):void
    {
        $this->acceptedExtensions[] = $ext;
    }

    public function setFileSizeLimit(int $limit):void
    {
        $this->fileSizeLimit = $limit; // Mb
    }

    public function setTargetDirectory(string $path):void
    {
        $this->targetDirectory = $path;
    }

    public function getTargetDirectory():string
    {
        return $this->targetDirectory;
    }

    private function isExtensionAcepted(string $uploadedFileExtension):bool
    {
        if(0==count($this->acceptedExtensions)) // all extensions accepted by default
        {
            return true;
        }
        else // check accepted extensions list
        {
            foreach($this->acceptedExtensions as $extension)
            {
                if(strtolower($uploadedFileExtension)==strtolower($extension))
                {
                    return true;
                }
            }
            // no match
            return false;
        }
    }

    // check if file uploaded and:
    // 1. set $this->uploadedFileName
    // 2. set relevant status
    public function handleUpload()
    {
        if(isset($_FILES[$this->uploadIndexName])) // file uploaded
        {
            if(UPLOAD_ERR_OK !== $_FILES[$this->uploadIndexName]['error'])
            {
                throw new \Exception('Upload errors occured.');
            }
            else if($_FILES[$this->uploadIndexName]['size']>($this->fileSizeLimit*1024**2 /*Mb=>bytes conersion*/ )) // check file size limit
            {
                throw new \Exception('Allowed file size limit is '.$this->fileSizeLimit.' Mb.');
            }
            else if(!$this->isExtensionAcepted( strtolower(pathinfo($_FILES[$this->uploadIndexName]['name'],PATHINFO_EXTENSION))) ) // check extension
            {
                throw new \Exception('Accepted file extensions: '.implode(', ',$this->acceptedExtensions));
            }
            else // file checks went ok so far
            {   
                // move file to target location
                // but clean the location before - just in case we've left something here before
                $this->deleteFilesFromDirectory($this->targetDirectory);

                $targetFile = $this->targetDirectory.DIRECTORY_SEPARATOR.basename($_FILES[$this->uploadIndexName]['name']);

                if( move_uploaded_file($_FILES[$this->uploadIndexName]['tmp_name'], $targetFile) )
                {
                    // file successfully moved
                    // set filename
                    $this->uploadedFileName = $_FILES[$this->uploadIndexName]['name'];
                    $this->isUploadSuccessfulyCompleted = true; // set the flag
                    // and we're done ;)
                }
                else
                {
                    throw new \Exception('Upload handling error.');
                }
            }
        }
        else // no upload
        {
            // do nothing
        }
    }

    public function  getUploadedFileName():?string
    {
        return $this->uploadedFileName;
    }

    public function getFileSizeLimit():int
    {
        return $this->fileSizeLimit;
    }
}