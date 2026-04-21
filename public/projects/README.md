Add project gallery images inside the folder that matches the project slug.

For Rocket, use:

```txt
public/projects/rocket/
```

Supported formats:

```txt
.avif
.gif
.jpeg
.jpg
.m4v
.mov
.mp4
.png
.webm
.webp
```

Each project page shows every supported image and video in its folder. Media is
sorted by filename, so names like `1-overview.jpg`, `2-demo.mp4`,
`10-final.jpg` appear in numeric order.

To replace the large top project visual, add `header` or `hero` to that image
filename, for example:

```txt
01-rocket-header.jpg
```

Header/hero images are shown only in the top visual slot and are skipped in the
gallery below.

Videos are shown in the gallery only. For the best browser support, prefer
`.mp4` or `.webm`.
