// handle any user interactions with Line Change Information section
// which is add, remove new row, collect the data filled in, etc
class LineChangeInformationHandler
{
    constructor(cnf = 'no-clear')
    {
        this.clearNewLines = ('clear-new-fields' == cnf) ? true:false;
    }

    // after addinng new Line Change Information
    // keep or clear copied fields values
    handleLastInsertedLineValues()
    {
        if(this.clearNewLines)
        {
            // clear new fields
            $('.line-change-info:last').find('input').each(function(){
                $(this).val('');
            })
        }
        else
        {
            // do nothing, leave copied values
        }
    }

   // control + and - in document .renumber-lines section
    controlAddRemoveLCI( maxLinechanheInformationFields = 10 ) // maximum Line Chane Information fields (.line-change-info)
    {

        const $this = this;

        // remove the last Line Change Information
        $('#line-minus').on('click', function(){
            // remove the last .line-change-info element, but not the only one left
            if( 1 < $('.line-change-info').length )
            {
                $('.line-change-info:last').remove();
            }
            else
            {
                // do nothing, only one .renumber-lines left
            }
        });

        // add Line Change Information
        $('#line-add').on('click', function(){
            // add .line-change-info element if defined limit qty is not reached
            if( maxLinechanheInformationFields > $('.line-change-info').length )
            {
                $('.line-change-info').eq(0).clone(true).appendTo('.renumber-lines');

                $this.handleLastInsertedLineValues();

            }
            else
            {
                // do nothing, limit reached
            }
        });
    }
}

class PageDataCollector
{
    // example output be like this:
    // data[0] = '1, 34-55, 77';

    // data[1].maxLine = 7;
    // data[1].oldLineNo = 2;
    // data[1].newLineNo = 4;
    // ....
    collectPageData(blocks)
    {
        var maxLine, oldLineNo, newLineNo;

        // collect data
        // add lines to renumber array as INDEX[0]
        blocks.push( this.getLinesToRenumberAsArray() );

        // now all line change blocks starts with index[1]
        $(".line-change-info").each(function(index){

            maxLine = parseInt( $(this).find(".max-line").val() ); // described above
            oldLineNo = parseInt( $(this).find(".old-line").val() ); // <-- THIS LINE in the OLD release
            newLineNo = parseInt( $(this).find(".new-line").val() ); // <-- EQUALS THIS LINE in the new release 

            blocks.push({
                maxLine: maxLine,
                oldLineNo: oldLineNo,
                newLineNo: newLineNo,
                feedback: new Array(6) // see LciValidation::doProperCheck() description
                });
        });


        //console.table(blocks[0]); // TEST--
        //console.table(blocks); // TEST--
    }

    // get list of lines and convert to array of integers
    // if the rane given (eg. 12-65) save as multidimensional array
    // example array of ranges:
    // arr[0]=> 2
    // arr[1]=> 4
    // arr[2]=> [5,7] // range 5-7
    //..
    getLinesToRenumberAsArray()
    {
        let arr, i;

        var str = $("#renumerator-lines-box-input").val(); // described above

        arr = str.split(",");

        for(i=0; i<arr.length;i++)
        {
            if(this.isRangeExpression(arr[i]))
            {
                arr[i] = this.getRangeAsArray(arr[i]);
            }
            else
            {
                arr[i] = parseInt(arr[i]);
            }
        }
        // console.table(arr);
        return arr;
    }

    // check if string is Line Range element (indicates range, eq. 45-67)
    isRangeExpression( arrElement )
    {
        let arr;
        arr = arrElement.match(/^[ ]*\d+[ ]*-[ ]*\d+[ ]*$/g); // range may include white spaces at this point
        return (arr === null) ? false : true;
    }

    // evaluate Line Range string element (eq. 56-67) to array of integers
    getRangeAsArray( str )
    {
        let arr;
        arr = str.split("-");

        arr[0] = parseInt(arr[0]);
        arr[1] = parseInt(arr[1]);

        return arr;
    }
}

// validate if array values  containing Line Change Information (created by PageDataCollector::collectPageData)
// are okay to use for calculations
class LciValidation
{
    constructor(validator)
    {
        this.validator = validator;
    }

    // return true or false
    verify()
    {
        var blocks = this.validator.blocks; // Line Change Block Information data

        // index[0] reserved for Lines To Renumber information
        // so Blocks array must have at least 2 indexes 
        if(blocks.length<2)
        {
            return false; // no data
        }
        else
        {
            return this.doProperCheck(); // true or false
        }
    }

    // Unchanged Code Blocks check procedure concept implications and restrictions:
    // ckeck compare indexes properties: maxLine, oldLineNo, newLineNo
    // List of requirements:
    // 0. all can't be NaN
    // 1. all > 0
    // 2. index[x].oldLineNo < index[x].maxLine
    // 3. index[x].oldLineNo > index[x-1].maxLine
    // 4. index[x-1].newLineNo < index[x].newLineNo // 'New line no' should not be smaller or equal to previous 'New line no'
    // 5. any input can't be bigger than 50000
    // --
    // NOTE: this.validator.blocks[i].feedback[errorCode] = true; // index of 'feedback' property set to true means
    //        issue occured and it's requirement list number is the number of 'feedback' property index itself
    // NOTE: error code array length is set in PageDataCollector::collectPageData()
    // NOTE: these code errors (index numbers of .feedback property) are used in View::createFeedbackTxt() to create feedback messages
    // return true or false
    doProperCheck()
    {
        var i, checkPassed = true;

        // start with index[1] as index[0] reserved for Lines To Renumber information
        for(i=1; i<this.validator.blocks.length; i++)
        {
            // 0. check
            if( this.propertiesNaN(this.validator.blocks[i]))
            {
                // one of properties is not a number
                this.validator.blocks[i].feedback[0] = true; // means there is feedback/issue at this point
                checkPassed = false; // check faild
                continue; // other ckecks for this Code Block make no sense as user input is NaN hence incompareable
            }

            // 1. check
            if( this.validator.blocks[i].maxLine<=0 ||
            this.validator.blocks[i].oldLineNo<=0 ||
            this.validator.blocks[i].newLineNo<=0 )
            {
                // one of properties is negative
                this.validator.blocks[i].feedback[1] = true; // means there is feedback/issue at this point
                checkPassed = false; // check faild
                continue; // other ckecks for this Code Block make no sense as user input is NaN hence incompareable
            }

            // 2. check
            if( this.validator.blocks[i].oldLineNo < this.validator.blocks[i].maxLine )
            {
                // check passed
            }
            else
            {
                this.validator.blocks[i].feedback[2] = true; // means there is feedback/issue at this point
                checkPassed = false; // check faild
            }

            // 3. and 4. checks only if there is previous Code Block
            if(i>1)
            {
                // 3. check
                if(this.validator.blocks[i].oldLineNo > this.validator.blocks[i-1].maxLine)
                {
                    // check passed
                }
                else
                {
                    this.validator.blocks[i].feedback[3] = true; // means there is feedback/issue at this point
                    checkPassed = false; // check faild
                }

                // 4. check
                if( this.validator.blocks[i-1].newLineNo < this.validator.blocks[i].newLineNo )
                {
                    // check passed
                }
                else
                {
                    this.validator.blocks[i].feedback[4] = true; // means there is feedback/issue at this point
                    checkPassed = false; // check faild
                }
            }

            // 5. check
            if( this.validator.blocks[i].maxLine>50000 ||
                this.validator.blocks[i].oldLineNo>50000 ||
                this.validator.blocks[i].newLineNo>50000 )
            {
                // one of properties is greater than 50000
                this.validator.blocks[i].feedback[5] = true; // means there is feedback/issue at this point
                checkPassed = false; // check faild
            }
        }

        return checkPassed;
    }

    // check if properties: maxLine, oldLineNo, newLineNo - values are Nan
    propertiesNaN(row)
    {
        for(const property in row )
        {
            if(property=='feedback') // skip 'feedback' property
            {
                continue;
            }
            else
            {
                if( isNaN(row[property]) ) return true; // property value is NaN
            }
        }

        return false; // all properties values were numbers
    }
}

// validate if array values containing Lines To Renumber (created by PageDataCollector::collectPageData() )
// are okay to use for calculations
// at this point there are possible the folowwing values in the array: number positive, number negative, NaN
class LinesToRenumberValidation
{
    constructor(validator)
    {
        this.validator = validator;
        this.feedback = [];
    }

    // do below checks and if check fails set this.feedback[{index of vlaue from linesToRenumberArray}] = {CHECK LIST number}
    // so the View can tell: (feedback[2] !== null) means issue
    // with code code=feedback[2],
    // issue concerns linesToRenumberArray[2]
    // 
    // CHECK LIST
    // 1. is NaN
    // 2. is not positive number
    // 3. range expression A>B (eg. for range 6-34 obviously left operand must be smaller than right one )
    // return true or false
    verify()
    {
        var i, checksPassed = true;
        var linesToRenumberArray = this.validator.blocks[0];
        this.feedback = new Array(linesToRenumberArray.length);

        for( i=0; i<linesToRenumberArray.length; i++ )
        {
            if( this.areElementsNaN(linesToRenumberArray[i]) )
            {
                this.feedback[i] = 1; // code 1: NaN
                checksPassed = false;
                continue; // if is NaN futher checks makes no sense
            }
            
            if( this.areElementsNotPositiveNumbers(linesToRenumberArray[i]) )
            {
                this.feedback[i] = 2; // code 2: not positive numbers
                checksPassed = false;
                continue; // if is NaN futher checks makes no sense
            }
            
            if( this.isBadRange(linesToRenumberArray[i]) )
            {
                this.feedback[i] = 3; // code 3: bad range
                checksPassed = false;
            }
        }
        
        return checksPassed;
    }

    // 1. check
    // elem - value or array
    areElementsNaN( elem )
    {
        if( Array.isArray(elem) )
        {
            return (isNaN(elem[0]) || isNaN(elem[1])) ? true:false;
        }
        else
        {
            return isNaN(elem);
        }
    }

    // 2. check
    // elem - value or array
    areElementsNotPositiveNumbers( elem )
    {
        if( Array.isArray(elem) )
        {
            return (elem[0]<1 || elem[1]<1) ? true:false;
        }
        else
        {
            return elem<1;
        }
    }

    // 3. check
    // elem - value or array
    isBadRange( elem )
    {
        if( Array.isArray(elem) )
        {
            return (elem[0] >= elem[1]) ? true:false;
        }
        else
        {
            return false;
        }
    }
}

// get all user input required to recalculate line numbers
// and verify if such input okay to use for calculations
class Validator
{
    constructor()
    {
        this.blocks = []; // array containing pagecollected data

        this.dataCollector = new PageDataCollector();
        this.lciValidation = new LciValidation(this); // validate Code Blocks
        this.linesToRenumberValidation = new LinesToRenumberValidation(this); // validate array containing line numbers that we want to renumber
    }

    // fill this.blocks with page data
    // verify collected data afterwards
    // return true on successful verification and false on failure
    collectCheckData()
    {
        this.blocks = []; // clear previous

        // collect data
        this.dataCollector.collectPageData( this.blocks );

        // validate collected data
        return (this.lciValidation.verify() && this.linesToRenumberValidation.verify()) ? true:false;
    }

    // returns collected Code Blocks Data 
    getInputDataBlocks()
    {
        return this.blocks;
    }
}

class RecalculatedLinesOutputter
{
    outputSuccess(renumberedLines)
    {
        $("#renumerator-lines-box-output").html( this.createHtml(renumberedLines) );
    }


    createHtml(lines)
    {
        var i, html = '';
        for(i=0;i<lines.length;i++)
        {
            if(Array.isArray(lines[i])) // if range value
            {
                html+= this.highlight(lines[i][0]) + '-'+ this.highlight(lines[i][1]);
            }
            else
            {
                html+= this.highlight(lines[i]);
            }

            if(i<lines.length-1)
            {
                html+=', ';
            }
        }

        return html;
    }

    highlight(obj)
    {
       var color;
       switch(obj.changed) 
       {
           case 0: // line changed
                color = "#0000FF"; // blue
                break;
           case 1: // line remains the same
                color = "#000000"; // black
                break;
           case 2: // line to be reviewed
                default: // should never get to default
                color = "#FF0000"; // red
       }
        return '<span style="color: ' + color + ';">' + obj.line + '</span>';
    }


}

// based on given data updates the page
class View
{
    
    constructor()
    {
        this.recalulatedLinesOutputter = new RecalculatedLinesOutputter();
        // TODO: move Unchanged Code Blocks feedback and Lines To renumber feedback into subclasses
    }

    setFeedbackTxt( $txt = "&nbsp;" ) // default: clear feedback
    {
        $('.renumerator-info').html($txt);
    }
    
    // prints out Collected Data Object feedback. Input data was considered not to be ok
    setFailFeedback( blocks, linesToRenumFeedback )
    {
        this.setFeedbackTxt(
            this.getUnchangedCodeBlocksFeedbackHTML(blocks) +
            '<br>'
            + this.getLinesToRenumberFeedbackHTML(linesToRenumFeedback)
        );
    }

    getLinesToRenumberFeedbackHTML(lines)
    {
        var i, feedbackTxt = '';
        // loop through array wi
        for(i=0; i<lines.length; i++)
        {
            if((undefined !== lines[i]) && (null !== lines[i]))
            {
                feedbackTxt+='Lines To Renumber: ';
                switch(lines[i])
                {
                    case 1:
                        feedbackTxt+='Value is not a number';
                        break;
                    case 2:
                        feedbackTxt+='Value must be positive';
                        break;
                    case 3:
                        feedbackTxt+='Unsupported range entry';
                        break;
                    default:
                        //console.log(lines[i]);
                        feedbackTxt+='Unsupported entry';
                }
                feedbackTxt+=' near '+ (i+1) +'. element.<br>';
            }
            else
            {
                // no issue with this value
            }
        }

        return feedbackTxt;
    }

    getUnchangedCodeBlocksFeedbackHTML(blocks)
    {
        var i, x, feedbackTxt='';

        // INDEX[0] reserved for Lines To Renumber
        for(i=1; i<blocks.length; i++)
        {
            // loop through 'feedback' property
            for(x=0;x<blocks[i].feedback.length;x++)
            {
                if(true === blocks[i].feedback[x]) // if there is feedback necessery
                {
                    // if there is a set
                    feedbackTxt = this.createFeedbackTxt(feedbackTxt,i,x);
                }
            }
        }

        return feedbackTxt;
    }

    // create text that will be put on the page
    createFeedbackTxt(feedbackTxt, codeBlockNumber, errorCode)
    {
        feedbackTxt += 'Code Block '+codeBlockNumber+': ';
        switch(errorCode)
        {
            case 0:
                feedbackTxt += 'Input values must be numbers.';
                break;
            case 1:
                feedbackTxt += 'Input values must be greater than 0.';
                break;
            case 2:
                feedbackTxt += "'Old line no' must be smaller than 'Max line'.";
                break;
            case 3:
                feedbackTxt += "'Old line no' must be bigger tha previous row 'Max line'";
                break;
            case 4:
                feedbackTxt += "'New line no' should be greater than previous 'New line no'";
                break;
            case 5:
                feedbackTxt += 'Maximum input value is 50000';
                break;
            default:
                feedbackTxt += 'Nieprawidłowe dane.';
        }
        return feedbackTxt+='<br>';
    }

    // clear lines-box-output
    clearOutput()
    {
        // clear the old output
        $("#renumerator-lines-box-output").html("");
    }

    // View in case of successful renumering
    // param: array with renumered blocks
    outputSuccess( renumberedLines )
    {
        this.setFeedbackTxt(); // clear feedbak text cos renumering went ok
        this.recalulatedLinesOutputter.outputSuccess(renumberedLines);
        //console.log( renumberedLines );
    }
}

class Calculator
{
    constructor()
    {
        this.blocksRenumbered = []; // save renumered lines here
        this.unchangedCodeBlocks = []; // extract Unchanged Code Blocks here (from this.renumber(blocks))
        this.linesToRenumber = []; // extract Lines To Renumber here (from this.renumber(blocks))

        // ** holds the current line being analyzed Change Code **
        // currentLine.line // line number
        // currentLine.changed - 0=changed, 1=remains the same, 2=to be reviewed
        this.currentLineChangeCode = undefined;
    }

    // should be called once to set determinated line change code
    // so the value hold by this.currentLineChangeCode which hold the code
    // should be reset after read, so script errors could be easier to catch
    getChangeCode()
    {
        let code = this.currentLineChangeCode;
        this.currentLineChangeCode = undefined; // reset
        return code;
    }

    renumber( blocks )
    {
        this.blocksRenumbered = []; // reset
        this.currentLineChangeCode = undefined; // reset

        this.extractData(blocks);
        // renumber blocks add .renumbered bool property so the view may color it
        
        this.recalculate();

        return this.blocksRenumbered;
    }

    // do the math : )
    recalculate()
    {
        var i,x, val;
        // loop through the lines to renumber
        for(i=0;i<this.linesToRenumber.length;i++)
        {
            // loop through code blocks and check if line number needs to be renumered
            if(Array.isArray(this.linesToRenumber[i])) // range value eq. Array([0]=>34, [1]=>67)
            {
                // prepare result objects
                this.blocksRenumbered[i] = new Array(
                    {line:undefined,changed:undefined},
                    {line:undefined,changed:undefined}
                    ); // result will be 2 elements array


                // recalculate index[0] (range start)
                val = this.calculateLine( this.linesToRenumber[i][0] );
                // save in blocksRenumered
                this.saveResult(this.blocksRenumbered[i][0], val);

                // recalculate index[1] (range end)
                val = this.calculateLine( this.linesToRenumber[i][1] );
                // save in blocksRenumered
                this.saveResult(this.blocksRenumbered[i][1], val);
            }
            else
            {
                // prepare result object
                this.blocksRenumbered[i] = {line:undefined,changed:false};

                val = this.calculateLine( this.linesToRenumber[i] );
                // save in blocksRenumered
                this.saveResult(this.blocksRenumbered[i], val);
            }
        }
    }

    // save calculated line number in specified blockRenumbered[x] object
    // and saves information if (or how) the line number was changed, which is necessery for the View
    saveResult(obj, val)
    {
        // save in blocksRenumered

        obj.line = val;  // save value
        obj.changed = this.getChangeCode(); // save determinated Change Code
    }

    // calculate line number against ALL Unchanged Code Block definitions
    // return calculated line number
    calculateLine( lineNo )
    {
        var i, res;
        // loof through Unchanged Code Blocks
        for( i=1; i<this.unchangedCodeBlocks.length; i++ ) // Unchanged Code Blocks strats with index 1
        {
            if(false !== (res=this.getLineNumber( this.unchangedCodeBlocks[i], lineNo )))
            {
                // if renumered line returned
                lineNo = res;
                break; // no need to check further, as single Line Number can not be in more than one Unchanged Code Block
                // NOTE: in addition to mentioned above, proceeding this loop could be used for verification if eneterd code blocks covers the same range, which would be an issue
            }
        }

        // return new or unchanged line number
        return lineNo;
    }

    // calculate line number against SINGLE Unchanged Code Block definition
    // and set change code in this.currentLineChangeCode
    // return new line no or false if no need to recalculate
    getLineNumber(blockData, lineNo)
    {
        var offset;
        // calculate offset
        offset = blockData.newLineNo - blockData.oldLineNo;

        // if given Line Number is within the Unchanged Block of Code
        if( lineNo>=blockData.oldLineNo && lineNo<=blockData.maxLine)
        {
            // determinate Change Code
            if(0==offset)
            {
                this.currentLineChangeCode = 1; // line remains the same
            }
            else
            {
                this.currentLineChangeCode = 0; // line changed
            }

            return lineNo+offset; // return new line number
        }
        
        // given Line Number is NOT within the Unchanged Block of Code
        // NOTE: if found in another Code Block(see calculateLine()) the Change Code that is set below will be overwritten
        this.currentLineChangeCode = 2; // line to be reviewed
        return false;
    }

    // blocks[] consists of:
    // blocks[0] Lines To Renumber array
    // Unchanged Code Blocks starts from blocks[1] (has properties properties: maxLine, oldLineNo, newLineNo, feedback)
    // split this data into 2 separate properties for easy handling
    extractData(blocks)
    {
        // extract Lines To Renumber
        this.linesToRenumber = blocks[0];

        // extract Unchanged Code Blocks
        this.unchangedCodeBlocks = blocks;
    }
}

// main class for Renumerator feature
class Renumerator
{
    constructor()
    {
        this.lcih = new LineChangeInformationHandler('clear-new-fields');
        this.lcih.controlAddRemoveLCI(100); // maximum Line Chane Information fields (.line-change-info)

        this.validator = new Validator();
        this.calculator = new Calculator();
        this.view = new View();

        this.bidPageEvents();
    }

    run()
    {
        var $this = this;
        $("#renumerator-renumber").on("click", function(){

            $this.view.clearOutput();

            // collect & check input data
            if( $this.validator.collectCheckData() )
            {
                // data ok
                // get input data as object and renumber it

                var renumberedLines;

                renumberedLines = $this.calculator.renumber( $this.validator.getInputDataBlocks() );

                $this.view.outputSuccess( renumberedLines );
            }
            else
            {
                // output feedback
                $this.view.setFailFeedback(
                    $this.validator.blocks, // contains feedback Code Blocks input as well as 'feedback' property with error codes
                    $this.validator.linesToRenumberValidation.feedback // array with error codes of anallyzed Lines To Renumber string
                    );
            }
        });
    }

    // bid buttons behaviour
    bidPageEvents()
    {
        var $this = this;
        // bid clear
        $("#renumerator-clear").on('click', function()
        {
            $('#renumerator-lines-box-input').val("");
            $('#renumerator-lines-box-input, #renumerator-lines-box-output').html("");
            $('#renumerator-lines-box-input').focus();
        });

        $("#renumerator-copy").on("click", function()
        {
            if("" == $("#renumerator-lines-box-output").html())
            {
                $this.displayCopyFeedback("Empty !");
            }
            else
            {
                var elm = document.getElementById("renumerator-lines-box-output");

                if(document.body.createTextRange)
                {
                    var range = document.body.createTextRange();
                    range.moveToElementText(elm);
                    range.select();
                    document.execCommand("Copy");
                    $this.displayCopyFeedback("Copied !");
                }
                else if(window.getSelection)
                {
                    // other browsers
                    var selection = window.getSelection();
                    var range = document.createRange();
                    range.selectNodeContents(elm);
                    selection.removeAllRanges();
                    selection.addRange(range);
                    document.execCommand("Copy");
                    $this.displayCopyFeedback("Copied !");
                }
            }
        });
    }

    displayCopyFeedback(txtToDisplay)
    {
        $("#renumerator-copy").text(txtToDisplay);
        setTimeout(function(){
            $("#renumerator-copy").text("Copy");
        },1000);
    }
}