// pass array of this objects to ComparatorChecklist
class ComparatorChecklistInput
{
    constructor()
    {
        this.name ='unknown';
        this.nameDescription = 'unknown';
    }
}

class ComparatorChecklist
{
    constructor(/*array of ComparatorChecklistInput*/ listObjects)
    {
        this.listObjects = listObjects;
    }

    clear()
    {
        // clear fields
    }

    compare()
    {
        $('#comparer-checklist').removeClass('d-none');
        // first remove previous html

        // append html based on passed objects

        // show list
    }

}