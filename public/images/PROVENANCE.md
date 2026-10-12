# Image provenance

This book carries two kinds of picture, and they are never mixed up in the interface.

**1. Photographs of real things.** Every photograph is a real photograph from Wikimedia Commons. Each licence was read from the Commons record (LicenseShortName, Artist and DateTimeOriginal, via the Commons API) before use. Captions, credits and licences shown in the book are taken from these records. Every photograph is captioned with the photographer's name and a link to its Commons record.

**2. Illustrations made for this book.** The chapter plates in `images/art/eras/` are original digital paintings made for this project. They are atmospheric illustrations, not historical records and not reconstructions of specific events: they show a typical place or scene from a period, painted in a period-appropriate palette. The book says so on the face of each one, in the caption under the plate, and in the Evidence panel, because a nine-year-old reader deserves to know the difference between a photograph and a painting. They were produced with an image-generation model from art direction written for this book; they are not photographs, not scans, and not presented as evidence for any claim.

**3. Maps drawn from real data.** The atlas and the map devices are drawn in the browser with d3-geo, from Natural Earth boundary data (public domain) via the `world-atlas` package. Coastlines, borders and every site marker are projected from real longitudes and latitudes. The mountain marks are placed at the real coordinates of named ranges. The plate states this in its own caption, and the two enlarged plates (the Cape and the Highveld) exist because places in those corners are too close together to letter honestly on a single plate.

| File | Shown in | Photographer (as recorded) | Licence | Commons page |
|---|---|---|---|---|
| cape-town-robben-island.jpg | Prologue, Ch 6 | Andreas Tusche (2004-11-14) | CC BY-SA 3.0 | https://commons.wikimedia.org/wiki/File:Cape_Town_and_Robben_Island_seen_from_Table_Mountain.jpg |
| blombos-lithic-industries.jpg | Ch 1 | Katja Douze, Sarah Wurz, Christopher S. Henshilwood (2019-05-11) | CC BY 4.0 | https://commons.wikimedia.org/wiki/File:Lithic_Industries_at_Blombos_Cave,_Southern_Cape,_South_Africa_(c._105_%E2%80%93_90_Ka).jpg |
| mapungubwe-hill.jpg | Ch 2 | Marius Loots (2003-04-01) | CC BY-SA 3.0 | https://commons.wikimedia.org/wiki/File:Mapungubwe_hill_limpopo.jpg |
| table-mountain-camps-bay.jpg | Ch 4 | Sumit Surai (2018-07-17) | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Cape_Town_-View_From_The_Table_Mountain.jpg |
| castle-main-entrance.jpg | Ch 5 | Roché Petersen (2012-03-31) | CC BY-SA 3.0 | https://commons.wikimedia.org/wiki/File:Castle_of_Good_Hope_Main_Entrance.jpg |
| castle-of-good-hope.jpg | Ch 5 | Michael Fu (2011-12-08) | CC BY-SA 3.0 | https://commons.wikimedia.org/wiki/File:Castle_of_Good_Hope.jpg |
| mandela-cell-schavda.jpg | Ch 6 | Schavda (2011-10-20) | CC BY-SA 3.0 | https://commons.wikimedia.org/wiki/File:Nelson_Mandela's_cell-Robben_Island.jpg |
| castle-front-entrance.jpg | Ch 7 | Debbielouise (2012-09-29) | CC BY-SA 3.0 | https://commons.wikimedia.org/wiki/File:The_Castle_of_Good_Hope_Cape_Town_-_Front_Entrance_to_the_Castle_2.JPG |
| isandlwana-battlefield.jpg | Ch 8 | RedNovember82 (2012-04-28) | CC BY-SA 3.0 | https://commons.wikimedia.org/wiki/File:Isandlwana_Battlefield.JPG |
| isandlwana-panorama.jpg | Ch 8 | Bizcallers (2010-08-29) | CC BY-SA 3.0 | https://commons.wikimedia.org/wiki/File:View_Of_the_Isandlwana_Battlefield.jpg |
| union-buildings.jpg | Ch 9, Ch 11 | Zakysant (2004-10-16) | CC BY-SA 3.0 | https://commons.wikimedia.org/wiki/File:Union-buildings-pretoria.JPG |
| parliament-cape-town.jpg | Ch 9, Ch 11 | Discott (2013-09-24) | CC BY-SA 3.0 | https://commons.wikimedia.org/wiki/File:Houses_of_Parliament,_Parliament_Street,_Cape_Town_WLM_2013.JPG |
| mandela-cell-mannix.jpg | Ch 10 opener | Paul Mannix (2007-06-03) | CC BY-SA 2.0 | https://commons.wikimedia.org/wiki/File:Nelson_Mandela%27s_prison_cell,_Robben_Island,_South_Africa.jpg |
| hector-pieterson-grave.jpg | Ch 10 | Andrew Hall (2017-02-08) | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Hector_Pieterson's_Grave,_Avalon_Cemetery,_Soweto.jpg |

Images are resized copies of the Commons originals, metadata stripped. The original licence terms apply to each file; see the Commons page for the full licence text.

## Illustrations made for this book

| File | Shown at | What it is |
|---|---|---|
| art/eras/era-deep-time.jpg | Ch 1 opener | Painting: a coastal cave at dusk, with rock-art figures in firelight |
| art/eras/era-kingdoms.jpg | Ch 2 opener | Painting: a dry-stone hilltop settlement on the highveld at sunset |
| art/eras/era-ocean.jpg | Ch 3 opener | Painting: a small sailing ship alone on a vast grey ocean |
| art/eras/era-table-bay.jpg | Ch 4 opener | Painting: three ships entering Table Bay beneath the mountain, at dawn |
| art/eras/era-castle.jpg | Ch 5 opener | Painting: a five-bastion stone fort on the coastal plain, late afternoon |
| art/eras/era-island.jpg | Ch 6 opener | Painting: a low island across cold water, seen from a rocky shore |
| art/eras/era-gold.jpg | Ch 8 opener | Painting: a mine headframe on a treeless ridge under a huge pale sky |
| art/eras/era-struggle.jpg | Ch 10 opener | Painting: a township skyline at dusk, with lamps coming on |
| art/eras/era-democracy.jpg | Ch 11 opener | Painting: a very long queue winding across a dry field at dawn |
| art/eras/era-today.jpg | Ch 12 opener | Painting: a modern city beneath a flat-topped mountain at first light |

Chapters 7 and 9 have no painted plate: they use their own photographs, and the atlas carries their places on the map instead.

## Map data

| Source | Used for | Licence |
|---|---|---|
| Natural Earth, via `world-atlas` (`countries-50m`, `countries-110m`) | Coastlines, borders and site positions in the atlas and the map devices | Public domain |
| `src/data/southern-africa-50m.json` | The seven countries this book draws, extracted from the 50m set | Public domain (derived) |

## Excluded
- Mapungubwe golden rhinoceros photo (Commons "Mapungubwe gold rhino on display gold gallery", Sian Tiley-Nel, CC BY-SA 4.0). Its description conflicts with a museum record (a replica), so it is not used, and the file was removed from the build so that nothing unverified can be served by accident.
- Nelson Mandela's prison cell at Robben Island (CC BY 3.0 vs CC BY 1.0 conflict in Commons records).
- Sam Nzima's 1976 photograph of Hector Pieterson: the licence could not be verified.
- Sharpeville, Thaba Bosiu and Mandela 1990 search results: no usable verified photograph found.
- Hector Pieterson memorial sculpture: "Public domain" tag doubtful; the grave photo is used instead.
