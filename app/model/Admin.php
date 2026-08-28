<?php

namespace app\model;

use support\think\Model;

class Admin extends Model
{
    protected $table = 'admins';

    protected $primaryKey = 'id';

    protected $autoWriteTimestamp = true;

    protected $createTime = 'created_at';

    protected $updateTime = false;

    protected $hidden = ['password'];
}
