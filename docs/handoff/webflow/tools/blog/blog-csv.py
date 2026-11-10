#!/usr/bin/env python3
"""Live Blogs (mgt-live list_collection_items JSON) -> CSV for the Designer's
CMS import into Blog Posts, plus a slug -> category map for the API write.

usage: blog-csv.py live-blogs.json out.csv out-map.json
"""
import csv, json, re, sys

src, out_csv, out_map = sys.argv[1:4]
items = json.load(open(src))

# Figma "07 · Blog" tabs + Liquidation as the catch-all, matched on the title.
def category(name):
    n = name.lower()
    if re.search(r'decommission|clean ?out|move[- ]out|lease|closure|closing|relocat|moving', n):
        return 'decommissioning'
    if re.search(r'\bit\b|e-?waste|electronic|computer|laptop|server|data|itad|hard drive|tech', n):
        return 'it-e-waste'
    if re.search(r'sustainab|esg|landfill|recycl|eco|green|circular|donat|carbon|environment', n):
        return 'sustainability'
    if re.search(r'office|furniture|cubicle|chair|desk|workstation', n):
        return 'office-liquidation'
    return 'liquidation'

# Content order (the person, 2026-11-09): preview site, then Figma, then the
# live site. The preview has no blog; the Figma "07 · Blog" frame (1689:3392)
# has card copy for these six posts, so its title, excerpt and category win.
# Dates stay the live ones (the frame's dates are mock-ups; flagged in
# blog-build.md); SEO Title / Meta Description keep the live title and
# description.
FIGMA = {
    'tax-benefits-donating-office-furniture-canada': ('Tax Benefits of Donating Office Furniture in Canada: A Guide for CFOs', 'Learn the CRA rules and tax benefits of donating office furniture in Canada, including fair market value, appraisals, charitable deductions and tax receipts.', 'office-liquidation'),
    '5-tips-to-optimize-your-product-sourcing': ('5 Tips To Optimize Your Product Sourcing', 'Better sourcing is about more than the lowest price. Five ways to control costs and avoid excess inventory.', 'liquidation'),
    'commercial-office-decommissioning-checklist': ('Commercial Office Decommissioning Checklist: 15 Steps to a Clean Lease Handback', 'A 15-step checklist for furniture, IT, building access, cleanup and a clean handback to your landlord.', 'decommissioning'),
    'office-furniture-disposal-costs-breakdown': ('Office Furniture Disposal Costs Exposed: Landfill Fees, Labour and Lost Value', 'What disposal really costs in Canada, and the recovery value most quotes leave on the floor.', 'office-liquidation'),
    'office-furniture-liquidation-esg-sustainability': ('How Office Furniture Liquidation Supports Corporate ESG and Sustainability Goals', 'How liquidation helps with diversion targets, circular economy goals and Scope 3 reporting.', 'sustainability'),
    'liquidation-auctions-canada': ('How Liquidation Auctions Work in Canada: Process, Pros and When They Make Sense', 'How the commercial auction process works, what it costs, and when a direct sale makes more sense.', 'liquidation'),
}

def clean_body(html):
    h = html or ''
    h = h.replace('‍', '').replace('​', '')
    h = re.sub(r'https?://(www\.)?michaelsglobaltrading\.com(?=/)', '', h)
    h = re.sub(r'<h1\b[^>]*>.*?</h1>', '', h, count=1, flags=re.S)
    def unstrong(m):
        return re.sub(r'</?strong>', '', m.group(0))
    h = re.sub(r'<h([2-6])\b[^>]*>.*?</h\1>', unstrong, h, flags=re.S)
    h = re.sub(r'<p>\s*</p>', '', h)
    h = re.sub(r'<img(?![^>]*\bloading=)', '<img loading="lazy"', h)
    return h.strip()

def one_line(s):
    return re.sub(r'\s+', ' ', s or '').strip()

FEATURED = 'tax-benefits-donating-office-furniture-canada'  # Figma's featured card

rows, cmap = [], {}
for i in items:
    f = i['fieldData']
    if not f.get('blog-content'):
        continue  # live leftovers 'Imported item 105/108': no body, no image
    date = f.get('blog-date') or i.get('createdOn')
    thumb = (f.get('blog-thumbnail') or {}).get('url', '')
    title, excerpt, cat = f['name'].strip(), one_line(f.get('blog-description')), category(f['name'])
    if f['slug'] in FIGMA:
        title, excerpt, cat = FIGMA[f['slug']]
    cmap[f['slug']] = cat
    rows.append({
        'Title': title,
        'Slug': f['slug'],
        'Category': cat,
        'Published Date': date,
        'Thumbnail': thumb,
        'Excerpt': excerpt,
        'Body': clean_body(f.get('blog-content')),
        'Featured': 'true' if f['slug'] == FEATURED else 'false',
        'SEO Title': f['name'].strip(),
        'Meta Description': one_line(f.get('blog-description')),
    })

with open(out_csv, 'w', newline='') as fh:
    w = csv.DictWriter(fh, fieldnames=list(rows[0]))
    w.writeheader(); w.writerows(rows)
json.dump(cmap, open(out_map, 'w'), indent=0)
print(len(rows), 'rows')
