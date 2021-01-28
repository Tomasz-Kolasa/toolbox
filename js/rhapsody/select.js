// control #sel1
class Sel1Controller
{
    constructor(selectsMainController)
    {
        this.selMain = selectsMainController;
        this.sections = []; // store read sections, ie. variables, functions, etc
        this.currentlySelected; // stores currently selected item section name, eg functions, variables, ..
        this.init();
    }

    init()
    {
        this.fillSelect();
        this.bidEvents();
        this.setSelectsVisibility();
    }

    // fill #sel1 with sections <options>
    fillSelect()
    {
        this.sections = this.selMain.reader.getSections();
        for(var i=0; i<this.sections.length; i++)
        {
            $("#sel1").append('<option value="'+this.sections[i]+'">'+this.sections[i]+"</option>");
        }
    }

    // bid events to #sel1
    bidEvents()
    {
        var $this = this;
        $("#sel1").on('change',function(){
            $this.currentlySelected = $("#sel1 option:selected").val();
            $this.handleChange(); // pass section name
        });
    }

    // select has been selected, handle change
    handleChange()
    {
        this.setSelectsVisibility();

        if('show-all-data'==this.currentlySelected)
        {
            this.selMain.comparator.prepareDocument(); // hode comperatores
            $('#rhapsody__dataModel').removeClass('d-none');
            //throw new Error('here');
        }
        else
        {
            // hide Show all data
            $('#rhapsody__dataModel').addClass('d-none');
            this.selMain.sel2.handleFileLevel();
        }
    }

    // show relevant selects
    setSelectsVisibility()
    {
        // hide others, show self
        $('#sel1').removeClass('d-none');
        $('#sel2').addClass('d-none');
        $('#sel3').addClass('d-none');
    }
}

// control #sel2
class Sel2Controller
{
    constructor(selectsMainController)
    {
        this.selMain = selectsMainController;
        this.currentlySelected; // stores currently selected data-filename attribute value
    }

    // called by sel1 controller
    handleFileLevel()
    {
        this.init();
        this.fillSelect();
        this.bidEvents();
        this.setSelectsVisibility();
    }

    // remove options that may have been created before, clear selected
    init()
    {
        this.currentlySelected = undefined;

        $("#sel2").find('option').each(function(){
            if(!$(this).hasClass('meta-data')) // keep '<option>' with that class
            {
                $(this).remove(); // remove events as well
            }
        });

        // select "Select file" as selected
        $('#sel2 option[value="description"]').prop('selected',true);
    }

    fillSelect()
    {
        var filesArray = this.selMain.reader.getFilesListBySectionClass('.rhapsody__dataModel_section--'+this.selMain.sel1.currentlySelected);
        for(var i=0; i<filesArray.length;i++)
        {
            $("#sel2").append('<option value="'+filesArray[i]+'">'+filesArray[i]+"</option>");
        }
    }

    bidEvents()
    {
        var $this = this;
        $("#sel2").on('change',function(){
            $this.currentlySelected = $("#sel2 option:selected").val();
            $this.handleChange(); // trigger sel3 logic
        });
    }

    setSelectsVisibility()
    {
        $('#sel2').removeClass('d-none');
    }

    handleChange()
    {
        // for variables and dependencies open compare app at this point
        if('variables' == this.selMain.sel1.currentlySelected)
        {
            // this.selMain.sel1.currentlySelected is section name
            // this.currentlySelected is filename (data-filename)
            var itemsList = this.selMain.reader.getItemsListBySectionAndFilename(
                this.selMain.sel1.currentlySelected, this.currentlySelected
            );
            var header = this.selMain.sel1.currentlySelected;
            var column1 = new Column(itemsList, header);

            this.selMain.comparator.open2ColumnsComparer(column1);
        }
        else if('dependencies'  == this.selMain.sel1.currentlySelected)
        {
            var itemsList = this.selMain.reader.getItemsListBySectionAndFilename(
                this.selMain.sel1.currentlySelected, this.currentlySelected
            );

            this.selMain.comparator.openChecklistComparer(itemsList);
        }
        else if('types'  == this.selMain.sel1.currentlySelected)
        {
            var itemsList = this.selMain.reader.getItemsListBySectionAndFilename(
                this.selMain.sel1.currentlySelected, this.currentlySelected
            );

            var header = this.selMain.sel1.currentlySelected;
            var column1 = new Column(itemsList, header);
            this.selMain.comparator.open2ColumnsComparer(column1);
        }
        else
        {
            // for functions and types proceed to sel3
            this.selMain.sel3.handleFileLevel();
        }
    }
}

// control #sel3
class Sel3Controller
{
    constructor(selectsMainController) {
        this.selMain = selectsMainController;
        this.currentlySelected; // cstores currently selected item
    }

    // called by Sel2Controller::handleChange()
    handleFileLevel()
    {
        this.init();
        this.fillSelect();
        this.bidEvents();
        this.setSelectsVisibility();
        //console.log(this.selMain.sel2.currentlySelected);
    }

    // remove options that may have been created before, clear selected
    init()
    {
        var $this = this;
        this.currentlySelected = undefined;

        $("#sel3").find('option').each(function () {
            if (!$(this).hasClass('meta-data')) // keep system options, like 'select item' option
            {
                $(this).remove(); // remove events as well
            }
        });

        // hide/show relevant options
        $("#sel3").find('option').each(function () {
            if (!$(this).hasClass('meta-common') && !$(this).hasClass('meta-'+$this.selMain.sel1.currentlySelected) ) // keep 'select item' option
            {
                $(this).addClass('d-none'); // hide not common or not current choosen section options
            }
            else
            {
                $(this).removeClass('d-none'); // unhide common or not current choosen section options
            }
        });

        // select "Select item" as selected
        $('#sel3 option[value="description"]').prop('selected',true);

        $('#sel4').addClass('d-none');
    }

    fillSelect()
    {
        var htmlClass = '.rhapsody__dataModel_section--'+this.selMain.sel1.currentlySelected;

        if('functions'==this.selMain.sel1.currentlySelected)
        {
            var functionsArray;
            functionsArray = this.selMain.reader.getItemsListBySectionAndFilename(
                this.selMain.sel1.currentlySelected, // section name
                this.selMain.sel2.currentlySelected // file name
            )

            //console.log('array: '+functionsArray);

            for(var i=0; i<functionsArray.length;i++)
            {
                $("#sel3").append('<option value="'+functionsArray[i]+'">'+functionsArray[i]+"()</option>");
            }
        }

        // use this.reader to get items you need

        //var fileNode = $(elem).find("[data-filename='"+this.selMain.sel2.currentlySelected+"']");
        //console.log(fileNode);
    }

    bidEvents()
    {
        var $this = this;
        $("#sel3").on('change',function(){
            $this.currentlySelected = $("#sel3 option:selected").val();
            $this.handleChange(); // trigger sel3 logic
        });
    }

    handleChange()
    {
        $('.rhapsody__comparer').addClass('d-none'); // hide comparers

        if('compare-all'==this.currentlySelected)
        {
            // list functions list
            var functionsArray;
            functionsArray = this.selMain.reader.getItemsListBySectionAndFilename(
                this.selMain.sel1.currentlySelected, // section name
                this.selMain.sel2.currentlySelected // file name
            );

            var header = 'Rhapsody functions';
            var column1 = new Column(functionsArray, header);

            this.selMain.comparator.open2ColumnsComparer(column1);

            //this.selMain.comparator.openListItems(functionsArray);
        }
        else
        {
            // get needed parameters values
            var fnctObj;
            // get ABOVE
            fnctObj = this.selMain.reader.getFunctionPropertiesAsObjectByFilenameAndFunctionname(
                this.selMain.sel2.currentlySelected, // file name
                this.currentlySelected // function name
            );


            // show function comparator
            this.selMain.comparator.openFunctionsComparer(fnctObj);
        }
    }

    setSelectsVisibility()
    {
        $('#sel3').removeClass('d-none');   
        $('#sel4').addClass('d-none');
    }
}

// MAIN CLASS to control select group with id #rhapsody__selector included in rhapsodyCheckerTemplate.php
class SelectControl
{
    constructor()
    {
        this.reader = new HtmlDataReader();
        this.comparator = new Comparator();
        this.sel1 = new Sel1Controller(this);
        this.sel2 = new Sel2Controller(this);
        this.sel3 = new Sel3Controller(this);
    }

    control()
    {
        //this.control1();
        //this.control2();
        //this.control3();
    }
}

$(document).ready(function(){

    var select;
    select = new SelectControl();
    //select.control();
});