<?php
// used by RhapsodySectionReader::printItemsNames()
?>
<ul>
    <?php foreach($listThisItem as $key=>$properies): ?>
    <li> <!--property-->
        <h3><?=$key;?></h3>
        <ul>
            <?php foreach($properies as $object): ?>
            <li><?=$object->getName();?></li> <!--property list item-->
            <?php endforeach ?>
        </ul>
    </li>
    <?php endforeach ?>
</ul>