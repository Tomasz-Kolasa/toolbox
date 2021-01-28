class PageEvents
{
    constructor()
    {
        this.keyIsDown = false; // prevents keypress repeating 
    }

    bidCopyEvent()
    {
        $(".output").on("click",function()
        {
            if( "" == $(this).val() || "-" == $(this).val() )
            {
                return;
            }
    
            $(this).select();
            document.execCommand("copy");
            $(this).addClass("copied");
            var classRemoveFct = function( that ){
                that.removeClass("copied");
            }
            setTimeout(classRemoveFct, 300, $(this));
        });
    }

    bidShowInvertedEvent( dataDisplayer )
    {
        var switchKey = 17; // CTRL

        // show inverted
        $(document).on("keydown", function(e)
        {
            // if switch key is JUST pressed 
            if( (switchKey == e.keyCode) && (! this.keyIsDown) )
            {
                // there is no object data before the first casting
                if( undefined != dataDisplayer.dataObj )
                {
                    this.keyIsDown = true;
                    $(".type-label").addClass("label-inverted");
                    dataDisplayer.putOutputDataChunkOnThePage( dataDisplayer.dataObj.hex.getData(), "inverted", "H" );
                    dataDisplayer.putOutputDataChunkOnThePage( dataDisplayer.dataObj.dec.getData(), "inverted", "D" );
                }
                else
                {
                    // do nothing
                }
            }
            else
            {
                // do nothing
            }            
        });

        //show normal
        $(document).on("keyup", function(e)
        {
            if( switchKey == e.keyCode )
            {
                // there is no object data before the first casting
                if( undefined != dataDisplayer.dataObj )
                {
                    this.keyIsDown = false;
                    $(".type-label").removeClass("label-inverted");
                    dataDisplayer.putOutputDataChunkOnThePage( dataDisplayer.dataObj.hex.getData(), "normal", "H" );
                    dataDisplayer.putOutputDataChunkOnThePage( dataDisplayer.dataObj.dec.getData(), "normal", "D" );
                }
                else
                {
                    // do nothing
                }
            }
            else
            {
                // do nothing
            }
        });
    }

    // if sign select changed fire onchange event for not empty field
    bidSignChangeEvent()
    {
        $("input[name='sign']").on('change',this.recalculate);
    }

    // if user toggle prefix checkbox
    bidHexPrefixEvent()
    {
        $("input[name='hex-prefix']").on('change',this.recalculate);
    }

    // casting has to be recalculated
    // trigger event for appropriate field
    recalculate()
    {
        var val, changeId;
        val = $('#input-number--hex').val();
        //if hex field empty fire onchange for the other
        changeId = ("" == val) ? "#input-number--dec" : "#input-number--hex";

        $(changeId).trigger("input");
    }
}


class BinaryNumber
{
    constructor()
    {
        this.bits = "00000000000000000000000000000000"; // 32bit number
    }

    add32bitNumber( number )
    {
        var isNumberOk = /^[01]{32}$/i.test( number );
        if( isNumberOk )
        {
            this.bits = number;
        }
        else
        {
            throw new Error("BinaryNumver::add32bitNumber() not a 32bit number");
        }
    }

    getBits( length ) //: byte, word, dword requested bits of this.bits
    {
        var words = [8,16,32];
        if ( -1 == words.indexOf( length) )
        {
            throw new Error("BinaryNumver::getBits() wrong value");
        }

        return this.bits.slice(-length);
    }

    fillTo32bit( binNo, bit ) //: bin number filled with given bit value to 32bit number
    {
        for(let i=binNo.length; i<32; i++)
        {
            binNo = bit + binNo;
        }
        return binNo;
    }
}

// this is an abstract class - a proper data converter specific to a compiler
class CompilerConverter
{
    constructor()
    {
        this.rawInput = "";
        this.sign = undefined;
        this.convertingFrom = undefined; // type and value user input is converted from
        this.failReason = "Reason unknown";
    }

    setFailReason( str )
    {
        this.failReason = str;
    }

    getFailReason()
    {
        return this.failReason;
    }

    getConvertingFrom()
    {
        return this.convertingFrom;
    }

    putInDataTypes( binNumber, outDataCont )
    {
        var system = outDataCont.getData();
        var hexType = system.hex;
        var decType = system.dec;

        //put in HEX types
        this.putInHexType( "U8", binNumber.getBits(8), hexType );
        this.putInHexType( "S8", binNumber.getBits(8), hexType );
        this.putInHexType( "U16", binNumber.getBits(16), hexType );
        this.putInHexType( "S16", binNumber.getBits(16), hexType );
        this.putInHexType( "U32", binNumber.getBits(32), hexType );
        this.putInHexType( "S32", binNumber.getBits(32), hexType );

        //put in DEC types
        this.putInDecType( "U8", binNumber.getBits(8), decType );
        this.putInDecType( "S8", binNumber.getBits(8), decType );
        this.putInDecType( "U16", binNumber.getBits(16), decType );
        this.putInDecType( "S16", binNumber.getBits(16), decType );
        this.putInDecType( "U32", binNumber.getBits(32), decType );
        this.putInDecType( "S32", binNumber.getBits(32), decType );
        
    }

    // outputs DEC numbers
    // puts relevant width binary number in given data type - both normal and inverted
    // eg. 11111111 in U8.normal and U8.inverted
    putInDecType( dataType, bits, decType )
    {
        var decValue, invDecValue;
        var invBits, msb;
        var typeSign = dataType.slice(0,1);

        switch( typeSign )
        {
            case "U":
                invBits = this.getInvertedBinaryNumber( bits );
                decValue = this.bin2decUnsigned( bits );
                invDecValue = this.bin2decUnsigned( invBits );
            break;
            case "S":
                invBits = this.getInvertedBinaryNumber( bits );

                decValue = this.bin2decSigned( bits );
                invDecValue = this.bin2decSigned( invBits );
            break;
            default:
                throw new Error("CompilerConverter::putInDecType wrong sign.");
        }
        //put the result down
        decType.type[dataType].normal = decValue;
        decType.type[dataType].inverted = invDecValue;
    }

    // outputs DEC numbers
    // puts relevant width binary number in given data type - both normal and inverted
    // eg. 11111111 in U8.normal and U8.inverted
    putInHexType( dataType, bits, hexType )
    {
        var invBits;
        invBits = this.getInvertedBinaryNumber( bits );
        hexType.type[dataType].normal = this.bin2hexExact( bits );
        hexType.type[dataType].inverted = this.bin2hexExact( invBits );
    }

    getAsClosestDataType( bin )//: 8,16 or 32 bit binary number
    {
        // fill bin with zeros until you reach closest data type length
        for(let i=bin.length; i<33; i++)
        {
            if( 8==i || 16==i || 32==i)
            {
                break;
            }
            bin = "0" + bin;
        }
        return bin;
    }

    // converts bin as signed type
    bin2decSigned( bin )
    {
        var decValue;
        var msb = bin.slice( 0, 1 ); // most significant bit
        if( "0" == msb )
        {
            decValue = parseInt( bin, 2);
        }
        else // MSB == 1
        {
            let length, min;
            length = bin.length;

            switch( length )
            {
                case 8:
                    min = -128;
                break;
                case 16:
                    min = -32768;
                break;
                case 32:
                    min = -2147483648;
                break;
                default:
                    throw new Error("CompilerConverter::bin2decSigned() wrong bin length.");
            }
            bin = bin.slice(1);
            decValue = min + parseInt( bin, 2 );
        }
        return decValue;
    }

    // converts bin as unsigned type
    bin2decUnsigned( bin )
    {
        return parseInt( bin, 2);
    }

    // param bin - 1 and only one hex digit/letter
    hex2bin( hex )//: 4 bits bin string
    {
        var str = "0000";
        str = str + parseInt( hex, 16 ).toString(2);
        return str.slice(-4);
    }

    hex2binExact( hex )//:exact binary translation
    {
        var bin = "";
        for(let i=0; i<hex.length; i++)
        {
            bin += this.hex2bin( hex[i] );
        }
        return bin;
    }

    bin2hex( bin )
    {
        return parseInt( bin, 2 ).toString(16).toUpperCase();
    }

    bin2hexExact( bin )//:each 4bits translated one by one
    {
        var arr;
        var number = "";
        var arr = bin.match(/.{1,4}/g); // split each 4 bits to array
        for( let i=0; i<arr.length; i++ )
        {
            number += this.bin2hex( arr[i] );
        }
        return number;
    }

    //parameter bn: 32 bit binary number
    getInvertedBinaryNumber( bn )//:given binary number inverted
    {
        let inv = "", i;
        for(i=0; i<bn.length; i++)
            {
                (bn.slice(i,i+1) == "1") ? inv+="0" : inv+="1";
            }
        return inv;
    }

    dec2bin( input ) //: raw binary number
    {
        var bin;
        var dec = parseInt( input, 10 );
        if( 0 > dec )
        {
            dec = 0xFFFFFFFF + dec + 1;
        }
        bin = dec.toString(2);

        return bin;
    }

}

//this is a proper GCC HEX data converter
class GCCHexConverter extends CompilerConverter
{
    constructor( dataContainer, rawInput, sign  )
    {
        super();
        this.outputDataContainer = dataContainer; // stores converted to C types data
        this.rawInput = rawInput;
        this.sign = sign;
    }

    setConvertingFrom( bin )
    {
        var val;
        val = this.sign + bin.length + " 0x" + this.bin2hexExact( bin );
        this.convertingFrom = val;
    }

    // must set fail reason in case of failure
    isInputConvertable()
    {
        var chunk, isPatternOk;
        var str = this.rawInput;

        // remove hex prefix if there is one as it has to be removed anyway
        if( this.rawInput.length > 2 )
        {
            chunk = str.slice(0,2);
            if("0x" == chunk || "0X" == chunk)
            {
                str = str.slice(2); //remove first two characters
            }
        }
    
        isPatternOk = /^[a-f0-9]{1,8}$/i.test( str );
        // if string matches our needs
        if( isPatternOk )
        {
            this.rawInput = str;
            return true;
        }
        else // check if input is a proper hex number, which wold have ment it's just bigger than 32bits
        {
            isPatternOk = /^[a-f0-9]{9,}$/i.test( str );
            if( isPatternOk )
            {
                this.setFailReason("Maximum 32 bit numbers are supported.");
            }
            else
            {
                //string not convertable
                this.setFailReason("Input is not a hexadecimal number.");
            }
            return false;
        }
    }

    getBinaryNumber() //:binary number object
    {
        var binaryNumber = new BinaryNumber();
        var bin = this.hex2binExact( this.rawInput );
        bin = this.getAsClosestDataType( bin );

        // this will be used to provide user feedback about actual C type and value that is converted
        this.setConvertingFrom( bin );

        var msb = bin.slice(0,1); // get the most significant bit

        switch( this.sign )
        {
            case "S":
                // 1FE
                bin = binaryNumber.fillTo32bit( bin, msb );
            break;
            case "U":
                bin = binaryNumber.fillTo32bit( bin, "0" );
            break;
            default:
                throw new Error("GCCHexConverter::getBinaryNumber() wrong sign");
        }

        binaryNumber.add32bitNumber( bin );
        return binaryNumber;
    }
}

//this is a proper GCC DEC data converter
class GCCDecConverter extends CompilerConverter
{
    constructor( dataContainer, rawInput, sign )
    {
        super();
        this.outputDataContainer = dataContainer; // stores converted to C types data
        this.rawInput = rawInput;
        this.sign = sign;
    }

    isInputConvertable()
    {
        var isInputPatternOk, isRangeOk;
        var isRangeOk = false;
        var str = this.rawInput;
        var retVal = false;
        var pattern;

        //check input pattern
        pattern = ( "S" == this.sign ) ? /^\-?[0-9]{1,10}$/i : /^[0-9]{1,10}$/i;
        isInputPatternOk = pattern.test( str );

        //check range
        if( isInputPatternOk )
        {
            isRangeOk = this.isDecimalRangeOk( str );
            if( isRangeOk )
            {
                retVal = true;
            }
            else
            {
                this.setFailReason("Maximum 32 bit numbers are supported.");
                retVal = false;
            }
        }
        else // number out of range or NaN;
        {
            let isNumber;
            //check range pattern
            pattern = ( "S" == this.sign ) ? /^\-?[0-9]+$/i : /^[0-9]+$/i;
            isNumber = pattern.test( str );
            if( isNumber ) // is number, but sience did not match isInputPatternOk is too big or too small
            {
                this.setFailReason("Maximum 32 bit numbers are supported.");
            }
            else // input is not a number
            {
                this.setFailReason("Input is not a decimal number.");
            }
            retVal = false;
        }

        return retVal;
    }

    // checks if decimal range of given value is ok
    isDecimalRangeOk( str )
    {
        const U32_RANGE_MAX_VALUE = 4294967295;
        const S32_RANGE_MAX_VALUE = 2147483647;
        const S32_RANGE_MIN_VALUE = -2147483648;

        var val, isRangeOk;
        val = parseInt( str, 10 );
        if( "U" == this.sign ) // unsigned type
        {
            isRangeOk = ( U32_RANGE_MAX_VALUE >= val ) ? true : false;
        }
        else // signed
        {
            isRangeOk = ( (S32_RANGE_MIN_VALUE <= val) && (S32_RANGE_MAX_VALUE >= val) ) ? true : false;
        }
        return isRangeOk;
    }

    getBinaryNumber() //:binary number object
    {
        var binaryNumber, bin;

        binaryNumber = new BinaryNumber();
        bin = this.dec2bin( this.rawInput );

        // if input was negative it has 32bit after dec2bin conversion, so nothing is gonna change
        // if it was positive will be filled with 0 to 32bit length
        bin = binaryNumber.fillTo32bit( bin, "0" );
        binaryNumber.add32bitNumber( bin );
        
        // this will be used to provide user feedback about actual C type and value that is converted
        this.setConvertingFrom( bin );

        return binaryNumber;
    }

    setConvertingFrom( bin )
    {
        var val, length;
        var dec = parseInt( this.rawInput );
        if( "U" == this.sign )
        {
            if( dec > 0xFFFF ) //U32
            {
                length = 32;
            }
            else if( dec > 0xFF ) // U16
            {
                length = 16;
            }
            else // U8
            {
                length = 8;
            }
        }
        else //signed
        {
            if( dec >= -128 && dec <= 127 ) // S8
            {
                length = 8;
            }
            else if( dec >= -32768 && dec <= 32767 ) // S16
            {
                length = 16;
            }
            else // S32
            {
                length = 32;
            }
        }

        val = this.sign + length + " " + dec;
        this.convertingFrom = val;
    }

}

class Compiler
{
    constructor()
    {
        this.outputDataContainer = new OutputData(); // stores converted to C types data
        this.conversionFeedback = new ConversionFeedback();
    }

    getConvertedData()
    {
        return this.outputDataContainer.getData();
    }
}

class GCCCompiler extends Compiler
{
    constructor()
    {
        super();
    }

    convert( userInputObj )
    {
        var converter, binNumber, val;
        // get hex, dec or (some day maybe) any other numeral system converter
        converter = this.getConverter( userInputObj );
        if( "" == userInputObj.rawInput )
        {
            this.conversionFeedback.addFailReason("");
            this.conversionFeedback.setConvertedItem( "" );
            this.conversionFeedback.setResult( false );
        }
        else if( converter.isInputConvertable() )
        {
            //convert data
            binNumber = converter.getBinaryNumber();
            converter.putInDataTypes( binNumber, this.outputDataContainer );

            //set feedback info
            val = converter.getConvertingFrom();
            this.conversionFeedback.setConvertedItem(  val );
            this.conversionFeedback.setResult( true );
        }
        else
        {
            //this.conversionFeedback.addFailReason( "Casting failed:" ); // backup general message
            this.conversionFeedback.addFailReason( converter.getFailReason() ); // detailed info
            this.conversionFeedback.setConvertedItem( "-" );
            this.conversionFeedback.setResult( false );
        }


        // ALWAYS RETURN FEEDBACK OBJECT
        return this.conversionFeedback;
    }

    getConverter( userInputObj )
    {
        switch( userInputObj.numeralSystem )
        {
            case "hex":
                return new GCCHexConverter( this.outputDataContainer, userInputObj.rawInput, userInputObj.sign );
            break;

            case "dec":
            default: // just in case
                return new GCCDecConverter( this.outputDataContainer, userInputObj.rawInput, userInputObj.sign );
        }
    }
}

// this class contains all data
// that after conversion are
// to be put on the page by 
class ConversionFeedback
{
    constructor()
    {
        this.success = false;
        this.failReason = [];
        this.convertedItem = ""; // this is user input that has been interpreted as C value
    }

    setConvertedItem( item )
    {
        this.convertedItem = item;
    }

    getConvertedItem()
    {
        return this.convertedItem;
    }

    setResult( res )
    {
        this.success = res;
    }

    getResult()
    {
        return this.success;
    }

    addFailReason( message )
    {
        this.failReason.push( message );
    }

    getFailReason()
    {
        return this.failReason;
    }
}

/* View class*/
/* handles logic of displaying conversion results and user feedback on the page */
class DataDisplayer
{
    constructor()
    {
       // default obj to display
       // needed in case request of displaying inverted numbers before any casting was done
        this.dataObj = undefined;
    }

    addDataObject( data )
    {
        this.dataObj = data;
    }

    displayResult( feedback )
    {
        // display the value being converted
        // user input processed by converter ( converter puts user input into C type before converting )
        this.putConvertedNumber( feedback.convertedItem );

        // update the page with converted data types
        // no matter whether conversion wet ok or not
        // if conversion went wrong ther will be default value "-" or something
        // or you can always create a new DataObject() and fill it with whatever you want 
        this.putOutputDataChunkOnThePage( this.dataObj.hex.getData(), "normal", "H" );
        this.putOutputDataChunkOnThePage( this.dataObj.dec.getData(), "normal", "D" );

        // handle displaying success or false message
        this.putMessage( feedback.getResult(), feedback.getFailReason() );
    }

    // puts message on the page
    putMessage( isSuccess, failReason_arr )
    {        
        var txt = "";
        
        if( isSuccess )
        {
            // txt = "Conversion went ok."; // better of say nothing : )
        }
        else
        {
            //failReason_arr.unshift("Conversion went wrong:");
            txt = failReason_arr.join("<br>");
        }

        $("#message").html( txt );
    }

    putConvertedNumber( val )
    {
        var txt = ((""==val) || ("-"==val)) ? "" : ("casting: " + val);
        $("#converted-number").text( txt );
    }
    
    // puts given single chunk of data on a page
    // param data: data object, i.e. hex or dec data
    // param kind: "normal" or "inverted"
    // param system: H hex, D dec
    putOutputDataChunkOnThePage( data, kind, system )
    {   
        // "0x" prefix for hex
        var prefix = "";
        var isPrefix = $('input[name="hex-prefix"]').prop("checked");
        prefix = ((isPrefix && ("H" == system)) && (data.U8[kind] != "-") ) ? "0x" : "";

        $("#" +system+ "U8").val( prefix + data.U8[kind] );
        $("#" +system+ "U16").val( prefix + data.U16[kind] );
        $("#" +system+ "U32").val( prefix + data.U32[kind] );
        
        $("#" +system+ "S8").val( prefix + data.S8[kind] );
        $("#" +system+ "S16").val( prefix + data.S16[kind] );
        $("#" +system+ "S32").val( prefix + data.S32[kind] );
    }
    
    //marks data field on the page where converted number comes from and clears the other field's mark
    // also clears the other field value sience it's not the one that's being converted
    // called from Conver class
    markDataField( id )
    {
        var clearFieldId = "#";
        //setup active field
        $('.input-field').removeClass("input-field--active");
        $(id).addClass("input-field--active");

        //clear the other field's value
        clearFieldId += ("input-number--hex" == id) ? "input-number--dec" : "input-number--hex";
        $(clearFieldId).val("");
    }
}

// collects data about user input from the webpage
// i.e. numeral system, sign, and the value
class DataCollector
    {
        constructor()
        {
            this.inputData =
            {
                numeralSystem: undefined,
                sign: undefined,
                rawInput: undefined
            }
        }
        
        // collects data about user input from the webpage based on given id
        collect( id )
        {
            this.setNumeralSystem( id );
            this.setRawValue( id );
            this.setSign();
        }
        
        setRawValue( id )
        {
            this.inputData.rawInput = $("#"+id).val();
        }
        
        setNumeralSystem( id )
        {
            switch( id )
            {
                case "input-number--hex":
                    this.inputData.numeralSystem = "hex";
                    break;
                case "input-number--dec":
                    this.inputData.numeralSystem = "dec";
                    break;
                default:
                    // should not get here
            }
        }
        
        // only for hexadecimal number, leave undefined for dec
        // decimal number will be processed later, based on user input
        // as it may be anything
        setSign()
        {
            this.inputData.sign = $('input[name=sign]:checked', '#inputs-form').val();
        }

        getData()
        {
            return this.inputData;
        }
    }

//this class contains data object into which converted number is put
class DataTypes
    {
        constructor()
        {
            this.type = 
            {
                U8:
                {
                    normal: "-",
                    inverted: "-"
                },
                U16:
                {
                    normal: "-",
                    inverted: "-"
                },
                U32:
                {
                    normal: "-",
                    inverted: "-"
                },
                S8:
                {
                    normal: "-",
                    inverted: "-"
                },
                S16:
                {
                    normal: "-",
                    inverted: "-"
                },
                S32:
                {
                    normal: "-",
                    inverted: "-"
                }
            }
        }
        
        // fills object with given string
        // argument string: string to fill the object with
        fill( string = "-")
        {
            for( var prop in this.type )
                {
                    this.type[prop].normal = string;
                    this.type[prop].inverted = string;
                }
        }

        getData()
        {
            return this.type;
        }
    }

// this class is a collection of needed DataTypes objects
// will store the data to be put on the page in particular output fields on the page
class OutputData
    {
        constructor()
        {
            // create and initialize data object
            // contains converted value
            this.system =
            {
                hex: new DataTypes(),
                dec: new DataTypes()
            };
        }
        
        fill( string = "-")
        {
            this.system.hex.fill( string );
            this.system.dec.fill( string );
        }

        getData()
        {
            return this.system;
        }

    }

/* controller class */
class Conver
{
    constructor()
    {
        this.dataCollector = new DataCollector(); // collects data about user input from the webpage
        this.dataDisplayer = new DataDisplayer(); // displays converted data, user feedback etc.
        this.bidEvents();
    }
    
    // this method is called on user input
    convert( inputId, compiler )
    {
        var userInputObj, compiler, feedback, data;
        // gather information about user input
        this.dataCollector.collect( inputId );
        userInputObj = this.dataCollector.getData();

        // marks data input field on the page
        this.dataDisplayer.markDataField( inputId );

        // try convert
        compiler = this.getCompiler( compiler );
        feedback = compiler.convert( userInputObj );
        data = compiler.getConvertedData();

        // display results on the page
        this.dataDisplayer.addDataObject( data );
        this.dataDisplayer.displayResult( feedback );
    }
    
    getCompiler( compiler )
    {
        //for now only GCC supported
        // in the future here the compiler will be choosen based on user choice
        switch( compiler )
        {
            case "GCC":
            default:
                return new GCCCompiler();
        }
    }

    bidEvents()
    {
        var events = new PageEvents();
        events.bidCopyEvent();
        events.bidSignChangeEvent();
        events.bidShowInvertedEvent( this.dataDisplayer );
        events.bidHexPrefixEvent();
    }
}