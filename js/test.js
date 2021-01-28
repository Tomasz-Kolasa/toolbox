

function test()
{
    //let hex = (-32760).toString(16).toUpperCase(); // should be 0x8008, and it is -0x7FF8
    //hex = hex.slice(1); //remove - sign


    // this calc is for: signed number to hex
    //add 0xFF 0xFFFF 0xFFFFFFFFF depends on type
    let n =  0xFFFFFFFF + -129 + 1;
    console.log( n.toString(2).toUpperCase() );

    //this calc if for: unsigned number to hex
    //you need to add bits on front
    n = 511;
    console.log( n.toString(16).toUpperCase() );
}

function test2()
{
    var isPatternOk;
    var sign = "S";
    var pattern = ( "S" == sign ) ? /^\-?[0-9]{1,10}$/i : /^[0-9]{1,10}$/i;

    var str = "-12345678901";
    str = str.split(",");
    for(let i=0; i<str.length; i++)
    {
        isPatternOk = pattern.test( str[i] );
        console.log( str[i] + ": " + isPatternOk );
    }

}

function test3()
{
        var number = ",_0Bb'";
        var isNumberOk = /^[a-zA-Z0-9_,]*$/i.test( number );
        console.log( isNumberOk );
}

function runTest()
{
    test3();
}   

// test();