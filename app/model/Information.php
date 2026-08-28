<?php

namespace app\model;

use support\think\Model;

class Information extends Model
{
    // Nama tabel di database yang dipakai model ini.
    protected $table = 'informations';

    protected $primaryKey = 'id';

    // Otomatis isi created_at (saat insert) dan updated_at (saat update).
    protected $autoWriteTimestamp = true;

    protected $createTime = 'created_at';

    protected $updateTime = 'updated_at';

    protected $type = [
        'id' => 'integer',
    ];
}
