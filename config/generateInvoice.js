// config/generateInvoice.js
const PDFDocument = require("pdfkit");

function generateInvoice(order, user) {
  const doc = new PDFDocument({ margin: 50 });

  // === Header ===
  doc.fontSize(20).text("Invoice", { align: "center" });
  doc.moveDown();

  // === Basic Info ===
  doc.fontSize(12).text(`Order ID: ${order._id}`);
  doc.text(`Order Date: ${new Date(order.orderDate).toLocaleString()}`);
  doc.text(`Payment Method: ${order.paymentMethod}`);
  doc.text(`Payment Status: ${order.paymentStatus}`);
  doc.text(`Order Status: ${order.orderStatus}`);
  doc.moveDown();

  // === User Address (if available) ===
  if (order.address) {
    doc.fontSize(14).text("Billing Address:");
    const addr = order.address;
    doc.fontSize(12).text(
      `${addr.firstname || ""} ${addr.lastname || ""}\n${addr.street || ""}\n${addr.city || ""}, ${addr.state || ""} - ${addr.pincode || ""}\n${addr.country || ""}\n${addr.phone || ""}`
    );
    doc.moveDown();
  }

  // === Product Details ===
  doc.fontSize(14).text("Products:", { underline: true });
  doc.moveDown(0.5);

  order.products.forEach((item, index) => {
    doc.fontSize(12).text(
      `${index + 1}. ${item.title || item.productId?.title || "Product"}  -  ₹${item.price} x ${item.quantity} = ₹${item.totalPrice}`
    );
  });

  doc.moveDown();

  // === Summary ===
  doc.fontSize(14).text(`Discount: ₹${order.discountAmount || 0}`);
  doc.text(`Final Amount: ₹${order.finalAmount}`);
  doc.moveDown();

  doc.fontSize(12).text("Thank you for shopping with us!", {
    align: "center",
  });

  // ✅ Important: return the PDFDocument stream
  return doc;
}

module.exports = generateInvoice;
