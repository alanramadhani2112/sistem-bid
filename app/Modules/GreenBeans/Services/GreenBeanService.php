<?php

declare(strict_types=1);

namespace App\Modules\GreenBeans\Services;

use App\Models\GreenBean;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

final class GreenBeanService
{
    /** @param array<string, mixed> $data */
    public function create(array $data, ?UploadedFile $image): GreenBean
    {
        unset($data['image']);

        if ($image !== null) {
            $data['image_path'] = $image->store('green-beans', 'public');
        }

        return GreenBean::query()->create($data);
    }

    /** @param array<string, mixed> $data */
    public function update(GreenBean $greenBean, array $data, ?UploadedFile $image): GreenBean
    {
        unset($data['image']);

        if ($image !== null) {
            $this->deleteImage($greenBean);
            $data['image_path'] = $image->store('green-beans', 'public');
        }

        $greenBean->update($data);

        return $greenBean->refresh();
    }

    public function delete(GreenBean $greenBean): void
    {
        $this->deleteImage($greenBean);
        $greenBean->delete();
    }

    private function deleteImage(GreenBean $greenBean): void
    {
        if ($greenBean->image_path !== null) {
            Storage::disk('public')->delete($greenBean->image_path);
        }
    }
}
