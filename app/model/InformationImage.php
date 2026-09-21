<?php

namespace app\model;

use support\think\Model;

class InformationImage extends Model
{
    protected $table = 'information_images';

    protected $primaryKey = 'id';

    protected $autoWriteTimestamp = true;

    protected $createTime = 'created_at';

    protected $updateTime = 'updated_at';

    protected $type = [
        'id'             => 'integer',
        'information_id' => 'integer',
        'sort_order'     => 'integer',
    ];
}