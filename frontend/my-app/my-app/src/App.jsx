import { useState } from "react";

function App() {
  const [loading, setLoading] = useState(false);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);

    const res = await loadRazorpayScript();
    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      setLoading(false);
      return;
    }

    try {
      const orderResponse = await fetch(
        "http://localhost:3000/api/checkout/createorder",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: "6902e2fe4a97d83ba072425c" }),
        }
      );

      const data = await orderResponse.json();
      console.log("Order created:", data);

      if (!data || !data.razorpayOrderId) {
        alert("Server error. Cannot create order.");
        setLoading(false);
        return;
      }

      const options = {
        key: "rzp_test_Rc23zKSi6P5WfQ",
        amount: data.finalAmount,
        currency: data.currency,
        name: "blackterry",
        description: "Purchase",
        order_id: data.razorpayOrderId,
        handler: async function (response) {
          console.log("Payment success:", response);

          try {
            const verifyResponse = await fetch(
              "http://localhost:3000/api/checkout/verifypayment",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  userId: "6902e2fe4a97d83ba072425c",
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                }),
              }
            );

            if (verifyResponse.ok) {
              const verifyData = await verifyResponse.json();
              const invoiceResponse = await fetch(
                `http://localhost:3000/api/checkout/invoice/${verifyData.order._id}`
              );
              if (invoiceResponse.ok) {
                const blob = await invoiceResponse.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `invoice_${verifyData.order._id}.pdf`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                alert("Payment verified and invoice downloaded!");
              }else{
                alert('Invoice generation failed!')
              }
            } else {
              const err = await verifyResponse.json();
              console.error("Verification failed:", err);
              alert("Payment verified failed!");
            }
          } catch (verifyError) {
            console.error("Error verifying payment:", verifyError);
            alert("Something went wrong during verification!");
          }
        },
        prefill: {
          name: "John Doe",
          email: "john@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
      setLoading(false);
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Razorpay Payment Page</h2>
      <button
        onClick={handlePayment}
        style={{
          padding: "1rem 2rem",
          fontSize: "16px",
          cursor: "pointer",
          backgroundColor: "#3399cc",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
        }}
        disabled={loading}
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
}

export default App;
