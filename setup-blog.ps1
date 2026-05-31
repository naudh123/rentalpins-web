# =====================================================
# RentalPins Blog Setup Script
# Run from: C:\Users\naudh\rentalpins-web
# Command:  .\setup-blog.ps1
# =====================================================

Write-Host ""
Write-Host "🚀 Setting up RentalPins Blog..." -ForegroundColor Cyan
Write-Host ""

# ── 1. Install dependencies ────────────────────────
Write-Host "📦 Installing npm packages..." -ForegroundColor Yellow
npm install gray-matter next-mdx-remote @tailwindcss/typography
Write-Host "✅ Packages installed" -ForegroundColor Green
Write-Host ""

# ── 2. Create directories ──────────────────────────
Write-Host "📁 Creating folders..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path "app\blog\[slug]" | Out-Null
New-Item -ItemType Directory -Force -Path "content\blog"    | Out-Null
Write-Host "✅ Folders created" -ForegroundColor Green
Write-Host ""

# ── 3. lib\blog.ts ────────────────────────────────
Write-Host "📝 Creating lib\blog.ts..." -ForegroundColor Yellow
@'
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const BLOG_DIR = path.join(process.cwd(), 'content/blog');

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  category: string;
  coverImage?: string;
  author?: string;
  readTime?: string;
  content: string;
}

export function getAllPosts(): Omit<BlogPost, 'content'>[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.mdx'));
  return files
    .map(filename => {
      const slug = filename.replace('.mdx', '');
      const raw = fs.readFileSync(path.join(BLOG_DIR, filename), 'utf-8');
      const { data } = matter(raw);
      return {
        slug,
        title: data.title ?? '',
        date: data.date ?? '',
        excerpt: data.excerpt ?? '',
        category: data.category ?? 'General',
        coverImage: data.coverImage ?? null,
        author: data.author ?? 'RentalPins Team',
        readTime: data.readTime ?? '5 min read',
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): BlogPost | null {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title ?? '',
    date: data.date ?? '',
    excerpt: data.excerpt ?? '',
    category: data.category ?? 'General',
    coverImage: data.coverImage ?? null,
    author: data.author ?? 'RentalPins Team',
    readTime: data.readTime ?? '5 min read',
    content,
  };
}
'@ | Set-Content -Encoding UTF8 "lib\blog.ts"
Write-Host "✅ lib\blog.ts created" -ForegroundColor Green

# ── 4. components\BlogCard.tsx ────────────────────
Write-Host "📝 Creating components\BlogCard.tsx..." -ForegroundColor Yellow
@'
import Link from 'next/link';
import type { BlogPost } from '@/lib/blog';

interface Props {
  post: Omit<BlogPost, 'content'>;
}

export default function BlogCard({ post }: Props) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block rounded-xl border border-gray-200 hover:border-blue-400 transition overflow-hidden shadow-sm hover:shadow-md bg-white"
    >
      {post.coverImage && (
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-44 object-cover"
        />
      )}
      <div className="p-5">
        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
          {post.category}
        </span>
        <h2 className="mt-1 text-lg font-bold text-gray-900 group-hover:text-blue-600 transition leading-snug">
          {post.title}
        </h2>
        <p className="mt-2 text-sm text-gray-500 line-clamp-2">{post.excerpt}</p>
        <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
          <span>
            {new Date(post.date).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
          </span>
          <span>{post.readTime}</span>
        </div>
      </div>
    </Link>
  );
}
'@ | Set-Content -Encoding UTF8 "components\BlogCard.tsx"
Write-Host "✅ components\BlogCard.tsx created" -ForegroundColor Green

# ── 5. app\blog\page.tsx ──────────────────────────
Write-Host "📝 Creating app\blog\page.tsx..." -ForegroundColor Yellow
@'
import { getAllPosts } from '@/lib/blog';
import BlogCard from '@/components/BlogCard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog — RentalPins | Rental Tips, City Guides & More',
  description:
    'Rental tips, city guides, and housing advice for Ludhiana, Chandigarh and across India.',
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">RentalPins Blog</h1>
      <p className="text-gray-500 mb-10">
        Rental tips, city guides and housing advice across India.
      </p>

      {posts.length === 0 ? (
        <p className="text-gray-400">No posts yet. Check back soon!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </main>
  );
}
'@ | Set-Content -Encoding UTF8 "app\blog\page.tsx"
Write-Host "✅ app\blog\page.tsx created" -ForegroundColor Green

# ── 6. app\blog\[slug]\page.tsx ───────────────────
Write-Host "📝 Creating app\blog\[slug]\page.tsx..." -ForegroundColor Yellow
@'
import { getPostBySlug, getAllPosts } from '@/lib/blog';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return getAllPosts().map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPostBySlug(params.slug);
  if (!post) return {};
  return {
    title: `${post.title} — RentalPins Blog`,
    description: post.excerpt,
  };
}

export default function BlogPostPage({ params }: Props) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-4 flex items-center gap-3 text-sm text-gray-500">
        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
          {post.category}
        </span>
        <span>
          {new Date(post.date).toLocaleDateString('en-IN', { dateStyle: 'long' })}
        </span>
        <span>· {post.readTime}</span>
      </div>

      <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
        {post.title}
      </h1>
      <p className="text-gray-500 mb-8 text-lg">{post.excerpt}</p>

      <article className="prose prose-lg prose-blue max-w-none">
        <MDXRemote source={post.content} />
      </article>

      <div className="mt-12 pt-6 border-t text-sm text-gray-400">
        Written by{' '}
        <span className="font-medium text-gray-600">{post.author}</span>
      </div>
    </main>
  );
}
'@ | Set-Content -Encoding UTF8 "app\blog\[slug]\page.tsx"
Write-Host "✅ app\blog\[slug]\page.tsx created" -ForegroundColor Green

# ── 7. Sample MDX posts ───────────────────────────
Write-Host "📝 Creating sample blog posts..." -ForegroundColor Yellow

@'
---
title: "How to Find a Room for Rent in Ludhiana Without a Broker"
date: "2026-04-21"
excerpt: "Skip the broker fees. Here's exactly how to find verified rooms, PGs, and flats in Ludhiana directly from owners."
category: "City Guide"
author: "RentalPins Team"
readTime: "4 min read"
---

Finding a room in Ludhiana doesn't have to mean dealing with brokers charging one or two months' rent as commission.

## Best Areas to Look

Focus on **Sarabha Nagar**, **Model Town**, **BRS Nagar**, and **Civil Lines** for furnished options close to markets and colleges.

## Using RentalPins

On RentalPins, every listing is pinned to a real map location. You can:

- Filter by **Property** category
- See the exact location before contacting
- WhatsApp or call the owner directly — no middleman

## Tips Before You Visit

1. Ask for OTP-verified owner profile
2. Confirm if electricity and water bills are included
3. Check notice period terms
4. Visit in daylight to check the neighbourhood

Start your search at [RentalPins Ludhiana](https://www.rentalpins.com/rentals/ludhiana).
'@ | Set-Content -Encoding UTF8 "content\blog\how-to-find-room-ludhiana.mdx"

@'
---
title: "PG vs Flat: What's Better for Students in Chandigarh?"
date: "2026-04-18"
excerpt: "Comparing PG accommodation and independent flats for students in Chandigarh, Mohali and Panchkula — costs, freedom, and what to choose."
category: "Student Housing"
author: "RentalPins Team"
readTime: "5 min read"
---

Students moving to Chandigarh Tricity face one big question: PG or flat?

## PG Accommodation

**Pros:**
- Meals often included
- Lower upfront cost
- No utility bill hassle

**Cons:**
- Curfew rules
- Less privacy
- Shared bathrooms

## Independent Flat

**Pros:**
- Full freedom
- Cook your own food
- Often cheaper per person if shared with 2–3 friends

**Cons:**
- Need to furnish
- Manage bills yourself

## Verdict

For first-year students: **PG** is safer and simpler. For 2nd year onwards or those with friends: **shared flat** gives better value and freedom.

Browse both options on [RentalPins Chandigarh](https://www.rentalpins.com/rentals/chandigarh).
'@ | Set-Content -Encoding UTF8 "content\blog\pg-vs-flat-chandigarh-students.mdx"

@'
---
title: "How to Rent a Vehicle in Chandigarh Tricity"
date: "2026-04-15"
excerpt: "Need a bike, scooter or car on rent in Chandigarh, Mohali or Panchkula? Here's what to check before you rent."
category: "Vehicle Rental"
author: "RentalPins Team"
readTime: "4 min read"
---

Renting a vehicle in Chandigarh Tricity is a great alternative to buying, especially if you're new to the city.

## What's Available

On RentalPins you'll find:
- **Bikes & Scooters** — great for daily commute
- **Cars** — for families or longer trips
- **Commercial vehicles** — for business use

## Documents You'll Need

1. Valid driving licence
2. Aadhaar card (ID proof)
3. Security deposit (refundable)

## Key Things to Check

- Monthly vs daily rental pricing
- Who pays for fuel
- Insurance coverage
- Condition of tyres and brakes before signing

Browse vehicle rentals on [RentalPins](https://www.rentalpins.com/rentals/chandigarh).
'@ | Set-Content -Encoding UTF8 "content\blog\vehicle-rental-chandigarh-guide.mdx"

Write-Host "✅ 3 sample blog posts created" -ForegroundColor Green

# ── 8. Done ───────────────────────────────────────
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  ✅ Blog setup complete!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 NEXT STEPS:" -ForegroundColor Yellow
Write-Host ""
Write-Host "  1. Add typography plugin to tailwind.config.ts:" -ForegroundColor White
Write-Host "     plugins: [require('@tailwindcss/typography')]" -ForegroundColor Gray
Write-Host ""
Write-Host "  2. Add Blog link to your footer/nav (layout.tsx):" -ForegroundColor White
Write-Host "     <Link href='/blog'>Blog</Link>" -ForegroundColor Gray
Write-Host ""
Write-Host "  3. Test locally:" -ForegroundColor White
Write-Host "     npm run dev" -ForegroundColor Gray
Write-Host "     → open http://localhost:3000/blog" -ForegroundColor Gray
Write-Host ""
Write-Host "  4. Deploy:" -ForegroundColor White
Write-Host "     vercel --prod" -ForegroundColor Gray
Write-Host ""
