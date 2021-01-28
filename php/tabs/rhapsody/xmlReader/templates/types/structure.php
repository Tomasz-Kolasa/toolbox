<ul data-structName="<?= $type->getName() ?>" class="structure">
    <p>Structure</p>
    <h4><?= $type->getName() ?></h4>
    <?php foreach ($type->getMembers() as $member) : ?>
        <li data-name="<?= $member->getName() ?>" class="item"><?= $member->getName() ?></li>
    <?php endforeach ?>
</ul>