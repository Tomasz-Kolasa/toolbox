<?php

namespace traits;

trait Messenger
{
    private function setMsg(string $msg)
    {
        $_SESSION['msg'] = $msg;
    }

    public function getMsg():?string
    {
        $m = $_SESSION['msg'] ?? null;
        unset($_SESSION['msg']);
        return $m;
    }
}