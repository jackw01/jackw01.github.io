from PIL import Image
import os, sys

for infile in sys.argv[1:]:
    type = os.path.splitext(infile)[1][1:]
    outfile = os.path.splitext(infile)[0] + '-small.' + type
    if infile != outfile:
        im = Image.open(infile)
        im.thumbnail((1024, 768), Image.ANTIALIAS)
        im.save(outfile, type.replace('jpg', 'jpeg'))
