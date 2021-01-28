<div class="rhapsody__dataModel_errors">
    <h2>Errors</h2>
    <ul>
        <?php foreach ($sections as $sectionName => $errors) : ?>
            <?php foreach ($errors as $error) : ?>
                <li><?= $sectionName . ' : ' . $error; ?></li>
            <?php endforeach ?>
        <?php endforeach ?>
    </ul>
</div>