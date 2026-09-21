<?php

namespace app\model;

use support\think\Model;

class TechStack extends Model
{
    protected $table = 'tech_stacks';

    protected $primaryKey = 'id';

    protected $autoWriteTimestamp = true;

    protected $createTime = 'created_at';

    protected $updateTime = 'updated_at';

    protected $type = [
        'id' => 'integer',
    ];
}