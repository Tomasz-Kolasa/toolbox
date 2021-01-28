// read items by section name and file name
// create array
class ListBySectionAndFilename
{
    items=[];
    section = '';
    filename = '';

    constructor(section,filename)
    {
        this.items = []; // reset
        this.section = section;
        this.filename = filename;

        this.read();
    }

    read()
    {
        this.items = []; // reset

        switch (this.section)
        {
            case 'functions':
                this.readVariant2();
                break;
            case 'variables':
            case 'dependencies': // intended fall-through
                 this.readVariant1();
                 break;
            case 'types':
                this.readTypesNames();
                break;
            default:
                console.log("SelectControl::open2widowComparer() no section: " + this.section);
        }
    }

    readTypesNames()
    {
        var sectionClass = '.rhapsody__dataModel_section--'+this.section;
        var $this = this;
        $(sectionClass).find("[data-filename='"+this.filename+"']").find('.enumeration').each(function(){
            $this.items.push($(this).data('enumname'));
        });
        $(sectionClass).find("[data-filename='"+this.filename+"']").find('.structure').each(function(){
            $this.items.push($(this).data('structname'));
        });
    }

    readVariant1()
    {
        var sectionClass = '.rhapsody__dataModel_section--'+this.section;
        var $this = this;
        $(sectionClass).find("[data-filename='"+this.filename+"']").find('.item').each(function(){
            $this.items.push($(this).data('name'));
        });
    }

    readVariant2()
    {
        var sectionClass = '.rhapsody__dataModel_section--'+this.section;
        var $this = this;
        $(sectionClass).find("[data-filename='"+this.filename+"']").find(".item-function").each(function(){
            $this.items.push($(this).data('name'));
        });
    }

    getItems()
    {
        return this.items;
    }
}

class FunctionReader
{
    constructor()
    {
        this.file; // filename to search function in
        this.functionName; // function to be read
        this.functonNode; // html node to search n

        this.fnct = {};
        this.init();
    }

    init()
    {
        // reset values
        this.file = '';
        this.functionName = '';
        this.functonNode = undefined;

        this.fnct.varRead = [];
        this.fnct.varWrite = [];
        this.fnct.varReadWrite = [];
        this.fnct.usedFunctions = [];
    }

    setNode()
    {
        this.functonNode = $('.rhapsody__dataModel_section--functions').find('.item-function[data-name="'+this.functionName+'"]');
    }

    // read function properties by filrname and function name
    read(file,fnctName)//:this.fnct
    {
        this.init();

        this.file = file;
        this.functionName = fnctName;
        this.setNode();

        this.readVarsRead();
        this.readVarsWrite();
        this.readVarsReadWrite();
        this.readUsedFunctions();

        return this.fnct;
    }

    readVarsRead()
    {
        var $this = this;
        this.functonNode.find('.vars-read .item').each(function(){
            $this.fnct.varRead.push( $(this).data('varread') );
        });
    }

    readVarsWrite()
    {
        var $this = this;
        this.functonNode.find('.vars-write .item').each(function(){
            $this.fnct.varWrite.push( $(this).data('varwrite') );
        });
    }

    readVarsReadWrite()
    {
        var $this = this;
        this.functonNode.find('.vars-readWrite .item').each(function(){
            $this.fnct.varReadWrite.push( $(this).data('varreadwrite') );
        });
    }

    readUsedFunctions()
    {
        var $this = this;
        this.functonNode.find('.usedFunctions .item').each(function(){
            $this.fnct.usedFunctions.push( $(this).data('usedfunction') );
        });
    }
}

class HtmlDataReader
{
    constructor()
    {
        this.functionReader = new FunctionReader();
    }

    // dependencies, functions, types, variables
    // only get those wich actually has values
    getSections() // get sections names
    {
        var sections = [];
        $('.rhapsody__dataModel_section').each(function(){
            if( $(this).find('.item').length )
            {
                sections.push($(this).find('h2').data('sectionname'));
            }
        });
        return sections;
    }

    getItemsListBySectionAndFilename(section,filename)//:array
    {
        var reader = new ListBySectionAndFilename(section,filename);
        return reader.getItems();
    }


    // read all .items from readXmlAsHtmlTemplate.php
    // create new object for each .item containing properties with all alike data-* attribute
    // returns array of ItemObject
    getItemsObjectsBySectionAndFilename(section,filename)//:array of objects ItemObject
    {

    }

    getFilesListBySectionClass(htmlClass)
    {
        var arr = [];
        $(htmlClass).find('[data-filename]').each(function(){
            arr.push($(this).data('filename'));
        });
        return arr;
    }

    getFunctionPropertiesAsObjectByFilenameAndFunctionname(fileName, fnctName)
    {
        return this.functionReader.read( fileName, fnctName );
    }
}