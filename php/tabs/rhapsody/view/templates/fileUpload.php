<div class="tab-pane container py-5" id="rhapsody">
    <div class="row rhapsody__msg<?php if (!isset($_SESSION['msg'])) echo ' d-none'; ?>">
        <div class="col py-1">
            <p class="text-danger"><?= $this->getMsg(); ?></p>
        </div>
    </div>
    <div class="row">
        <div class="col rhapsody__file-upload-form-section">
            <div class="rhapsody__file-upload-form-section">
                <h2>Upload <strong>module sbs file</strong></h2>
                <form action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>" method="post" enctype="multipart/form-data" class="py-3">
                    <div class="form-check-inline">
                        <label class="form-check-label">
                            Configuration:
                        </label>
                    </div>
                    <div class="form-check-inline">
                        <label class="form-check-label">
                            <input type="radio" class="form-check-input" name="config" value="0931_018" checked>0931_018
                        </label>
                    </div>
                    <div class="form-check-inline">
                        <label class="form-check-label">
                            <input type="radio" class="form-check-input" name="config" value="1665_0XX">1665_0XX
                        </label>
                    </div>
                    <div class="form-group py-3">
                        <input class="btn btn-outline-info" type="file" name="sbs_file" id="sbs_file" required>
                    </div>
                    <div class="form-group">
                        <input class="btn btn-info" type="submit" value="Upload file" name="submit">
                    </div>
                </form>
            </div>
        </div>
    </div>
</div> <!-- end tab rhapsody -->