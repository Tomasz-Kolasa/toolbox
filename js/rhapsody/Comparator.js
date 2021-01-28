// compare function code vs rhapsody
class ComparatorFunctions
{
    // hide comparer and clear their data
    clear()
    {
        // add  clear fields
    }

    compare(fnctObj)
    {
        $('#comparer-functions--rhapsody-varsRead').html(fnctObj.varRead.join("\r\n"));
        $('#comparer-functions--rhapsody-varsWrite').html(fnctObj.varWrite.join("\r\n"));
        $('#comparer-functions--rhapsody-varsReadWrite').html(fnctObj.varReadWrite.join("\r\n"));
        $('#comparer-functions--rhapsody-usedFunctions').html(fnctObj.usedFunctions.join("\r\n"));
        $('#comparer-functions').removeClass('d-none');
    }
}

// compare a list of items code vs rhapsody
class Comparator2Columns
{
    // hide comparer and clear their data
    clear()
    {
        // add  clear fields
    }

    compare(col1, col2)
    {
        $('#comparer-2columns__col1').val(col1.data.join("\r\n"));
        $('#comparer-2columns').removeClass('d-none');
        //console.log(col1);
    }
}


// put given array as list on the page (#comparer-listItems)
class ListItems
{
    clear()
    {
        $('#comparer-listItems--container').html('');
    }

    listItems(arr)
    {
        var list = arr.join('<br>');
        $('#comparer-listItems--container').html(list);
        $('#comparer-listItems').removeClass('d-none');
    }
}

// compare rhapsody vs code
// - 2 window comparer - dependencies and variables and types probably
// - dedicated functions comparer
class Comparator
{
    constructor()
    {
        this.compFncts = new ComparatorFunctions();
        this.comp2cols = new Comparator2Columns();
        this.compChklist = new ComparatorChecklist();
        this.listItems = new ListItems();
    }

    // hide comparers and clear their data
    prepareDocument()
    {
        // hide all comparers
        $('.rhapsody__comparer').each(function()
        {
            $(this).addClass('d-none');
        });

        // clear their firlds
        this.compFncts.clear();
        this.comp2cols.clear();
        this.compChklist.clear();
        this.listItems.clear();
    }

    // arg col1, col2 objects Column
    open2ColumnsComparer(col1, col2)
    {
        this.prepareDocument();
        this.comp2cols.compare(col1, col2);
    }

    openChecklistComparer(arr)
    {
        this.prepareDocument();
        this.compChklist.compare(arr);
    }

    openFunctionsComparer(fnctObj)
    {
        this.prepareDocument();
        this.compFncts.compare(fnctObj);
    }

    openListItems(arr)
    {
        this.prepareDocument();
        this.listItems.listItems(arr);
    }
}

// contains the needed to generate the column
// used as argument of some Comperator methods
class Column
{
    header; // column title
    data = []; // the data to be put in column

    constructor(data, header)
    {
        this.data = data;
        this.header = header; // column title
    }
}