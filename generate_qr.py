from PyPDF2 import PdfReader, PdfWriter
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.utils import ImageReader

# === Step 1: Define file paths ===
cv_path = "NKETIA_JEFFRED_CV_u.pdf"     # your existing CV
qr_path = "portfolio_qr_named.png"      # your generated QR code
output_path = "NKETIA_JEFFRED_CV_withQR.pdf"  # new CV with QR added

# === Step 2: Create a temporary overlay PDF with the QR code ===
packet_path = "overlay.pdf"
c = canvas.Canvas(packet_path, pagesize=letter)

# === Step 3: Position of QR (x, y in points) ===
# You can adjust these values to move the QR up/down or left/right
x_position = 420  # from left
y_position = 650  # from bottom

# Load and draw the QR code
qr_image = ImageReader(qr_path)
c.drawImage(qr_image, x_position, y_position, width=120, height=120, mask='auto')

c.save()

# === Step 4: Merge the overlay with your CV ===
reader = PdfReader(cv_path)
writer = PdfWriter()
overlay = PdfReader(packet_path)

for page in reader.pages:
    page.merge_page(overlay.pages[0])
    writer.add_page(page)
    break  # only apply to first page (remove this line to apply to all)

# === Step 5: Save new PDF ===
with open(output_path, "wb") as f:
    writer.write(f)

print(f"✅ QR code added successfully! Saved as: {output_path}")
