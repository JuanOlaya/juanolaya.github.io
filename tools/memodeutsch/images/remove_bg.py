from PIL import Image, ImageDraw

def remove_background(input_path, output_path, tolerance=30):
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()
    
    # Get the background color from the top-left pixel
    bg_color = img.getpixel((0, 0))
    
    # Use floodfill to make background transparent
    # Since ImageDraw.floodfill might not support alpha replacement directly in some versions or is tricky,
    # we can try a seed fill approach or just use the seed from corner.
    # Actually, ImageDraw.floodfill is available in recent Pillow.
    
    try:
        ImageDraw.floodfill(img, xy=(0, 0), value=(0, 0, 0, 0), thresh=tolerance)
        # Try other corners just in case connectivity is broken by the shape touching edges
        width, height = img.size
        ImageDraw.floodfill(img, xy=(width-1, 0), value=(0, 0, 0, 0), thresh=tolerance)
        ImageDraw.floodfill(img, xy=(0, height-1), value=(0, 0, 0, 0), thresh=tolerance)
        ImageDraw.floodfill(img, xy=(width-1, height-1), value=(0, 0, 0, 0), thresh=tolerance)
    except Exception as e:
        print(f"Floodfill failed: {e}")
        # Fallback: simple color replacement if floodfill fails (less accurate for internal whites)
        newData = []
        for item in datas:
            if item[0] > 255-tolerance and item[1] > 255-tolerance and item[2] > 255-tolerance:
                newData.append((255, 255, 255, 0))
            else:
                newData.append(item)
        img.putdata(newData)

    img.save(output_path, "PNG")
    print(f"Saved to {output_path}")

if __name__ == "__main__":
    remove_background("app_icon.png", "app_icon.png")
