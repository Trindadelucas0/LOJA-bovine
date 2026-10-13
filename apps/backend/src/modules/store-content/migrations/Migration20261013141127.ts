import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20261013141127 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "avadesk_banner" ("id" text not null, "position" text not null default 'hero', "eyebrow" text null, "title" text not null, "subtitle" text null, "image_url" text null, "mobile_image_url" text null, "cta_label" text null, "cta_url" text null, "cta2_label" text null, "cta2_url" text null, "rank" integer not null default 0, "is_active" boolean not null default true, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "avadesk_banner_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_avadesk_banner_deleted_at" ON "avadesk_banner" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "avadesk_content_setting" ("id" text not null, "store_name" text null, "logo_url" text null, "tagline" text null, "phone" text null, "whatsapp" text null, "email" text null, "address" text null, "footer_text" text null, "copyright_text" text null, "pix_discount_percent" integer null, "pix_discount_text" text null, "max_installments" integer null, "chat_title" text null, "chat_text" text null, "chat_button_label" text null, "chatwoot_base_url" text null, "chatwoot_website_token" text null, "header_links" jsonb null, "footer_columns" jsonb null, "hero_badges" jsonb null, "benefits" jsonb null, "chat_quick_replies" jsonb null, "home_category_ids" jsonb null, "featured_collection_ids" jsonb null, "featured_title" text null, "new_arrivals_title" text null, "categories_title" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "avadesk_content_setting_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_avadesk_content_setting_deleted_at" ON "avadesk_content_setting" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "avadesk_banner" cascade;`);

    this.addSql(`drop table if exists "avadesk_content_setting" cascade;`);
  }

}
