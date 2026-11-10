# 4px grid rounding (2026-11-09)

Asked by the person: round size and spacing values to the 4px grid (in em, 1em = 16px, so 40px = 2.5em).

Rule used: each value was converted to its rendered px (em × the element's own font size, measured on staging at each breakpoint), rounded to the nearest 4px (a tie goes to the multiple of 8, and nothing goes below 4px), and written back in the same unit. An element with smaller text therefore gets a value like 0.5333em (8px at 15px text).

Left as they were: font sizes (typography, 28 values such as 13px captions), `backdrop-filter` blurs, `calc()` values (Carousel Track) and Footer Contacts' `minmax(0, 15.625em)` columns. Variables (Spacing, Radius, Layout, Typography Scale) were already on the grid.

Written through the style API (95 style/breakpoint updates, 194 values) and read back: no size or spacing value is off the grid. The prototype CSS was **not** changed, so prototype vs staging comparisons can now differ by up to 2px on these classes.

| Class | Breakpoint | Property | Old | New |
| --- | --- | --- | --- | --- |
| Nav Link | main | grid-column-gap | 0.4em (6px) | 0.5333em (8px) |
| Nav Link | main | grid-row-gap | 0.4em (6px) | 0.5333em (8px) |
| .icon-tile-img.is-medium | main | width | 22px (22px) | 24px (24px) |
| .icon-tile-img.is-medium | main | height | 22px (22px) | 24px (24px) |
| Stat Tiles | main | left | 0.4375em (7px) | 0.5em (8px) |
| Stat Tiles | main | right | 0.4375em (7px) | 0.5em (8px) |
| Stat Tiles | main | bottom | 0.4375em (7px) | 0.5em (8px) |
| Stat Tiles | main | grid-column-gap | 0.4375em (7px) | 0.5em (8px) |
| Stat Tiles | main | grid-row-gap | 0.4375em (7px) | 0.5em (8px) |
| Next Card | main | grid-row-gap | 1.125em (18px) | 1em (16px) |
| .button-size.is-icon-lead.is-icon-only | main | padding-right | 0.375em (6px) | 0.5em (8px) |
| .arrow-link.is-small | main | grid-column-gap | 0.625em (10px) | 0.5em (8px) |
| .arrow-link.is-small | main | grid-row-gap | 0.625em (10px) | 0.5em (8px) |
| Story Media | main | height | 29.125em (466px) | 29em (464px) |
| Footer Social | main | grid-column-gap | 0.5625em (9px) | 0.5em (8px) |
| Detail Text | main | grid-row-gap | 0.375em (6px) | 0.5em (8px) |
| Stat Card Text | main | grid-row-gap | 0.375em (6px) | 0.5em (8px) |
| Trusted Bar | main | padding-top | 1.375em (22px) | 1.5em (24px) |
| Trusted Bar | main | padding-right | 1.3125em (21px) | 1.25em (20px) |
| Trusted Bar | main | padding-bottom | 1.375em (22px) | 1.5em (24px) |
| Trusted Bar | main | padding-left | 1.375em (22px) | 1.5em (24px) |
| Call Card Text | main | grid-row-gap | 0.375em (6px) | 0.5em (8px) |
| Figures Band | main | grid-column-gap | 0.625em (10px) | 0.5em (8px) |
| ul | main | margin-bottom | 10px (10px) | 8px (8px) |
| Compare | main | height | 44.0625em (705px) | 44em (704px) |
| Figure | main | grid-row-gap | 0.625em (10px) | 0.5em (8px) |
| Check List Icon | main | width | 1.0625em (17px) | 1em (16px) |
| Check List Icon | main | height | 1.0625em (17px) | 1em (16px) |
| Services Panel | main | grid-row-gap | 1.6875em (27px) | 1.75em (28px) |
| Phone Button | main | padding-left | 0.375em (6px) | 0.5em (8px) |
| Breadcrumb | main | grid-column-gap | 0.75em (9.75px) | 0.6154em (8px) |
| Compare Hint | main | padding-top | 0.5em (6.5px) | 0.6154em (8px) |
| Compare Hint | main | padding-right | 1em (13px) | 0.9231em (12px) |
| Compare Hint | main | padding-bottom | 0.5em (6.5px) | 0.6154em (8px) |
| Compare Hint | main | padding-left | 1em (13px) | 0.9231em (12px) |
| Footer Cta Text | main | width | 34.125em (614.25px) | 34.2222em (616px) |
| Trusted Logo | main | width | 9.1875em (147px) | 9.25em (148px) |
| Trusted Logo | main | height | 4.8125em (77px) | 4.75em (76px) |
| Trusted Logo | main | border-top-left-radius | 0.3125em (5px) | 0.25em (4px) |
| Trusted Logo | main | border-top-right-radius | 0.3125em (5px) | 0.25em (4px) |
| Trusted Logo | main | border-bottom-left-radius | 0.3125em (5px) | 0.25em (4px) |
| Trusted Logo | main | border-bottom-right-radius | 0.3125em (5px) | 0.25em (4px) |
| Note Plate Text | main | grid-column-gap | 0.625em (10px) | 0.5em (8px) |
| .form-input.is-textarea | main | min-height | 5.5833em (67px) | 5.6667em (68px) |
| .form-input.is-textarea | main | padding-top | 0.9167em (11px) | 1em (12px) |
| .form-input.is-textarea | main | padding-bottom | 0.9167em (11px) | 1em (12px) |
| Sg Intro | main | max-width | 38em (646px) | 38.1176em (648px) |
| Check Chip | main | padding-right | 0.875em (14px) | 1em (16px) |
| Sg Sidebar Link | main | padding-top | 0.5em (7.5px) | 0.5333em (8px) |
| Sg Sidebar Link | main | padding-right | 1em (15px) | 1.0667em (16px) |
| Sg Sidebar Link | main | padding-bottom | 0.5em (7.5px) | 0.5333em (8px) |
| Sg Sidebar Link | main | padding-left | 1em (15px) | 1.0667em (16px) |
| Sg Sidebar Link | main | grid-column-gap | 0.75em (11.25px) | 0.8em (12px) |
| Sg Sidebar Link | main | grid-row-gap | 0.75em (11.25px) | 0.8em (12px) |
| Sg Sidebar Link | medium | padding-top | 0.4em (6px) | 0.5333em (8px) |
| Sg Sidebar Link | medium | padding-right | 0.875em (13.12px) | 0.8em (12px) |
| Sg Sidebar Link | medium | padding-bottom | 0.4em (6px) | 0.5333em (8px) |
| Sg Sidebar Link | medium | padding-left | 0.875em (13.12px) | 0.8em (12px) |
| Sg Sidebar Link | medium | border-top-left-radius | 10em (150px) | 10.1333em (152px) |
| Sg Sidebar Link | medium | border-top-right-radius | 10em (150px) | 10.1333em (152px) |
| Sg Sidebar Link | medium | border-bottom-left-radius | 10em (150px) | 10.1333em (152px) |
| Sg Sidebar Link | medium | border-bottom-right-radius | 10em (150px) | 10.1333em (152px) |
| Badge | main | padding-top | 0.3125em (4.69px) | 0.2667em (4px) |
| Badge | main | padding-bottom | 0.3125em (4.69px) | 0.2667em (4px) |
| Photo Caption | main | padding-top | 1.125em (18px) | 1em (16px) |
| Photo Caption | main | padding-bottom | 1.125em (18px) | 1em (16px) |
| ol | main | margin-bottom | 10px (10px) | 8px (8px) |
| Tag List | main | grid-column-gap | 0.625em (10px) | 0.5em (8px) |
| Tag List | main | grid-row-gap | 0.625em (10px) | 0.5em (8px) |
| Stat Tile | main | min-height | 5.375em (86px) | 5.5em (88px) |
| Stat Tile | main | padding-right | 0.875em (14px) | 1em (16px) |
| Stat Tile | main | grid-column-gap | 0.4375em (7px) | 0.5em (8px) |
| Nav Mega Head | main | padding-top | 0.6667em (10px) | 0.8em (12px) |
| Nav Mega Head | main | padding-bottom | 0.6667em (10px) | 0.8em (12px) |
| Nav Mega Head | main | grid-column-gap | 0.6667em (10px) | 0.8em (12px) |
| Nav Mega Head | main | grid-row-gap | 0.6667em (10px) | 0.8em (12px) |
| Nav Logo | main | width | 15.875em (254px) | 16em (256px) |
| Services Intro Text | main | grid-row-gap | 1.3125em (21px) | 1.25em (20px) |
| .story-panel.is-outcome | main | border-left-width | 6px (6px) | 8px (8px) |
| Trusted Logos | main | grid-row-gap | 1.0625em (17px) | 1em (16px) |
| Next Step | main | grid-column-gap | 0.875em (14px) | 1em (16px) |
| Page Hero Text | main | max-width | 28.0556em (505px) | 28em (504px) |
| .button-size.is-icon-lead | main | padding-left | 0.375em (6px) | 0.5em (8px) |
| Step Number | main | width | 3.2em (38.4px) | 3.3333em (40px) |
| Step Number | main | height | 3.2em (38.4px) | 3.3333em (40px) |
| Icon Tile Img | main | width | 26px (26px) | 24px (24px) |
| Icon Tile Img | main | height | 26px (26px) | 24px (24px) |
| Footer Nav | main | grid-column-gap | 1.9375em (31px) | 2em (32px) |
| Service Row | main | min-height | 5.0313em (80.5px) | 5em (80px) |
| Service Row | main | padding-right | 0.1875em (3px) | 0.25em (4px) |
| Service Row | main | padding-left | 0.875em (14px) | 1em (16px) |
| Service Row | main | grid-column-gap | 0.875em (14px) | 1em (16px) |
| Sg Swatch Name | main | padding-top | 0.75em (9.75px) | 0.6154em (8px) |
| Sg Swatch Name | main | padding-right | 0.875em (11.38px) | 0.9231em (12px) |
| Sg Swatch Name | main | padding-left | 0.875em (11.38px) | 0.9231em (12px) |
| Sg Tile Box | main | border-top-left-radius | 0.375em (6px) | 0.5em (8px) |
| Sg Tile Box | main | border-top-right-radius | 0.375em (6px) | 0.5em (8px) |
| Sg Tile Box | main | border-bottom-left-radius | 0.375em (6px) | 0.5em (8px) |
| Sg Tile Box | main | border-bottom-right-radius | 0.375em (6px) | 0.5em (8px) |
| Footer Info | main | width | 34.1875em (547px) | 34.25em (548px) |
| Tag | main | padding-top | 0.625em (10px) | 0.5em (8px) |
| Tag | main | padding-bottom | 0.625em (10px) | 0.5em (8px) |
| Tag | main | padding-left | 1.125em (18px) | 1em (16px) |
| Sg Row Class | main | padding-top | 0.25em (3px) | 0.3333em (4px) |
| Sg Row Class | main | padding-right | 0.5em (6px) | 0.6667em (8px) |
| Sg Row Class | main | padding-bottom | 0.25em (3px) | 0.3333em (4px) |
| Sg Row Class | main | padding-left | 0.5em (6px) | 0.6667em (8px) |
| Sg Row Class | main | border-top-left-radius | 0.375em (4.5px) | 0.3333em (4px) |
| Sg Row Class | main | border-top-right-radius | 0.375em (4.5px) | 0.3333em (4px) |
| Sg Row Class | main | border-bottom-left-radius | 0.375em (4.5px) | 0.3333em (4px) |
| Sg Row Class | main | border-bottom-right-radius | 0.375em (4.5px) | 0.3333em (4px) |
| Sg Swatch Value | main | padding-top | 0.25em (2.75px) | 0.3636em (4px) |
| Sg Swatch Value | main | padding-right | 1em (11px) | 1.0909em (12px) |
| Sg Swatch Value | main | padding-bottom | 1em (11px) | 1.0909em (12px) |
| Sg Swatch Value | main | padding-left | 1em (11px) | 1.0909em (12px) |
| Split Copy | main | width | 29.375em (470px) | 29.5em (472px) |
| Check Chip Icon | main | width | 14px (14px) | 16px (16px) |
| Check Chip Icon | main | height | 14px (14px) | 16px (16px) |
| Form Input | main | padding-top | 0.9167em (11px) | 1em (12px) |
| Form Input | main | padding-bottom | 0.9167em (11px) | 1em (12px) |
| Form Grid | main | grid-column-gap | 0.875em (14px) | 1em (16px) |
| Form Grid | main | grid-row-gap | 0.8125em (13px) | 0.75em (12px) |
| Overview Media | main | width | 39.625em (634px) | 39.5em (632px) |
| Overview Media | main | height | 29.125em (466px) | 29em (464px) |
| Services Tabs | main | width | 18.1875em (291px) | 18.25em (292px) |
| Faq Icon | main | width | 2em (28.44px) | 1.9687em (28px) |
| Faq Icon | main | height | 2em (28.44px) | 1.9687em (28px) |
| Quote Hero Contact | main | grid-row-gap | 0.9375em (15px) | 1em (16px) |
| Case Card | main | width | 49.4375em (791px) | 49.5em (792px) |
| Sg Sidebar Title | main | margin-bottom | 1.25em (13.75px) | 1.0909em (12px) |
| Head Row Copy | main | grid-row-gap | 1.125em (18px) | 1em (16px) |
| Quote Card | main | flex-basis | 39.125em (626px) | 39em (624px) |
| Call Card | main | grid-row-gap | 1.125em (18px) | 1em (16px) |
| Stat Tile Text | main | grid-row-gap | 0.1875em (3px) | 0.25em (4px) |
| Aside Service | main | grid-column-gap | 0.625em (10px) | 0.5em (8px) |
| Services Tab Icon | main | width | 2.4286em (38.86px) | 2.5em (40px) |
| Services Tab Icon | main | height | 2.4286em (38.86px) | 2.5em (40px) |
| Quote Card Head | main | grid-row-gap | 0.625em (10px) | 0.5em (8px) |
| Story Photo | main | height | 29.125em (466px) | 29em (464px) |
| .detail-block.is-loose | main | grid-row-gap | 0.625em (10px) | 0.5em (8px) |
| Detail Block | main | grid-row-gap | 0.375em (6px) | 0.5em (8px) |
| Services Card | main | margin-right | -3.0625em (-49px) | -3em (-48px) |
| Services Card | main | margin-left | -3.0625em (-49px) | -3em (-48px) |
| Service Row Arrow | main | width | 2.8333em (34px) | 2.6667em (32px) |
| Service Row Arrow | main | height | 2.8333em (34px) | 2.6667em (32px) |
| Footer Legal | main | grid-row-gap | 0.875em (14px) | 1em (16px) |
| Footer Brand | main | width | 34.125em (546px) | 34em (544px) |
| Article Card Body | main | grid-row-gap | 0.875em (14px) | 1em (16px) |
| Nav Mega Head Icon | main | border-top-left-radius | 0.4em (6px) | 0.5333em (8px) |
| Nav Mega Head Icon | main | border-top-right-radius | 0.4em (6px) | 0.5333em (8px) |
| Nav Mega Head Icon | main | border-bottom-left-radius | 0.4em (6px) | 0.5333em (8px) |
| Nav Mega Head Icon | main | border-bottom-right-radius | 0.4em (6px) | 0.5333em (8px) |
| Quote Card Mark | main | width | 2.5625em (41px) | 2.5em (40px) |
| Quote Card Mark | main | height | 2.5625em (41px) | 2.5em (40px) |
| Sg Table Row | main | padding-top | 0.75em (10.5px) | 0.8571em (12px) |
| Sg Table Row | main | padding-right | 1.25em (17.5px) | 1.1429em (16px) |
| Sg Table Row | main | padding-bottom | 0.75em (10.5px) | 0.8571em (12px) |
| Sg Table Row | main | padding-left | 1.25em (17.5px) | 1.1429em (16px) |
| Sg Table Row | main | grid-column-gap | 1em (14px) | 1.1429em (16px) |
| Sg Table Row | main | grid-row-gap | 1em (14px) | 1.1429em (16px) |
| Check List Item | main | grid-column-gap | 0.6875em (11px) | 0.75em (12px) |
| .glass-card.is-stat | main | width | 14.4375em (231px) | 14.5em (232px) |
| Service Row Number | main | width | 2.8333em (34px) | 2.6667em (32px) |
| Service Row Number | main | height | 2.8333em (34px) | 2.6667em (32px) |
| Segmented Tab | main | padding-top | 0.8125em (13px) | 0.75em (12px) |
| Segmented Tab | main | padding-bottom | 0.8125em (13px) | 0.75em (12px) |
| Segmented Tab | small | padding-top | 0.625em (10px) | 0.5em (8px) |
| Segmented Tab | small | padding-right | 0.875em (14px) | 1em (16px) |
| Segmented Tab | small | padding-bottom | 0.625em (10px) | 0.5em (8px) |
| Segmented Tab | small | padding-left | 0.875em (14px) | 1em (16px) |
| Form More | main | padding-top | 0.8125em (13px) | 0.75em (12px) |
| Form More | main | padding-bottom | 0.3125em (5px) | 0.25em (4px) |
| Form More | main | grid-column-gap | 0.375em (6px) | 0.5em (8px) |
| Trusted Logo Row | main | grid-column-gap | 0.875em (14px) | 1em (16px) |
| Trusted Logo Row | main | grid-row-gap | 0.875em (14px) | 1em (16px) |
| Head Row Text | main | width | 24.625em (394px) | 24.5em (392px) |
| Hero Card Text | main | grid-row-gap | 0.625em (10px) | 0.5em (8px) |
| .chip.is-small | main | padding-top | 0.4615em (6px) | 0.3077em (4px) |
| .chip.is-small | main | padding-bottom | 0.4615em (6px) | 0.3077em (4px) |
| .form-input.is-select | main | padding-right | 2.8333em (34px) | 2.6667em (32px) |
| Services Tab | main | min-height | 4.1786em (58.5px) | 4.2857em (60px) |
| Services Tab | main | padding-top | 0.5em (7px) | 0.5714em (8px) |
| Services Tab | main | padding-right | 0.5em (7px) | 0.5714em (8px) |
| Services Tab | main | padding-bottom | 0.5em (7px) | 0.5714em (8px) |
| Services Tab | main | padding-left | 0.5em (7px) | 0.5714em (8px) |
| Services Tab | main | grid-column-gap | 0.5em (7px) | 0.5714em (8px) |
| Footer Contact | main | grid-row-gap | 0.875em (14px) | 1em (16px) |
| Trust Card | main | grid-row-gap | 0.625em (10px) | 0.5em (8px) |
| Nav Drop Link | main | padding-top | 0.6667em (10px) | 0.8em (12px) |
| Nav Drop Link | main | padding-bottom | 0.6667em (10px) | 0.8em (12px) |
| Nav Drop Link | main | border-top-left-radius | 0.4em (6px) | 0.5333em (8px) |
| Nav Drop Link | main | border-top-right-radius | 0.4em (6px) | 0.5333em (8px) |
| Nav Drop Link | main | border-bottom-left-radius | 0.4em (6px) | 0.5333em (8px) |
| Nav Drop Link | main | border-bottom-right-radius | 0.4em (6px) | 0.5333em (8px) |
