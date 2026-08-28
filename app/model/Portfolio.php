<?php

namespace app\model;

use support\think\Model;

class Portfolio extends Model
{
    protected $table = 'portfolios';

    protected $primaryKey = 'id';

    protected $autoWriteTimestamp = true;

    protected $createTime = 'created_at';

    protected $updateTime = 'updated_at';

    protected $type = [
        'id' => 'integer',
    ];
}
