<?php

namespace app\model;

use support\think\Model;

class Repository extends Model
{
    protected $table = 'repositories';

    protected $primaryKey = 'id';

    protected $autoWriteTimestamp = true;

    protected $createTime = 'created_at';

    protected $updateTime = 'updated_at';

    protected $type = [
        'id' => 'integer',
        'stars' => 'integer',
    ];
}
