<?php $out = $this->toolbox->tabs['rhapsody']->view; ?>

<!-- tab rhapsody -->
<div class="tab-pane container-fluid py-5" id="rhapsody">
    <div class="row" id="rhapsody__function-checker">
        <div class="col-md-3 px-5">
            <h1><?= $out->getModuleName() ?></h1>

            <div id="rhapsody__selector">
                <div class="form-group">
                    <select class="form-control d-none" id="sel1">
                        <option value="description" class="meta-data meta-common" disabled selected>Select section</option>
                        <option value="show-all-data" class="meta-data meta-common">--show all read data--</option>
                    </select>
                </div>
                <div class="form-group">
                    <select class="form-control d-none" id="sel2">
                        <option value="description" class="meta-data meta-common" disabled selected>Select file</option>
                    </select>
                </div>
                <div class="form-group">
                    <select class="form-control d-none" id="sel3">
                        <option value="description" class="meta-data meta-common" disabled selected>Select item</option>
                        <option value="compare-all" class="meta-data meta-functions">--compare all--</option>
                    </select>
                </div>
                <div class="form-group">
                    <select class="form-control d-none" id="sel4">
                        <option value="description" class="meta-data meta-common" disabled selected>Choose option</option>
                        <option value="functions-list" class="meta-data meta-functions" disabled selected>Functions list</option>
                    </select>
                </div>
            </div>
            <script src="js/rhapsody/HtmlDataReader.js"></script>
            <script src="js/rhapsody/Comparator.js"></script>
            <script src="js/rhapsody/select.js"></script>
        </div>
        <div class="col-md-9 px-5">
            <?php
            include $this->toolbox->view->includeFile(
                $this->toolbox->view->unifyPath('tabs\rhapsody\view\templates\comparers.html')
            );
            ?>

            <?php
            $out->printDataModelAsHTML('hidden');
            //var_dump( $out->getVariables() );
            ?>
        </div>
    </div>
</div>