<ul data-enumName="<?= $type->getName() ?>" class="enumeration">
    <p>Enumeration</p>
    <h4><?= $type->getName() ?></h4>
    <?php foreach ($type->getLiterals() as $literal) : ?>
        <li class="item"
        data-name="<?= $literal->getName() ?>"
        data-literalValue="<?= $literal->getValue() ?>">
            <?= $literal->getName() ?> : <?= $literal->getValue() ?>
        </li>
    <?php endforeach; ?>
</ul>