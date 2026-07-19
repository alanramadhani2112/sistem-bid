<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\GreenBean;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

final class GreenBeanAdminTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_open_green_beans_index(): void
    {
        GreenBean::factory()->create(['name' => 'Gayo Lot A']);

        $this->actingAs($this->admin())
            ->get('/admin/green-beans')
            ->assertOk();
    }

    public function test_bidder_cannot_access_green_beans_admin(): void
    {
        $this->actingAs(User::factory()->create())
            ->get('/admin/green-beans')
            ->assertForbidden();
    }

    public function test_admin_can_create_green_bean(): void
    {
        Storage::fake('public');

        $this->actingAs($this->admin())
            ->post('/admin/green-beans', $this->payload([
                'image' => UploadedFile::fake()->image('lot.jpg'),
            ]))
            ->assertRedirect('/admin/green-beans');

        $greenBean = GreenBean::query()->firstOrFail();

        $this->assertSame('Gayo Wine', $greenBean->name);
        $this->assertNotNull($greenBean->image_path);
        Storage::disk('public')->assertExists($greenBean->image_path);
    }

    public function test_admin_can_update_green_bean(): void
    {
        $greenBean = GreenBean::factory()->create(['name' => 'Old Lot']);

        $this->actingAs($this->admin())
            ->put("/admin/green-beans/{$greenBean->id}", $this->payload(['name' => 'Updated Lot']))
            ->assertRedirect('/admin/green-beans');

        $this->assertDatabaseHas('green_beans', [
            'id' => $greenBean->id,
            'name' => 'Updated Lot',
        ]);
    }

    public function test_admin_can_delete_green_bean(): void
    {
        $greenBean = GreenBean::factory()->create();

        $this->actingAs($this->admin())
            ->delete("/admin/green-beans/{$greenBean->id}")
            ->assertRedirect('/admin/green-beans');

        $this->assertDatabaseMissing('green_beans', ['id' => $greenBean->id]);
    }

    public function test_green_bean_payload_is_validated(): void
    {
        $this->actingAs($this->admin())
            ->post('/admin/green-beans', $this->payload(['starting_price' => 999]))
            ->assertSessionHasErrors('starting_price');
    }

    private function admin(): User
    {
        return User::factory()->admin()->create();
    }

    /** @param array<string, mixed> $overrides */
    private function payload(array $overrides = []): array
    {
        return array_merge([
            'bid_increment' => 100_000,
            'description' => 'Lot core MVP.',
            'name' => 'Gayo Wine',
            'origin' => 'Aceh Gayo',
            'process' => 'Wine Natural',
            'starting_price' => 1_000_000,
            'weight_gram' => 5_000,
        ], $overrides);
    }
}
