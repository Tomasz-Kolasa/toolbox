<?php
//error_reporting(0);
session_start(); // needed for sessions msgs

// include paths & classes autoload
include 'php' . DIRECTORY_SEPARATOR . 'php-setup.php';

$toolboxPage = new Toolbox();
$toolboxPage->runPageLogic();
?>

<!doctype html>
<html lang="pl">

<head>
    <meta charset="utf-8">
    <title>Toolbox</title>
    <meta name="description" content="decimal to hex converter">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <link rel="stylesheet" href="css\index.css?v=1.4">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    <link rel="manifest" href="/site.webmanifest">
    <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
</head>

<body>
    <div class="full-height">
        <div class="container">
            <div class="row py-1">
                <div class="col page-style text-right">
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <nav>
                        <ul class="nav nav-tabs">
                            <li class="nav-item">
                                <a class="nav-link active" data-toggle="tab" href="#caster">Caster</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" data-toggle="tab" href="#renumerator">Renumerator</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" data-toggle="tab" href="#splitter">Splitter</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" data-toggle="tab" href="#rhapsody">Rhapsody</a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
        <div class="tab-content">
            <div class="tab-pane active container" id="caster">
                <div class="row">
                    <div class="col text-right">
                        <input type="checkbox" name="hex-prefix" checked="checked" id="caster-hex-prefix" class="pointer">
                        <label for="caster-hex-prefix" title="Add &quot;0x&quot; prefix to hexadecimal numbers on output" class="pointer">&quot;0x&quot; prefix</label>
                    </div>
                </div>
                <div class="row inputs pseduo-header py-3 my-3 text-center">
                    <div class="col-sm">
                        <form id="inputs-form" action="">
                            <div class="text-center py-1">
                                <input type="radio" name="sign" value="S" title="Signed" id="radio-s">
                                <label for="radio-s" class="label-signed" title="Cast from signed number">Signed</label>
                                <span class="px-1"></span>
                                <input type="radio" name="sign" value="U" checked="checked" title="Unsigned" id="radio-u">
                                <label for="radio-u" class="label-unsigned" title="Cast from unsigned number">Unsigned</label>
                            </div>
                            <div class="row row-inputs">
                                <div class="col-sm col-input">
                                    <label for="input-number--hex" class="color-hex">HEX</label>
                                    <input id="input-number--hex" class="input-field monospace" type="text" size="10" maxlength="10" />
                                </div>
                                <div class="col-sm col-input">
                                    <label for="input-number--dec" class="d-sm-none color-dec">DEC</label>
                                    <input id="input-number--dec" class="input-field monospace" type="text" size="11" maxlength="11" />
                                    <label for="input-number--dec" class="d-none d-sm-inline color-dec">DEC</label>
                                </div>
                            </div>
                        </form>
                        <div class="user-feedback">
                            <p id="converted-number"></p>
                            <p id="message"></p>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-6">
                        <div class="row my-5">
                            <div class="col">
                                <div class="pseduo-header pseudo-header--hex bordered hex-group px-3">
                                    <div class="row my-4 unsigned-group">
                                        <div class="col-sm-3">
                                            <label class="type-label" for="HU8">U8</label>
                                            <input id="HU8" type="text" maxlength="4" readonly class="output">
                                        </div>
                                        <div class="col-sm-4">
                                            <label class="type-label" for="HU16">U16</label>
                                            <input id="HU16" type="text" maxlength="6" readonly class="output">
                                        </div>
                                        <div class="col-sm-5">
                                            <label class="type-label" for="HU32">U32</label>
                                            <input id="HU32" type="text" maxlength="10" readonly class="output">
                                        </div>
                                    </div>

                                    <div class="row my-4 types-decimal signed-group">
                                        <div class="col-sm-3">
                                            <label class="type-label" for="HS8">S8</label>
                                            <input id="HS8" type="text" maxlength="4" readonly class="output">
                                        </div>
                                        <div class="col-sm-4">
                                            <label class="type-label" for="HS16">S16</label>
                                            <input id="HS16" type="text" maxlength="6" readonly class="output">
                                        </div>
                                        <div class="col-sm-5">
                                            <label class="type-label" for="HS2">S32</label>
                                            <input id="HS32" type="text" maxlength="10" readonly class="output">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="row my-5">
                            <div class="col">
                                <div class="pseduo-header pseudo-header--dec bordered dec-group px-3">
                                    <div class="row my-4 unsigned-group">
                                        <div class="col-sm-3">
                                            <label class="type-label" for="DU8">U8</label>
                                            <input id="DU8" type="text" maxlength="3" readonly class="output">
                                        </div>
                                        <div class="col-sm-4">
                                            <label class="type-label" for="DU16">U16</label>
                                            <input id="DU16" type="text" maxlength="5" readonly class="output">
                                        </div>
                                        <div class="col-sm-5">
                                            <label class="type-label" for="DU32">U32</label>
                                            <input id="DU32" type="text" maxlength="10" readonly class="output">
                                        </div>
                                    </div>

                                    <div class="row my-4 types-decimal signed-group">
                                        <div class="col-sm-3">
                                            <label class="type-label" for="DS8">S8</label>
                                            <input id="DS8" type="text" maxlength="4" readonly class="output">
                                        </div>
                                        <div class="col-sm-4">
                                            <label class="type-label" for="DS16">S16</label>
                                            <input id="DS16" type="text" maxlength="6" readonly class="output">
                                        </div>
                                        <div class="col-sm-5">
                                            <label class="type-label" for="DS2">S32</label>
                                            <input id="DS32" type="text" maxlength="11" readonly class="output">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> <!-- hex dec rows -->
                <div class="row">
                    <div class="col text-right">
                        <small>Click the number to copy</small><br>
                        <small>Press &amp; hold <kbd>Ctrl</kbd> to invert numbers</small>
                    </div>
                </div>
            </div> <!-- tab caster -->

            <div class="tab-pane container py-5" id="renumerator">
                <!-- renumerator -->
                <div class="renumber-lines">
                    <div class="row py-3">
                        <div class="col">
                            <input class="form-control text-success" type="text" placeholder="filename... (optional)">
                        </div>
                    </div>
                    <div class="row">
                        <div class="col text-secondary text-center py-2">
                            <details>
                                <summary>Define Unchanged Code Blocks</summary>
                                <small>Define Unchanged Blocks of Code in the old release, and point the line where changes starts in new release.</small><br>
                                <small>TIP: You don't have to add all changed code blocks. Everything outside defined blocks of code will not be considered during renumbering lines and will be coloured red.</small><br>
                                <small>NOTE: Code blocks must be added in ascending order.</small><br>
                            </details>
                        </div>
                    </div>
                    <div class="row line-change-info">
                        <div class="col">
                            <form class="form-inline justify-content-center">
                                <div class="form-group px-2 py-2">
                                    <a href="#" data-toggle="tooltip" class="tt-info" title="The FIRST line number of the code block in the OLD release.">?</a>
                                    <label class="px-1" for="old-line">Old line no:</label>
                                    <input class="old-line" type="number" name="old-line" min="0" max="50000">
                                </div>
                                <div class="form-group px-2 py-2">
                                    <a href="#" data-toggle="tooltip" class="tt-info" title="This is the first code line number of corresponding Code Block in the new release, which replaces the one in 'Old line number' field.">?</a>
                                    <label class="px-1" for="new-line">New line no:</label>
                                    <input class="new-line" type="number" name="new-line" min="0" max="50000">
                                </div>
                                <div class="form-group px-2 py-2">
                                    <a href="#" data-toggle="tooltip" class="tt-info" title="The LAST line number of the code block in the OLD release.">?</a>
                                    <label class="px-1" for="max-line">Max line:</label>
                                    <input class="max-line" type="number" name="max-line" min="0" max="50000">
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col text-center">
                        <button type="button" class="btn btn-danger plus-minus my-1 mx-1" id="line-minus" title="remove Code Block">-</button>
                        <button type="button" class="btn btn-success plus-minus my-1 mx-1" id="line-add" title="add Code Block">+</button>
                    </div>
                </div>
                <div class="row">
                    <div class="col text-center">
                        <p class="renumerator-info">&nbsp;</p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-6">
                        <button type="button" class="btn btn-outline-primary" id="renumerator-clear">Clear</button>
                        <form class="renumerator-input">
                            <div class="form-group">
                                <textarea class="form-control" id="renumerator-lines-box-input" rows="10" placeholder="e.g. 120, 367-372, 381, 1234"></textarea>
                            </div>
                        </form>
                    </div>
                    <div class="col-sm-6">
                        <button type="button" class="btn btn-outline-info" id="renumerator-copy">Copy</button>
                        <div id="renumerator-lines-box-output"></div>
                        <small>*Line number:
                            <span style="color:#0000ff; font-weight: bold;">changed</span>,
                            <span class="text_visibility-improved--white-background" style="color:#000000; font-weight: bold;">remains the same</span>,
                            <span style="color:#ff0000; font-weight: bold;">to be reviewed</span>
                        </small>
                    </div>
                </div>
                <div class="row">
                    <div class="col text-right">
                        <button type="button" class="btn btn-primary mx-3 my-2" id="renumerator-renumber">Renumber</button>
                    </div>
                </div>
            </div> <!-- tab renumerator -->

            <div class="tab-pane container" id="splitter">
                <div class="row py-5">
                    <div class="col-sm-10">
                        <div class="form-group">
                            <input type="text" class="form-control" id="split-me" placeholder="split string by comma...">
                        </div>
                        <p id="split-info">&nbsp;</p>
                    </div>
                    <div class="col-sm-2">
                        <button type="button" class="btn btn-primary" id="split-clear">Clear</button>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <button type="button" class="btn btn-outline-success" id="split-copy">Copy</button>
                        <div class="form-group">
                            <textarea class="form-control" id="split-out" rows="10" readonly></textarea>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        Download <a href="downloads/checker.xlsm">checker</a>
                    </div>
                </div>
            </div> <!-- tab splitter -->

            <?php $toolboxPage->view->useTemplate('rhapsody__template'); // generates rhapsody pane ?>

        </div> <!-- tab-content -->
    </div> <!-- full-height -->
    <div class="footer text-right px-5 py-5">
        <footer>
            <small>Please note that the software on this page may not be free of bugs. The author takes no responsibility for any losses caused by this software malfunction.</small>
        </footer>
    </div>
    <script src="js/jquery.cookie.js"></script>
    <script src="js/pagestyler.js"></script>
    <script src="js/conver.js"></script>
    <script src="js/splitter.js"></script>
    <script src="js/renumerator.js?v=1.5"></script>
    <script src="js/index.js?v=1.2"></script>
    <script>
        // restore last opened tab on page reload feature
        $(document).ready(function() {
            $.cookie({
                expires: 10 * 365
            });

            // determinate bas url
            var url = document.location.toString();
            url = url.split('#')[0]; // extract base url

            if ($.cookie('toolbox_tab')) // we have tab saved before
            {
                url = url + '#' + $.cookie('toolbox_tab');
            } else // no cookie, set 'caster' tab as default
            {
                url = url + '#caster';
            }
            // set determinated url
            document.location = url;

            // now set cookie on link click
            $('.nav-link').on('click', function() {
                $.cookie('toolbox_tab', $(this).attr('href').slice(1)); // slice to remove #
            });

            // Javascript to enable link to tab
            url = document.location.toString();
            if (url.match('#')) {
                $('.nav-tabs a[href="#' + url.split('#')[1] + '"]').tab('show');
            }
        });
    </script>
</body>

</html>