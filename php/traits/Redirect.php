<?php

namespace traits;

trait Redirect
{
    public function redirectToPage( string $page='index.php')
    {
        header("Location: $page");
        exit;
    }
}