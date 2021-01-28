<?php
/*
    this html is generated based on data read from rhpasody sbs->xml file
    this html is used by javascript to read such data by HtmlDataReader class
    also can be shown to user

    NOTE: all data read by js are read from data-* attribute

    IMPORTANT: do not change any html classes names or id's - they are used by js to extract data as well
*/
?>
<div id="rhapsody__dataModel" class="rhapsody__dataModel <?= $visibility ?>">
    <div class="rhapsody__dataModel_section rhapsody__dataModel_section--dependencies">
        <h2 data-sectionName="dependencies">dependencies</h2>
        <ul>
            <!-- MODULE LEVEL DEPENDENCIES -->
            <?php foreach ($this->xmlReader->getSectionDataModel('dependencies')['module'] as $key => $properies) : ?>
                <li class="moduleLevel"
                    data-moduleLevel="<?= $key ?>"
                    data-filename="<?= $this->getModuleName() ?>"> <!-- intended: module name used as filename -->
                    <!--property-->
                    <h3><?= $this->getModuleName() ?></h3> <!-- intended: module name used as filename -->
                    <ul>
                        <?php foreach ($properies as $object) : ?>
                            <li class="item"
                            data-name="<?= $object->getName() ?>"
                            data-subsystem="<?= $object->getSubsystem() ?>" >
                                <?= $object->getName().'['.$object->getSubsystem().']'; ?>
                            </li>
                            <!--property list item-->
                        <?php endforeach ?>
                    </ul>
                </li>
            <?php endforeach ?>
        </ul>
        <ul>
            <?php foreach ($this->xmlReader->getSectionDataModel('dependencies')['files'] as $key => $properies) : ?>
                <li class="fileLevel" data-filename="<?=$key?>">
                    <!--property-->
                    <h3><?= $key; ?></h3>
                    <ul>
                        <?php foreach ($properies as $object) : ?>
                            <li class="item"
                            data-name="<?= $object->getName() ?>"
                            data-subsystem="<?= $object->getSubsystem() ?>" >
                                <?= $object->getName().'['.$object->getSubsystem().']'; ?>
                            </li>
                            <!--property list item-->
                        <?php endforeach ?>
                    </ul>
                </li>
            <?php endforeach ?>
        </ul>
    </div>

    <div class="rhapsody__dataModel_section rhapsody__dataModel_section--variables">
        <h2 data-sectionName="variables">variables</h2>
        <ul>
            <!-- MODULE LEVEL DEPENDENCIES -->
            <?php foreach ($this->xmlReader->getSectionDataModel('variables')['module'] as $key => $properies) : ?>
                <li class="moduleLevel" data-filename="<?=$key?>" >
                    <!--property-->
                    <h3><?= $this->getModuleName() ?></h3>
                    <ul>
                        <?php foreach ($properies as $object) : ?>
                            <li class="item" data-name="<?= $object->getName() ?>"><?= $object->getName() ?></li>
                            <!--property list item-->
                        <?php endforeach ?>
                    </ul>
                </li>
            <?php endforeach ?>
        </ul>
        <ul>
            <?php foreach ($this->xmlReader->getSectionDataModel('variables')['files'] as $key => $properies) : ?>
                <li class="fileLevel" data-filename="<?=$key?>">
                    <!--property-->
                    <h3><?= $key ?></h3>
                    <ul>
                        <?php foreach ($properies as $object) : ?>
                            <li class="item" data-name="<?= $object->getName() ?>"><?= $object->getName(); ?></li>
                            <!--property list item-->
                        <?php endforeach ?>
                    </ul>
                </li>
            <?php endforeach ?>
        </ul>
    </div>

    <div class="rhapsody__dataModel_section rhapsody__dataModel_section--functions">
        <h2 data-sectionName="functions">functions</h2>
        <ul>
            <!--file level-->
            <?php foreach ($this->xmlReader->getSectionDataModel('functions')['files'] as $file => $index) : ?>
                <li class="fileLevel" data-filename="<?=$file?>">
                    <!--file level -->
                    <h3><?= $file ?></h3>
                    <ul>
                        <!--function level -->
                        <?php foreach ($index as $function) : ?>
                            <li class="item item-function" data-name="<?= $function->getName() ?>">
                                <!-- function level -->
                                <h4><?= $function->getName() ?>()</h4>
                                <ul>
                                    <!-- TAG section level -->
                                    <li>
                                        <!-- TAG Global variables section level -->
                                        <h5>Used global variables:</h5>
                                        <ul>
                                            <li>
                                                read:
                                                <ul class="vars-read">
                                                    <!-- Global variables  -->
                                                    <?php foreach ($function->getVarsRead() as $val) : ?>
                                                        <li class="item" data-varRead="<?= $val ?>"><?= $val ?></li> <!-- Global variables -->
                                                    <?php endforeach ?>
                                                </ul> <!-- Global variables -->
                                            </li>
                                            <li>
                                                write:
                                                <ul class="vars-write">
                                                    <!-- Global variables -->
                                                    <?php foreach ($function->getVarsWrite() as $val) : ?>
                                                        <li class="item" data-varWrite="<?= $val ?>"><?= $val ?></li> <!-- Global variables -->
                                                    <?php endforeach ?>
                                                </ul> <!-- Global variables -->
                                            </li>
                                            <li>
                                                read-write:
                                                <ul class="vars-readWrite">
                                                    <!-- Global variables -->
                                                    <?php foreach ($function->getVarsReadWrite() as $val) : ?>
                                                        <li class="item" data-varReadWrite="<?= $val ?>"><?= $val ?></li> <!-- Global variables -->
                                                    <?php endforeach ?>
                                                </ul> <!-- Global variables -->
                                            </li>
                                        </ul>
                                    </li><!-- TAG Global variables section level -->
                                    <li>
                                        <!--TAG used functions -->
                                        <h5>Used functions:</h5>
                                        <ul class="usedFunctions">
                                            <!-- used functions list -->
                                            <?php foreach ($function->getUsedFunctions() as $val) : ?>
                                                <li class="item" data-usedFunction="<?= $val ?>"><?= $val ?>()</li> <!-- used functions -->
                                            <?php endforeach ?>
                                        </ul> <!-- used functions list -->
                                    </li>
                                    <!--TAG used functions -->
                                </ul> <!--  TAG section level -->
                            <?php endforeach ?>
                    </ul>
                    <!--function level -->
                </li>
                <!--file level -->
            <?php endforeach ?>
        </ul>
        <!--file level -->
    </div>

    <div class="rhapsody__dataModel_section rhapsody__dataModel_section--types">
        <h2 data-sectionName="types">types</h2>
        <ul>
            <?php foreach ($this->xmlReader->getSectionDataModel('types')['files'] as $file => $index) : ?>
                <li class="fileLevel" data-filename="<?=$file?>">
                    <h3><?= $file ?></h3>
                    <?php foreach ($index as $type) {
                        switch (get_class($type)) {
                            case 'tabs\rhapsody\xmlReader\types\EnumType':
                                include $this->unifyPath('tabs/rhapsody/xmlReader/templates/types/enumeration.php');
                                break;
                            case 'tabs\rhapsody\xmlReader\types\StructureType':
                                include $this->unifyPath('tabs/rhapsody/xmlReader/templates/types/structure.php');
                                break;
                            default:
                                $this->logError('Could not print: ' . get_class($type));
                        }
                    } ?>
                </li>
            <?php endforeach ?>
        </ul>
    </div>

    <div class="rhapsody__dataModel_errors">
        <h2>Errors</h2>
        <ul>
            <?php foreach ($this->xmlReader->getErrors() as $sectionName => $errors) : ?>
                <?php foreach ($errors as $error) : ?>
                    <li class="item"
                    data-sectionName="<?=$sectionName?>"
                    data-error="<?=$error?>"
                    >
                        <?= $sectionName . ' : ' . $error; ?>
                    </li>
                <?php endforeach ?>
            <?php endforeach ?>
        </ul>
    </div>

</div>