<?php

namespace app\model;

use support\think\Model;

class ProjectImage extends Model
{
    protected $table = 'project_images';

    protected $primaryKey = 'id';

    protected $autoWriteTimestamp = true;

    protected $createTime = 'created_at';

    protected $updateTime = 'updated_at';

    protected $type = [
        'id'        => 'integer',
        'project_id' => 'integer',
        'sort_order' => 'integer',
    ];
}