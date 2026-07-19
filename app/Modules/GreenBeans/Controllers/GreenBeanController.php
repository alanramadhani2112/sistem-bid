<?php

declare(strict_types=1);

namespace App\Modules\GreenBeans\Controllers;

use App\Models\GreenBean;
use App\Modules\GreenBeans\Requests\GreenBeanRequest;
use App\Modules\GreenBeans\Services\GreenBeanService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

final class GreenBeanController
{
    public function index(): Response
    {
        return Inertia::render('Admin/GreenBeans/Index', [
            'greenBeans' => GreenBean::query()
                ->latest()
                ->get(['id', 'name', 'origin', 'process', 'weight_gram', 'starting_price', 'bid_increment', 'image_path']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/GreenBeans/Form', [
            'greenBean' => null,
        ]);
    }

    public function store(GreenBeanRequest $request, GreenBeanService $greenBeanService): RedirectResponse
    {
        $greenBeanService->create($request->validated(), $request->file('image'));

        return redirect()->route('admin.green-beans.index');
    }

    public function edit(GreenBean $greenBean): Response
    {
        return Inertia::render('Admin/GreenBeans/Form', [
            'greenBean' => $greenBean->only([
                'id',
                'name',
                'origin',
                'process',
                'weight_gram',
                'description',
                'image_path',
                'starting_price',
                'bid_increment',
            ]),
        ]);
    }

    public function update(GreenBeanRequest $request, GreenBean $greenBean, GreenBeanService $greenBeanService): RedirectResponse
    {
        $greenBeanService->update($greenBean, $request->validated(), $request->file('image'));

        return redirect()->route('admin.green-beans.index');
    }

    public function destroy(GreenBean $greenBean, GreenBeanService $greenBeanService): RedirectResponse
    {
        $greenBeanService->delete($greenBean);

        return redirect()->route('admin.green-beans.index');
    }
}
